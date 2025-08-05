import { ApiClient } from './base';

export class AnnouncementsApi extends ApiClient {
  async getAnnouncements() {
    return this.request('/announcements');
  }

  async createAnnouncement(announcementData: any) {
    return this.request('/announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
  }

  async updateAnnouncement(id: string, announcementData: any) {
    return this.request(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(announcementData),
    });
  }

  async deleteAnnouncement(id: string) {
    return this.request(`/announcements/${id}`, {
      method: 'DELETE',
    });
  }
}
