import { eq, sql } from 'drizzle-orm';
import { 
  tasks, 
  teams, 
  teamMembers, 
  users,
  type Task, 
  type InsertTask,
  type Team,
  type InsertTeam,
  type TeamMember
} from "@shared/schema";
import { BaseStorage } from './base';

export class TaskStorage extends BaseStorage {
  // Task methods
  async getTasks(teamId?: string): Promise<Task[]> {
    const query = this.db
      .select()
      .from(tasks)
      .leftJoin(users, eq(tasks.assigneeId, users.id))
      .leftJoin(teams, eq(tasks.teamId, teams.id));

    const result = teamId 
      ? await query.where(eq(tasks.teamId, teamId))
      : await query;

    return result.map(row => ({
      ...row.tasks,
      assignee: row.users ? { id: row.users.id, displayName: row.users.displayName } : undefined,
      team: row.teams ? { id: row.teams.id, name: row.teams.name, type: row.teams.type } : undefined
    }));
  }

  async getTask(id: string): Promise<Task | undefined> {
    const [result] = await this.db.select().from(tasks).where(eq(tasks.id, id));
    return result;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [created] = await this.db.insert(tasks).values(task).returning();
    return created;
  }

  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const [updated] = await this.db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    return updated;
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await this.db.delete(tasks).where(eq(tasks.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Team methods
  async getTeams(): Promise<Team[]> {
    const result = await this.db
      .select({
        team: teams,
        leader: {
          id: users.id,
          displayName: users.displayName,
        },
        memberCount: sql<number>`(SELECT COUNT(*) FROM ${teamMembers} WHERE team_id = ${teams.id})`
      })
      .from(teams)
      .leftJoin(users, eq(teams.leaderId, users.id));

    return result.map(r => ({ ...r.team, leader: r.leader, memberCount: r.memberCount }));
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const [result] = await this.db.select().from(teams).where(eq(teams.id, id));
    return result;
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [created] = await this.db.insert(teams).values(team).returning();
    return created;
  }

  async updateTeam(id: string, updates: Partial<InsertTeam>): Promise<Team | undefined> {
    const [updated] = await this.db
      .update(teams)
      .set(updates)
      .where(eq(teams.id, id))
      .returning();
    return updated;
  }

  async deleteTeam(id: string): Promise<boolean> {
    const result = await this.db.delete(teams).where(eq(teams.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getTeamMembers(teamId: string): Promise<any[]> {
    const result = await this.db
      .select({
        member: teamMembers,
        user: {
          id: users.id,
          displayName: users.displayName,
          email: users.email,
        }
      })
      .from(teamMembers)
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, teamId));

    return result;
  }

  async addTeamMember(teamId: string, userId: string, role = "member"): Promise<TeamMember> {
    const [created] = await this.db
      .insert(teamMembers)
      .values({ teamId, userId, role })
      .returning();
    return created;
  }
}
