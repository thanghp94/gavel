import { eq, and, desc } from 'drizzle-orm';
import { 
  reflections, 
  meetings, 
  users,
  type Reflection, 
  type InsertReflection 
} from "@shared/schema";
import { BaseStorage } from './base';

export class ReflectionStorage extends BaseStorage {
  async getReflections(meetingId: string): Promise<Reflection[]> {
    return await this.db.select().from(reflections).where(eq(reflections.meetingId, meetingId));
  }

  async createReflection(reflection: InsertReflection): Promise<Reflection> {
    const result = await this.db.insert(reflections).values(reflection).returning();
    return result[0];
  }

  async getUserReflection(userId: string, meetingId: string): Promise<Reflection | undefined> {
    const result = await this.db.select().from(reflections)
      .where(and(eq(reflections.userId, userId), eq(reflections.meetingId, meetingId)))
      .limit(1);
    return result[0];
  }

  async getUserReflections(userId: string): Promise<Reflection[]> {
    const results = await this.db
      .select({
        id: reflections.id,
        userId: reflections.userId,
        meetingId: reflections.meetingId,
        nameInput: reflections.nameInput,
        q1: reflections.q1,
        q2: reflections.q2,
        q3: reflections.q3,
        q4: reflections.q4,
        q5: reflections.q5,
        submittedAt: reflections.submittedAt,
        meetingTitle: meetings.title,
        meetingDate: meetings.date
      })
      .from(reflections)
      .innerJoin(meetings, eq(reflections.meetingId, meetings.id))
      .where(eq(reflections.userId, userId))
      .orderBy(desc(reflections.submittedAt));

    return results;
  }

  async getAllReflections() {
    try {
      const results = await this.db
        .select({
          id: reflections.id,
          meetingId: reflections.meetingId,
          userId: reflections.userId,
          nameInput: reflections.nameInput,
          q1: reflections.q1,
          q2: reflections.q2,
          q3: reflections.q3,
          q4: reflections.q4,
          q5: reflections.q5,
          submittedAt: reflections.submittedAt,
          meetingTitle: meetings.title,
          meetingDate: meetings.date,
          userDisplayName: users.displayName
        })
        .from(reflections)
        .innerJoin(meetings, eq(reflections.meetingId, meetings.id))
        .innerJoin(users, eq(reflections.userId, users.id))
        .orderBy(desc(reflections.submittedAt));

      return results;
    } catch (error) {
      console.error('Error fetching all reflections:', error);
      return [];
    }
  }
}
