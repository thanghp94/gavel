import { ApiClient } from './base';

export class ContentApi extends ApiClient {
  async getContentPages() {
    return this.request('/content');
  }

  async getContentPageBySlug(slug: string) {
    return this.request(`/content/${slug}`);
  }

  async createContentPage(pageData: any) {
    return this.request('/content', {
      method: 'POST',
      body: JSON.stringify(pageData),
    });
  }

  async updateContentPage(id: string, pageData: any) {
    return this.request(`/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pageData),
    });
  }

  async deleteContentPage(id: string) {
    return this.request(`/content/${id}`, {
      method: 'DELETE',
    });
  }
}
