import { ApiClient } from './base';

export class MeetingsApi extends ApiClient {
  async getMeetings() {
    return this.request<any[]>('/meetings');
  }

  async getMeeting(id: string) {
    return this.request<any>(`/meetings/${id}`);
  }

  async createMeeting(meeting: any) {
    return this.request<any>('/meetings', {
      method: 'POST',
      body: JSON.stringify(meeting),
    });
  }

  async updateMeeting(id: string, meeting: any) {
    return this.request<any>(`/meetings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(meeting),
    });
  }

  // Meeting registration methods
  async registerForMeeting(meetingId: string, roleId?: string, speechTitle?: string, speechObjectives?: string) {
    const response = await this.request(`/meetings/${meetingId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleId, speechTitle, speechObjectives }),
    });
    return response;
  }

  async getMeetingRegistrations(meetingId: string) {
    const response = await this.request(`/meetings/${meetingId}/registrations`);
    return response;
  }

  async getMyMeetingRegistration(meetingId: string) {
    const response = await this.request(`/meetings/${meetingId}/my-registration`);
    return response;
  }

  async updateMeetingRegistration(meetingId: string, roleId?: string, speechTitle?: string, speechObjectives?: string) {
    const response = await this.request(`/meetings/${meetingId}/register`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleId, speechTitle, speechObjectives }),
    });
    return response;
  }

  async updateAttendanceStatus(registrationId: string, status: string) {
    const response = await this.request(`/registrations/${registrationId}/attendance`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response;
  }

  async addAttendee(meetingId: string, userId: string, roleId?: string) {
    const response = await this.request(`/meetings/${meetingId}/add-attendee`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, roleId }),
    });
    return response;
  }

  async updateParticipantRole(registrationId: string, roleId: string | null) {
    const response = await this.request(`/registrations/${registrationId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ roleId }),
    });
    return response;
  }
}
