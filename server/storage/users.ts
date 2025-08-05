import { eq } from 'drizzle-orm';
import { users, type User, type InsertUser } from "@shared/schema";
import { BaseStorage } from './base';

export class UserStorage extends BaseStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(userData: {
    email: string;
    passwordHash: string;
    displayName: string;
    fullName: string;
    dateOfBirth?: string | null;
    school?: string | null;
    gender?: string | null;
    phone?: string | null;
    userImage?: string | null;
    role?: string;
  }) {
    const result = await this.db.insert(users).values({
      email: userData.email,
      passwordHash: userData.passwordHash,
      displayName: userData.displayName,
      fullName: userData.fullName,
      dateOfBirth: userData.dateOfBirth,
      school: userData.school,
      gender: userData.gender,
      phone: userData.phone,
      userImage: userData.userImage,
      role: userData.role || 'member',
    }).returning();
    return result[0];
  }

  async updateUserRole(userId: string, role: string): Promise<User | null> {
    const result = await this.db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning();
    return result[0] || null;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const result = await this.db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getUsers() {
    return await this.db.select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      fullName: users.fullName,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
      lastLogin: users.lastLogin
    }).from(users).orderBy(users.createdAt);
  }
}
