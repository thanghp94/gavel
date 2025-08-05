import { AuthApi } from './auth';
import { UsersApi } from './users';
import { MeetingsApi } from './meetings';
import { ReflectionsApi } from './reflections';
import { ContentApi } from './content';
import { TasksApi } from './tasks';
import { AnnouncementsApi } from './announcements';

// Create singleton instances
export const authApi = new AuthApi();
export const usersApi = new UsersApi();
export const meetingsApi = new MeetingsApi();
export const reflectionsApi = new ReflectionsApi();
export const contentApi = new ContentApi();
export const tasksApi = new TasksApi();
export const announcementsApi = new AnnouncementsApi();

// Export the classes for direct instantiation if needed
export {
  AuthApi,
  UsersApi,
  MeetingsApi,
  ReflectionsApi,
  ContentApi,
  TasksApi,
  AnnouncementsApi
};
