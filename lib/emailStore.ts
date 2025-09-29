import { promises as fs } from 'fs';
import path from 'path';
import { STORAGE_PATH } from './config';

export interface StoredEmail {
  id: string;
  from: string;
  to: string[];
  subject: string;
  text: string;
  html?: string;
  date: string;
  raw: string;
}

class EmailStore {
  private filePath: string;
  private initialized = false;

  constructor(filePath: string) {
    this.filePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  }

  private async ensureFile(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });

    try {
      await fs.access(this.filePath);
    } catch {
      await fs.writeFile(this.filePath, JSON.stringify([]), 'utf-8');
    }

    this.initialized = true;
  }

  private async readAll(): Promise<StoredEmail[]> {
    await this.ensureFile();
    const data = await fs.readFile(this.filePath, 'utf-8');
    if (!data) {
      return [];
    }

    try {
      const parsed = JSON.parse(data) as StoredEmail[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to parse stored emails; resetting store', error);
      await fs.writeFile(this.filePath, JSON.stringify([]), 'utf-8');
      return [];
    }
  }

  private async writeAll(emails: StoredEmail[]): Promise<void> {
    await this.ensureFile();
    await fs.writeFile(this.filePath, JSON.stringify(emails, null, 2), 'utf-8');
  }

  async getAll(): Promise<StoredEmail[]> {
    const emails = await this.readAll();
    return emails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getById(id: string): Promise<StoredEmail | undefined> {
    const emails = await this.readAll();
    return emails.find((email) => email.id === id);
  }

  async append(email: StoredEmail): Promise<void> {
    const emails = await this.readAll();
    emails.push(email);
    await this.writeAll(emails);
  }

  async clear(): Promise<void> {
    await this.writeAll([]);
  }
}

export const emailStore = new EmailStore(STORAGE_PATH);
