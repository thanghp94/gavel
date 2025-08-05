import { ApiClient } from './base';

export class ReflectionsApi extends ApiClient {
  async getReflections() {
    return this.request('/reflections');
  }

  async createReflection(reflectionData: any) {
    return this.request('/reflections', {
      method: 'POST',
      body: JSON.stringify(reflectionData),
    });
  }

  async getReflectionsForMeeting(meetingId: string) {
    return this.request(`/reflections/meeting/${meetingId}`);
  }

  async getMyReflection(meetingId: string) {
    return this.request(`/reflections/my/${meetingId}`);
  }
}
