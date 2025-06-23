import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq, and, asc } from 'drizzle-orm';
import {
  users,
  meetings,
  roles,
  roleContent,
  meetingRoles,
  attendance,
  reflections,
  contentPages,
  learningMaterials,
  type User,
  type InsertUser,
  type Meeting,
  type InsertMeeting,
  type Role,
  type Reflection,
  type InsertReflection,
  type ContentPage
} from "@shared/schema";

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsers(): Promise<any[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Meeting methods
  getMeetings(): Promise<Meeting[]>;
  getMeeting(id: string): Promise<Meeting | undefined>;
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  updateMeeting(id: string, updates: Partial<InsertMeeting>): Promise<Meeting | undefined>;

  // Role methods
  getRoles(): Promise<Role[]>;
  getRole(id: string): Promise<Role | undefined>;

  // Reflection methods
  getReflections(meetingId: string): Promise<Reflection[]>;
  createReflection(reflection: InsertReflection): Promise<Reflection>;
  getUserReflection(userId: string, meetingId: string): Promise<Reflection | undefined>;

  // Content page methods
  getContentPages(): Promise<ContentPage[]>;
  getContentPageBySlug(slug: string): Promise<ContentPage | undefined>;
  createContentPage(page: Partial<ContentPage>): Promise<ContentPage>;
  updateContentPage(id: string, updates: Partial<ContentPage>): Promise<ContentPage | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUserRole(userId: string, role: string): Promise<User | null> {
    const result = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning();
    return result[0] || null;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  // Meeting methods
  async getMeetings(): Promise<Meeting[]> {
    return await db.select().from(meetings).orderBy(asc(meetings.date));
  }

  async getMeeting(id: string): Promise<Meeting | undefined> {
    const result = await db.select().from(meetings).where(eq(meetings.id, id)).limit(1);
    return result[0];
  }

  async createMeeting(meeting: InsertMeeting): Promise<Meeting> {
    const result = await db.insert(meetings).values(meeting).returning();
    return result[0];
  }

  async updateMeeting(id: string, updates: Partial<InsertMeeting>): Promise<Meeting | undefined> {
    const result = await db.update(meetings).set(updates).where(eq(meetings.id, id)).returning();
    return result[0];
  }

  // Role methods
  async getRoles(): Promise<Role[]> {
    return await db.select().from(roles).orderBy(asc(roles.name));
  }

  async getRole(id: string): Promise<Role | undefined> {
    const result = await db.select().from(roles).where(eq(roles.id, id)).limit(1);
    return result[0];
  }

  // Reflection methods
  async getReflections(meetingId: string): Promise<Reflection[]> {
    return await db.select().from(reflections).where(eq(reflections.meetingId, meetingId));
  }

  async createReflection(reflection: InsertReflection): Promise<Reflection> {
    const result = await db.insert(reflections).values(reflection).returning();
    return result[0];
  }

  async getUserReflection(userId: string, meetingId: string): Promise<Reflection | undefined> {
    const result = await db.select().from(reflections)
      .where(and(eq(reflections.userId, userId), eq(reflections.meetingId, meetingId)))
      .limit(1);
    return result[0];
  }

  // Content page methods
  async getContentPages(): Promise<ContentPage[]> {
    return await db.select().from(contentPages).orderBy(asc(contentPages.title));
  }

  async getContentPageBySlug(slug: string): Promise<ContentPage | undefined> {
    const result = await db.select().from(contentPages).where(eq(contentPages.slug, slug)).limit(1);
    return result[0];
  }

  async createContentPage(page: Partial<ContentPage>): Promise<ContentPage> {
    const result = await db.insert(contentPages).values(page as any).returning();
    return result[0];
  }

  async updateContentPage(id: string, updates: Partial<ContentPage>): Promise<ContentPage | undefined> {
    const result = await db.update(contentPages).set(updates).where(eq(contentPages.id, id)).returning();
    return result[0];
  }

  async getUsers() {
    return await db.select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
      lastLogin: users.lastLogin
    }).from(users).orderBy(users.createdAt);
  }
}

export const storage = new DatabaseStorage();