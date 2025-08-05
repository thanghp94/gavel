import { eq, and, asc, sql } from 'drizzle-orm';
import { 
  meetings, 
  meetingRegistration, 
  users, 
  roles,
  type Meeting, 
  type InsertMeeting 
} from "@shared/schema";
import { BaseStorage } from './base';

export class MeetingStorage extends BaseStorage {
  async getMeetings(): Promise<Meeting[]> {
    const today = new Date().toISOString().split('T')[0];
    return await this.db.select().from(meetings).where(sql`${meetings.date} >= ${today}`).orderBy(asc(meetings.date));
  }

  async getMeeting(id: string): Promise<Meeting | undefined> {
    const result = await this.db.select().from(meetings).where(eq(meetings.id, id)).limit(1);
    return result[0];
  }

  async createMeeting(meeting: InsertMeeting): Promise<Meeting> {
    const result = await this.db.insert(meetings).values(meeting).returning();
    return result[0];
  }

  async updateMeeting(id: string, updates: Partial<InsertMeeting>): Promise<Meeting | undefined> {
    const result = await this.db.update(meetings).set(updates).where(eq(meetings.id, id)).returning();
    return result[0];
  }

  // Meeting registration methods
  async registerForMeeting(userId: string, meetingId: string, roleId?: string, speechTitle?: string, speechObjectives?: string) {
    const result = await this.db.insert(meetingRegistration).values({
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
    try {
      console.log('Fetching registrations for meeting:', meetingId);
      const result = await this.db.select({
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
      
      console.log('Found registrations:', result.length);
      return result;
    } catch (error) {
      console.error('Error in getMeetingRegistrations:', error);
      throw error;
    }
  }

  async getUserMeetingRegistration(userId: string, meetingId: string) {
    const result = await this.db.select()
      .from(meetingRegistration)
      .where(and(eq(meetingRegistration.userId, userId), eq(meetingRegistration.meetingId, meetingId)))
      .limit(1);
    return result[0];
  }

  async updateAttendanceStatus(registrationId: string, status: string) {
    const result = await this.db.update(meetingRegistration)
      .set({ attendanceStatus: status })
      .where(eq(meetingRegistration.id, registrationId))
      .returning();
    return result[0];
  }

  async updateMeetingRegistration(registrationId: string, roleId?: string, speechTitle?: string, speechObjectives?: string) {
    const result = await this.db.update(meetingRegistration)
      .set({ 
        roleId: roleId || null,
        speechTitle: speechTitle || null,
        speechObjectives: speechObjectives || null
      })
      .where(eq(meetingRegistration.id, registrationId))
      .returning();
    return result[0];
  }

  async updateRegistrationRole(registrationId: string, roleId: string | null) {
    const result = await this.db.update(meetingRegistration)
      .set({ roleId })
      .where(eq(meetingRegistration.id, registrationId))
      .returning();
    return result[0];
  }
}
