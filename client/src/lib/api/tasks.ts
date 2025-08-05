import { ApiClient } from './base';

export class TasksApi extends ApiClient {
  async getTasks(teamId?: string) {
    const url = teamId ? `/tasks?teamId=${teamId}` : '/tasks';
    return this.request(url);
  }

  async createTask(taskData: any) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId: string, updates: any) {
    return this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(taskId: string) {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // Team methods
  async getTeams() {
    return this.request('/teams');
  }

  async createTeam(teamData: any) {
    return this.request('/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
  }

  async getTeamMembers(teamId: string) {
    return this.request(`/teams/${teamId}/members`);
  }
}
