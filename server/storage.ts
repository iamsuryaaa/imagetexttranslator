import {
  Document,
  InsertDocument,
  Translation,
  InsertTranslation,
  Summary,
  InsertSummary,
  User,
  InsertUser,
} from "@shared/schema";

// Storage interface for CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Document operations
  createDocument(document: InsertDocument): Promise<Document>;
  getDocument(id: number): Promise<Document | undefined>;
  updateDocument(id: number, document: Partial<Document>): Promise<Document | undefined>;
  getAllDocuments(): Promise<Document[]>;

  // Translation operations
  createTranslation(translation: InsertTranslation): Promise<Translation>;
  getTranslationsByDocumentId(documentId: number): Promise<Translation[]>;
  getTranslationByDocumentIdAndLanguage(
    documentId: number,
    language: string
  ): Promise<Translation | undefined>;

  // Summary operations
  createSummary(summary: InsertSummary): Promise<Summary>;
  getSummaryByDocumentId(documentId: number): Promise<Summary | undefined>;
  getSummaryByDocumentIdAndLanguage(
    documentId: number,
    language: string
  ): Promise<Summary | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private documents: Map<number, Document>;
  private translations: Map<number, Translation>;
  private summaries: Map<number, Summary>;
  private currentUserId: number;
  private currentDocumentId: number;
  private currentTranslationId: number;
  private currentSummaryId: number;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.translations = new Map();
    this.summaries = new Map();
    this.currentUserId = 1;
    this.currentDocumentId = 1;
    this.currentTranslationId = 1;
    this.currentSummaryId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Document operations
  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.currentDocumentId++;
    const now = new Date();
    const newDocument: Document = {
      ...document,
      id,
      processed: false,
      uploadedAt: now,
    };
    this.documents.set(id, newDocument);
    return newDocument;
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async updateDocument(
    id: number,
    documentUpdate: Partial<Document>
  ): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;

    const updatedDocument = { ...document, ...documentUpdate };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  async getAllDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  // Translation operations
  async createTranslation(translation: InsertTranslation): Promise<Translation> {
    const id = this.currentTranslationId++;
    const now = new Date();
    const newTranslation: Translation = {
      ...translation,
      id,
      createdAt: now,
    };
    this.translations.set(id, newTranslation);
    return newTranslation;
  }

  async getTranslationsByDocumentId(documentId: number): Promise<Translation[]> {
    return Array.from(this.translations.values()).filter(
      (translation) => translation.documentId === documentId
    );
  }

  async getTranslationByDocumentIdAndLanguage(
    documentId: number,
    language: string
  ): Promise<Translation | undefined> {
    return Array.from(this.translations.values()).find(
      (translation) =>
        translation.documentId === documentId && translation.language === language
    );
  }

  // Summary operations
  async createSummary(summary: InsertSummary): Promise<Summary> {
    const id = this.currentSummaryId++;
    const now = new Date();
    const newSummary: Summary = {
      ...summary,
      id,
      createdAt: now,
    };
    this.summaries.set(id, newSummary);
    return newSummary;
  }

  async getSummaryByDocumentId(documentId: number): Promise<Summary | undefined> {
    return Array.from(this.summaries.values()).find(
      (summary) => summary.documentId === documentId
    );
  }

  async getSummaryByDocumentIdAndLanguage(
    documentId: number,
    language: string
  ): Promise<Summary | undefined> {
    return Array.from(this.summaries.values()).find(
      (summary) => summary.documentId === documentId && summary.language === language
    );
  }
}

export const storage = new MemStorage();
