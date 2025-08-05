import { eq, desc } from 'drizzle-orm';
import { announcements } from "@shared/schema";
import { BaseStorage } from './base';

export class AnnouncementStorage extends BaseStorage {
  async getAnnouncements() {
    return await this.db.select().from(announcements).orderBy(desc(announcements.createdAt));
  }

  async createAnnouncement(announcement: { title: string; content: string; status?: string; createdBy: string }) {
    const result = await this.db.insert(announcements).values(announcement).returning();
    return result[0];
  }

  async updateAnnouncement(id: string, updates: Partial<{ title: string; content: string; status: string }>) {
    const result = await this.db.update(announcements).set(updates).where(eq(announcements.id, id)).returning();
    return result[0];
  }

  async deleteAnnouncement(id: string) {
    const result = await this.db.delete(announcements).where(eq(announcements.id, id));
    return (result.rowCount || 0) > 0;
  }
}
