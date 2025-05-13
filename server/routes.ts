import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { extractTextFromImage, extractTextFromTextFile, isImage, isTextFile } from "./lib/ocr";
import { translateText, isTranslationApiConfigured, generateSpeechMarkup } from "./lib/translate";
import { summarizeText, isSummarizationApiConfigured } from "./lib/summarize";
import { LanguageCode, insertDocumentSchema, processDocumentSchema } from "@shared/schema";
import { z } from "zod";

// Configure multer for in-memory file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Endpoint to check API configurations
  app.get("/api/config", (req, res) => {
    res.json({
      translationApiConfigured: isTranslationApiConfigured(),
      summarizationApiConfigured: isSummarizationApiConfigured(),
    });
  });

  // Endpoint to upload a file
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const file = req.file;
      
      // Validate file type
      if (!isImage(file.mimetype) && !isTextFile(file.mimetype)) {
        return res.status(400).json({ 
          message: "Invalid file type. Supported formats: JPG, PNG, PDF, DOCX, TXT" 
        });
      }

      // Extract text from the file
      let originalText = "";
      if (isImage(file.mimetype)) {
        originalText = await extractTextFromImage(file.buffer);
      } else {
        originalText = extractTextFromTextFile(file.buffer);
      }

      // Create a document in storage
      const documentToInsert = insertDocumentSchema.parse({
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        originalText,
        userId: null, // No user authentication for now
      });

      const document = await storage.createDocument(documentToInsert);

      res.status(201).json({ document });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to process file upload" });
    }
  });

  // Endpoint to process a document (translate and/or summarize)
  app.post("/api/documents/:id/process", async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      if (isNaN(documentId)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }

      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      const processRequest = processDocumentSchema.parse({
        documentId,
        ...req.body,
      });

      // Check if document has original text
      if (!document.originalText) {
        return res.status(400).json({ message: "Document has no text content to process" });
      }

      // Get existing translation or create a new one
      let translation = await storage.getTranslationByDocumentIdAndLanguage(
        documentId,
        processRequest.targetLanguage
      );

      if (!translation) {
        // Get translated text with the new api
        const translatedText = await translateText(
          document.originalText,
          processRequest.targetLanguage as LanguageCode
        );
        
        // Store just the translated text without any HTML
        translation = await storage.createTranslation({
          documentId,
          language: processRequest.targetLanguage,
          translatedText: translatedText,
        });
      }

      // Create a summary if requested
      let summary = null;
      if (processRequest.summarize) {
        // Try to get existing summary
        summary = await storage.getSummaryByDocumentIdAndLanguage(
          documentId,
          "original" // Original language summary
        );

        // If no summary exists, create one
        if (!summary) {
          const summaryText = await summarizeText(document.originalText);
          summary = await storage.createSummary({
            documentId,
            language: "original",
            summary: summaryText,
          });
        }
      }

      // Mark document as processed
      await storage.updateDocument(documentId, { processed: true });

      res.json({
        document,
        translation,
        summary,
      });
    } catch (error) {
      console.error("Error processing document:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process document" });
    }
  });

  // Endpoint to get a document by ID
  app.get("/api/documents/:id", async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      if (isNaN(documentId)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }

      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Get all translations for this document
      const translations = await storage.getTranslationsByDocumentId(documentId);
      
      // Get summary if available
      const summary = await storage.getSummaryByDocumentId(documentId);

      res.json({
        document,
        translations,
        summary,
      });
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  // Endpoint to get all documents
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getAllDocuments();
      res.json({ documents });
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
