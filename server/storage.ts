import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import { eq, and, asc, sql } from 'drizzle-orm';
import {
  users,
  meetings,
  roles,
  roleContent,
  meetingRoles,
  meetingRegistration,
  reflections,
  contentPages,
  learningMaterials,
  meetingReports,
  teams,
  teamMembers,
  tasks,
  type User,
  type InsertUser,
  type Meeting,
  type InsertMeeting,
  type Role,
  type Reflection,
  type InsertReflection,
  type ContentPage,
  type MeetingReport,
  type InsertMeetingReport,
  type Team,
  type InsertTeam,
  type Task,
  type InsertTask,
  type TeamMember
} from "@shared/schema";
import * as schema from "@shared/schema";

// Configure Neon serverless
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsers(): Promise<any[]>;
  createUser(user: {
    email: string;
    passwordHash: string;
    displayName: string;
    fullName: string;
    dateOfBirth?: string;
    school?: string;
    gender?: string;
    role?: string;
  }): Promise<User>;
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

  // Meeting registration methods
  registerForMeeting(userId: string, meetingId: string, roleId?: string): Promise<any>;
  getMeetingRegistrations(meetingId: string): Promise<any[]>;
  getUserMeetingRegistration(userId: string, meetingId: string): Promise<any | undefined>;
  updateAttendanceStatus(registrationId: string, status: string): Promise<any>;

  // Meeting report methods
  createMeetingReport(report: InsertMeetingReport): Promise<MeetingReport>;
  getMeetingReports(meetingId: string): Promise<any[]>;
  getParticipantReports(participationId: string): Promise<MeetingReport[]>;

  // Team methods
  getTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: string, updates: Partial<InsertTeam>): Promise<Team | undefined>;
  deleteTeam(id: string): Promise<boolean>;
  getTeamMembers(teamId: string): Promise<any[]>;
  addTeamMember(teamId: string, userId: string, role?: string): Promise<TeamMember>;

  // Task methods
  getTasks(teamId?: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
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

  async createUser(userData: {
    email: string;
    passwordHash: string;
    displayName: string;
    fullName: string;
    dateOfBirth?: string;
    school?: string;
    gender?: string;
    role?: string;
  }) {
    const result = await db.insert(users).values({
      email: userData.email,
      passwordHash: userData.passwordHash,
      displayName: userData.displayName,
      fullName: userData.fullName,
      dateOfBirth: userData.dateOfBirth,
      school: userData.school,
      gender: userData.gender,
      role: userData.role || 'member',
    }).returning();
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

  async getUserReflections(userId: string): Promise<Reflection[]> {
    return await db.select().from(reflections)
      .where(eq(reflections.userId, userId))
      .orderBy(desc(reflections.submittedAt));
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
    const pageData = {
      ...page,
      blocks: page.blocks || [],
      status: page.status || 'draft',
      lastModified: new Date().toISOString().split('T')[0],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await db.insert(contentPages).values(pageData as any).returning();
    return result[0];
  }

  async updateContentPage(id: string, updates: Partial<ContentPage>): Promise<ContentPage | undefined> {
    const updateData = {
      ...updates,
      lastModified: new Date().toISOString().split('T')[0],
      updatedAt: new Date()
    };
    const result = await db.update(contentPages).set(updateData).where(eq(contentPages.id, id)).returning();
    return result[0];
  }

  async deleteContentPage(id: string): Promise<boolean> {
    const result = await db.delete(contentPages).where(eq(contentPages.id, id));
    return (result.rowCount || 0) > 0;
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

  // Meeting registration methods
  async registerForMeeting(userId: string, meetingId: string, roleId?: string, speechTitle?: string, speechObjectives?: string) {
    const result = await db.insert(meetingRegistration).values({
      userId,
      meetingId,
      roleId: roleId || null,
      attendanceStatus: "registered",
      speechTitle: speechTitle || null,
      speechObjectives: speechObjectives || null
    }).returning();
    return result[0];
  }

  async getMeetingRegistrations(meetingId: string) {
    return await db.select({
      id: meetingRegistration.id,
      userId: meetingRegistration.userId,
      roleId: meetingRegistration.roleId,
      dateRegistered: meetingRegistration.dateRegister,
      attendanceStatus: meetingRegistration.attendanceStatus,
      speechTitle: meetingRegistration.speechTitle,
      speechObjectives: meetingRegistration.speechObjectives,
      userDisplayName: users.displayName,
      userFullName: users.fullName,
      roleName: roles.name
    })
    .from(meetingRegistration)
    .leftJoin(users, eq(meetingRegistration.userId, users.id))
    .leftJoin(roles, eq(meetingRegistration.roleId, roles.id))
    .where(eq(meetingRegistration.meetingId, meetingId));
  }

  async getUserMeetingRegistration(userId: string, meetingId: string) {
    const result = await db.select()
      .from(meetingRegistration)
      .where(and(eq(meetingRegistration.userId, userId), eq(meetingRegistration.meetingId, meetingId)))
      .limit(1);
    return result[0];
  }

  async updateAttendanceStatus(registrationId: string, status: string) {
    const result = await db.update(meetingRegistration)
      .set({ attendanceStatus: status })
      .where(eq(meetingRegistration.id, registrationId))
      .returning();
    return result[0];
  }

  async updateRegistrationRole(registrationId: string, roleId: string | null) {
    const result = await db.update(meetingRegistration)
      .set({ roleId })
      .where(eq(meetingRegistration.id, registrationId))
      .returning();
    return result[0];
  }

  // Meeting report methods
  async createMeetingReport(report: InsertMeetingReport): Promise<MeetingReport> {
    const [created] = await db
      .insert(meetingReports)
      .values(report)
      .returning();
    return created;
  }

  async getMeetingReports(meetingId: string): Promise<any[]> {
    const result = await db
      .select({
        report: meetingReports,
        participant: {
          id: meetingRegistration.id,
          userDisplayName: users.displayName,
          userId: users.id,
        },
        evaluatorRole: {
          id: roles.id,
          name: roles.name,
        },
        createdByUser: {
          id: users.id,
          displayName: users.displayName,
        }
      })
      .from(meetingReports)
      .innerJoin(meetingRegistration, eq(meetingReports.participationId, meetingRegistration.id))
      .innerJoin(users, eq(meetingRegistration.userId, users.id))
      .innerJoin(roles, eq(meetingReports.roleId, roles.id))
      .leftJoin(users as any, eq(meetingReports.createdBy, users.id))
      .where(eq(meetingRegistration.meetingId, meetingId));

    return result;
  }

  async getParticipantReports(participationId: string): Promise<MeetingReport[]> {
    const result = await db
      .select()
      .from(meetingReports)
      .where(eq(meetingReports.participationId, participationId));

    return result;
  }

  // Team methods
  async getTeams(): Promise<Team[]> {
    const result = await db
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
    const [result] = await db.select().from(teams).where(eq(teams.id, id));
    return result;
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [created] = await db.insert(teams).values(team).returning();
    return created;
  }

  async updateTeam(id: string, updates: Partial<InsertTeam>): Promise<Team | undefined> {
    const [updated] = await db
      .update(teams)
      .set(updates)
      .where(eq(teams.id, id))
      .returning();
    return updated;
  }

  async deleteTeam(id: string): Promise<boolean> {
    const result = await db.delete(teams).where(eq(teams.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getTeamMembers(teamId: string): Promise<any[]> {
    const result = await db
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
    const [created] = await db
      .insert(teamMembers)
      .values({ teamId, userId, role })
      .returning();
    return created;
  }

  // Task methods
  async getTasks(teamId?: string): Promise<Task[]> {
    const query = db
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
    const [result] = await db.select().from(tasks).where(eq(tasks.id, id));
    return result;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [created] = await db.insert(tasks).values(task).returning();
    return created;
  }

  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const [updated] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    return updated;
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();