import { eq, asc } from 'drizzle-orm';
import { roles, type Role } from "@shared/schema";
import { BaseStorage } from './base';

export class RoleStorage extends BaseStorage {
  async getRoles(): Promise<Role[]> {
    return await this.db.select().from(roles).orderBy(asc(roles.name));
  }

  async getRole(id: string): Promise<Role | undefined> {
    const result = await this.db.select().from(roles).where(eq(roles.id, id)).limit(1);
    return result[0];
  }
}
