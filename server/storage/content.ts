import { eq, asc } from 'drizzle-orm';
import { contentPages, type ContentPage } from "@shared/schema";
import { BaseStorage } from './base';

export class ContentStorage extends BaseStorage {
  async getContentPages(): Promise<ContentPage[]> {
    return await this.db.select().from(contentPages).orderBy(asc(contentPages.title));
  }

  async getContentPageBySlug(slug: string): Promise<ContentPage | undefined> {
    const result = await this.db.select().from(contentPages).where(eq(contentPages.slug, slug)).limit(1);
    return result[0];
  }

  async createContentPage(page: Partial<ContentPage>): Promise<ContentPage> {
    const pageData = {
      ...page,
      blocks: page.blocks || [],
      status: page.status || 'draft',
      lastModified: new Date().toISOString().split('T')[0],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await this.db.insert(contentPages).values(pageData as any).returning();
    return result[0];
  }

  async updateContentPage(id: string, updates: Partial<ContentPage>): Promise<ContentPage | undefined> {
    const updateData = {
      ...updates,
      lastModified: new Date().toISOString().split('T')[0],
      updatedAt: new Date()
    };
    const result = await this.db.update(contentPages).set(updateData).where(eq(contentPages.id, id)).returning();
    return result[0];
  }

  async deleteContentPage(id: string): Promise<boolean> {
    const result = await this.db.delete(contentPages).where(eq(contentPages.id, id));
    return (result.rowCount || 0) > 0;
  }
}
