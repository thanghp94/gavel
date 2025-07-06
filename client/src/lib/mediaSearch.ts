// Media search service using actual APIs
const GIPHY_API_KEY = 'yq5efxxqcigeEf2b6MPxtrCQqc3JdKYn';
const GOOGLE_API_KEY = 'AIzaSyB91UTzojia0KkqoqHmaWeW8Jn6r00gjeg';
const GOOGLE_SEARCH_ENGINE_ID = '035b08dadfe4f47f1';

export interface MediaSearchResult {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  type: 'image' | 'video' | 'gif';
}

export class MediaSearchService {
  // Search Giphy for GIFs
  static async searchGiphy(query: string): Promise<MediaSearchResult[]> {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=20&rating=g`
      );
      
      if (!response.ok) {
        throw new Error('Giphy API request failed');
      }
      
      const data = await response.json();
      
      return data.data.map((gif: any) => ({
        id: gif.id,
        title: gif.title || 'Giphy GIF',
        url: gif.images.original.url,
        thumbnail: gif.images.fixed_width_small.url,
        type: 'gif' as const
      }));
    } catch (error) {
      console.error('Giphy search error:', error);
      return [];
    }
  }

  // Search Google Custom Search for images
  static async searchGoogleImages(query: string): Promise<MediaSearchResult[]> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image&num=20`
      );
      
      if (!response.ok) {
        throw new Error('Google Custom Search API request failed');
      }
      
      const data = await response.json();
      
      if (!data.items) {
        return [];
      }
      
      return data.items.map((item: any) => ({
        id: item.cacheId || item.link,
        title: item.title || 'Google Image',
        url: item.link,
        thumbnail: item.image?.thumbnailLink || item.link,
        type: 'image' as const
      }));
    } catch (error) {
      console.error('Google Images search error:', error);
      return [];
    }
  }

  // Search YouTube for videos using YouTube Data API v3
  static async searchYouTube(query: string): Promise<MediaSearchResult[]> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(query)}&type=video&key=${GOOGLE_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('YouTube API request failed');
      }
      
      const data = await response.json();
      
      if (!data.items) {
        return [];
      }
      
      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        type: 'video' as const
      }));
    } catch (error) {
      console.error('YouTube search error:', error);
      return [];
    }
  }

  // Main search function that routes to appropriate service
  static async search(query: string, type: 'giphy' | 'google' | 'youtube'): Promise<MediaSearchResult[]> {
    switch (type) {
      case 'giphy':
        return this.searchGiphy(query);
      case 'google':
        return this.searchGoogleImages(query);
      case 'youtube':
        return this.searchYouTube(query);
      default:
        return [];
    }
  }
}
