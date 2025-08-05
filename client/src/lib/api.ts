// Re-export the new modular API for backward compatibility
export {
  authApi as auth,
  usersApi as users,
  meetingsApi as meetings,
  reflectionsApi as reflections,
  contentApi as content,
  tasksApi as tasks,
  announcementsApi as announcements
} from './api/index';

// Also export roles API (create a simple one for now)
import { ApiClient } from './api/base';

class RolesApi extends ApiClient {
  async getRoles() {
    return this.request('/roles');
  }
}

export const roles = new RolesApi();

// Export the old api object for backward compatibility
import { 
  authApi, 
  usersApi, 
  meetingsApi, 
  reflectionsApi, 
  contentApi, 
  tasksApi, 
  announcementsApi 
} from './api/index';

// Create a unified API object that matches the old structure
export const api = {
  // Auth methods
  login: authApi.login.bind(authApi),
  register: authApi.register.bind(authApi),
  getCurrentUser: authApi.getCurrentUser.bind(authApi),
  logout: authApi.logout.bind(authApi),

  // Meeting methods
  getMeetings: meetingsApi.getMeetings.bind(meetingsApi),
  getMeeting: meetingsApi.getMeeting.bind(meetingsApi),
  createMeeting: meetingsApi.createMeeting.bind(meetingsApi),
  updateMeeting: meetingsApi.updateMeeting.bind(meetingsApi),
  registerForMeeting: meetingsApi.registerForMeeting.bind(meetingsApi),
  getMeetingRegistrations: meetingsApi.getMeetingRegistrations.bind(meetingsApi),
  getMyMeetingRegistration: meetingsApi.getMyMeetingRegistration.bind(meetingsApi),
  updateMeetingRegistration: meetingsApi.updateMeetingRegistration.bind(meetingsApi),
  updateAttendanceStatus: meetingsApi.updateAttendanceStatus.bind(meetingsApi),
  addAttendee: meetingsApi.addAttendee.bind(meetingsApi),
  updateParticipantRole: meetingsApi.updateParticipantRole.bind(meetingsApi),

  // User methods
  getUsers: usersApi.getUsers.bind(usersApi),
  createUser: usersApi.createUser.bind(usersApi),
  updateUserRole: usersApi.updateUserRole.bind(usersApi),
  updateUserStatus: usersApi.updateUserStatus.bind(usersApi),

  // Reflection methods
  createReflection: reflectionsApi.createReflection.bind(reflectionsApi),
  getMyReflection: reflectionsApi.getMyReflection.bind(reflectionsApi),
  getMeetingReflections: reflectionsApi.getReflectionsForMeeting.bind(reflectionsApi),
  getReflections: reflectionsApi.getReflections.bind(reflectionsApi),

  // Content methods
  getContentPage: contentApi.getContentPageBySlug.bind(contentApi),
  getContentPages: contentApi.getContentPages.bind(contentApi),
  getContentPageBySlug: contentApi.getContentPageBySlug.bind(contentApi),
  createContentPage: contentApi.createContentPage.bind(contentApi),
  updateContentPage: contentApi.updateContentPage.bind(contentApi),
  deleteContentPage: contentApi.deleteContentPage.bind(contentApi),

  // Task methods
  getTasks: tasksApi.getTasks.bind(tasksApi),
  createTask: tasksApi.createTask.bind(tasksApi),
  updateTask: tasksApi.updateTask.bind(tasksApi),
  deleteTask: tasksApi.deleteTask.bind(tasksApi),
  getTeams: tasksApi.getTeams.bind(tasksApi),
  createTeam: tasksApi.createTeam.bind(tasksApi),
  getTeamMembers: tasksApi.getTeamMembers.bind(tasksApi),

  // Announcement methods
  getAnnouncements: announcementsApi.getAnnouncements.bind(announcementsApi),
  createAnnouncement: announcementsApi.createAnnouncement.bind(announcementsApi),
  updateAnnouncement: announcementsApi.updateAnnouncement.bind(announcementsApi),

  // Role methods
  getRoles: roles.getRoles.bind(roles),

  // Meeting report methods (these need to be added to the meetings API)
  createMeetingReport: (meetingId: string, report: any) => {
    // This would need to be implemented in the meetings API
    console.warn('createMeetingReport not yet implemented in modular API');
    return Promise.resolve({});
  },
  getMeetingReports: (meetingId: string) => {
    console.warn('getMeetingReports not yet implemented in modular API');
    return Promise.resolve([]);
  },
  getParticipantReports: (participationId: string) => {
    console.warn('getParticipantReports not yet implemented in modular API');
    return Promise.resolve([]);
  }
};
