const API_BASE = '/api';

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
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

  // Role methods
  async getRoles() {
    return this.request<any[]>('/roles');
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
    return this.request<any>(`/content/${slug}`);
  }

  async getContentPages() {
    return this.request<any[]>('/content');
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

  logout() {
    localStorage.removeItem('authToken');
  }
}

export const api = new ApiClient();