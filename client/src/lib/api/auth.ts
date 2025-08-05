import { ApiClient } from './base';

export class AuthApi extends ApiClient {
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

  logout() {
    localStorage.removeItem('authToken');
  }
}
