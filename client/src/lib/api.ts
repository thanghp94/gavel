const API_BASE = '/api';

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    console.log('Getting auth headers, token exists:', !!token);
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('authToken', response.token);
    return response;
  }

  async register(email: string, password: string, displayName: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    });
    localStorage.setItem('authToken', response.token);
    return response;
  }

  async getCurrentUser() {
    return this.request<any>('/users/me');
  }

  // Meeting methods
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

  // Role methods
  async getRoles() {
    return this.request<any[]>('/roles');
  }

  // Task methods
  async getTasks(teamId?: string) {
    const url = teamId ? `/api/tasks?teamId=${teamId}` : '/api/tasks';
    return this.request(url);
  }

  async createTask(taskData: any) {
    return this.request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId: string, updates: any) {
    return this.request(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Team methods
  async getTeams() {
    return this.request('/api/teams');
  }

  async createTeam(teamData: any) {
    return this.request('/api/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
  }

  async getTeamMembers(teamId: string) {
    return this.request(`/api/teams/${teamId}/members`);
  }

  // Reflection methods
  async createReflection(reflection: any) {
    return this.request<any>('/reflections', {
      method: 'POST',
      body: JSON.stringify(reflection),
    });
  }

  async getMyReflection(meetingId: string) {
    return this.request<any>(`/reflections/my/${meetingId}`);
  }

  async getMeetingReflections(meetingId: string) {
    return this.request<any[]>(`/reflections/meeting/${meetingId}`);
  }

  // Content methods
  async getContentPage(slug: string) {
    const response = await this.request(`/content/${slug}`);
    return response;
  }

  async getContentPages() {
    return this.request<any[]>('/content');
  }

  async getContentPageBySlug(slug: string) {
    return this.request(`/content/${slug}`);
  }

  async createContentPage(page: any) {
    return this.request<any>('/content', {
      method: 'POST',
      body: JSON.stringify(page),
    });
  }

  async updateContentPage(id: string, page: any) {
    return this.request<any>(`/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(page),
    });
  }

  async deleteContentPage(id: string): Promise<void> {
    await this.request(`/content/${id}`, {
      method: 'DELETE',
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

  // User management methods
  async getUsers() {
    return this.request<any[]>('/users');
  }

  async createUser(userData: any) {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUserRole(userId: string, role: string) {
    return this.request<any>(`/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async updateUserStatus(userId: string, isActive: boolean) {
    return this.request<any>(`/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    });
  }

  // Meeting report methods
  async createMeetingReport(meetingId: string, report: any) {
    return this.request(`/api/meetings/${meetingId}/reports`, {
      method: "POST",
      body: JSON.stringify(report),
    });
  }

  async getMeetingReports(meetingId: string) {
    return this.request(`/api/meetings/${meetingId}/reports`);
  }

  async getParticipantReports(participationId: string) {
    return this.request(`/api/participants/${participationId}/reports`);
  }

  logout() {
    localStorage.removeItem('authToken');
  }
}

export const api = new ApiClient();