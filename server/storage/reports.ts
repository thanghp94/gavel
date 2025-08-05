import { eq } from 'drizzle-orm';
import { 
  meetingReports, 
  meetingRegistration, 
  users, 
  roles,
  type MeetingReport, 
  type InsertMeetingReport 
} from "@shared/schema";
import { BaseStorage } from './base';

export class ReportStorage extends BaseStorage {
  async createMeetingReport(report: InsertMeetingReport): Promise<MeetingReport> {
    const [created] = await this.db
      .insert(meetingReports)
      .values(report)
      .returning();
    return created;
  }

  async getMeetingReports(meetingId: string): Promise<any[]> {
    const result = await this.db
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
        }
      })
      .from(meetingReports)
      .innerJoin(meetingRegistration, eq(meetingReports.meetingRegistrationId, meetingRegistration.id))
      .innerJoin(users, eq(meetingRegistration.userId, users.id))
      .innerJoin(roles, eq(meetingReports.roleId, roles.id))
      .where(eq(meetingRegistration.meetingId, meetingId));

    return result;
  }

  async getParticipantReports(meetingRegistrationId: string): Promise<MeetingReport[]> {
    const result = await this.db
      .select()
      .from(meetingReports)
      .where(eq(meetingReports.meetingRegistrationId, meetingRegistrationId));

    return result;
  }
}
