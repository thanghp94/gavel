import { UserStorage } from './users';
import { MeetingStorage } from './meetings';
import { ReflectionStorage } from './reflections';
import { ContentStorage } from './content';
import { TaskStorage } from './tasks';
import { ReportStorage } from './reports';
import { AnnouncementStorage } from './announcements';
import { RoleStorage } from './roles';

class DatabaseStorage {
  private userStorage = new UserStorage();
  private meetingStorage = new MeetingStorage();
  private reflectionStorage = new ReflectionStorage();
  private contentStorage = new ContentStorage();
  private taskStorage = new TaskStorage();
  private reportStorage = new ReportStorage();
  private announcementStorage = new AnnouncementStorage();
  private roleStorage = new RoleStorage();

  // User methods
  async getUser(id: string) {
    return this.userStorage.getUser(id);
  }

  async getUserByEmail(email: string) {
    return this.userStorage.getUserByEmail(email);
  }

  async createUser(userData: any) {
    return this.userStorage.createUser(userData);
  }

  async updateUserRole(userId: string, role: string) {
    return this.userStorage.updateUserRole(userId, role);
  }

  async updateUser(id: string, updates: any) {
    return this.userStorage.updateUser(id, updates);
  }

  async getUsers() {
    return this.userStorage.getUsers();
  }

  // Meeting methods
  async getMeetings() {
    return this.meetingStorage.getMeetings();
  }

  async getMeeting(id: string) {
    return this.meetingStorage.getMeeting(id);
  }

  async createMeeting(meeting: any) {
    return this.meetingStorage.createMeeting(meeting);
  }

  async updateMeeting(id: string, updates: any) {
    return this.meetingStorage.updateMeeting(id, updates);
  }

  async registerForMeeting(userId: string, meetingId: string, roleId?: string, speechTitle?: string, speechObjectives?: string) {
    return this.meetingStorage.registerForMeeting(userId, meetingId, roleId, speechTitle, speechObjectives);
  }

  async getMeetingRegistrations(meetingId: string) {
    return this.meetingStorage.getMeetingRegistrations(meetingId);
  }

  async getUserMeetingRegistration(userId: string, meetingId: string) {
    return this.meetingStorage.getUserMeetingRegistration(userId, meetingId);
  }

  async updateAttendanceStatus(registrationId: string, status: string) {
    return this.meetingStorage.updateAttendanceStatus(registrationId, status);
  }

  async updateMeetingRegistration(registrationId: string, roleId?: string, speechTitle?: string, speechObjectives?: string) {
    return this.meetingStorage.updateMeetingRegistration(registrationId, roleId, speechTitle, speechObjectives);
  }

  async updateRegistrationRole(registrationId: string, roleId: string | null) {
    return this.meetingStorage.updateRegistrationRole(registrationId, roleId);
  }

  // Reflection methods
  async getReflections(meetingId: string) {
    return this.reflectionStorage.getReflections(meetingId);
  }

  async createReflection(reflection: any) {
    return this.reflectionStorage.createReflection(reflection);
  }

  async getUserReflection(userId: string, meetingId: string) {
    return this.reflectionStorage.getUserReflection(userId, meetingId);
  }

  async getUserReflections(userId: string) {
    return this.reflectionStorage.getUserReflections(userId);
  }

  async getAllReflections() {
    return this.reflectionStorage.getAllReflections();
  }

  // Content methods
  async getContentPages() {
    return this.contentStorage.getContentPages();
  }

  async getContentPageBySlug(slug: string) {
    return this.contentStorage.getContentPageBySlug(slug);
  }

  async createContentPage(page: any) {
    return this.contentStorage.createContentPage(page);
  }

  async updateContentPage(id: string, updates: any) {
    return this.contentStorage.updateContentPage(id, updates);
  }

  async deleteContentPage(id: string) {
    return this.contentStorage.deleteContentPage(id);
  }

  // Task and Team methods
  async getTasks(teamId?: string) {
    return this.taskStorage.getTasks(teamId);
  }

  async getTask(id: string) {
    return this.taskStorage.getTask(id);
  }

  async createTask(task: any) {
    return this.taskStorage.createTask(task);
  }

  async updateTask(id: string, updates: any) {
    return this.taskStorage.updateTask(id, updates);
  }

  async deleteTask(id: string) {
    return this.taskStorage.deleteTask(id);
  }

  async getTeams() {
    return this.taskStorage.getTeams();
  }

  async getTeam(id: string) {
    return this.taskStorage.getTeam(id);
  }

  async createTeam(team: any) {
    return this.taskStorage.createTeam(team);
  }

  async updateTeam(id: string, updates: any) {
    return this.taskStorage.updateTeam(id, updates);
  }

  async deleteTeam(id: string) {
    return this.taskStorage.deleteTeam(id);
  }

  async getTeamMembers(teamId: string) {
    return this.taskStorage.getTeamMembers(teamId);
  }

  async addTeamMember(teamId: string, userId: string, role?: string) {
    return this.taskStorage.addTeamMember(teamId, userId, role);
  }

  // Report methods
  async createMeetingReport(report: any) {
    return this.reportStorage.createMeetingReport(report);
  }

  async getMeetingReports(meetingId: string) {
    return this.reportStorage.getMeetingReports(meetingId);
  }

  async getParticipantReports(meetingRegistrationId: string) {
    return this.reportStorage.getParticipantReports(meetingRegistrationId);
  }

  // Announcement methods
  async getAnnouncements() {
    return this.announcementStorage.getAnnouncements();
  }

  async createAnnouncement(announcement: any) {
    return this.announcementStorage.createAnnouncement(announcement);
  }

  async updateAnnouncement(id: string, updates: any) {
    return this.announcementStorage.updateAnnouncement(id, updates);
  }

  async deleteAnnouncement(id: string) {
    return this.announcementStorage.deleteAnnouncement(id);
  }

  // Role methods
  async getRoles() {
    return this.roleStorage.getRoles();
  }

  async getRole(id: string) {
    return this.roleStorage.getRole(id);
  }
}

export const storage = new DatabaseStorage();
