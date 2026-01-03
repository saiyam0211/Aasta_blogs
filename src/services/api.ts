// API service for backend communication
const API_BASE_URL = 'https://aasta-main-website.onrender.com/api';

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  category?: string;
  headline?: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Alias for backward compatibility
export type Blog = BlogPost;

export interface CreateBlogRequest {
  title: string;
  content: string;
  author: string;
  category: string;
  headline: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  message: string;
}

class ApiService {
  private token: string | null = null;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private pendingRequests: Map<string, Promise<any>> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Load token from localStorage if available
    this.token = localStorage.getItem('authToken');
  }

  private getCacheKey(endpoint: string, options?: RequestInit): string {
    return `${endpoint}_${options?.method || 'GET'}`;
  }

  private getFromCache<T>(cacheKey: string): T | null {
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    if (cached) {
      this.cache.delete(cacheKey);
    }
    return null;
  }

  private setCache(cacheKey: string, data: any): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache: boolean = true
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, options);

    // Return cached data if available and caching is enabled
    if (useCache && options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE') {
      const cachedData = this.getFromCache<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      // If there's a pending request for the same endpoint, return that promise
      const pendingRequest = this.pendingRequests.get(cacheKey);
      if (pendingRequest) {
        return pendingRequest;
      }
    }

    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const requestPromise = (async () => {
      try {
        const response = await fetch(url, config);

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        // Handle 204 No Content responses
        if (response.status === 204) {
          return {} as T;
        }

        const data = await response.json();
        
        // Cache successful GET requests
        if (useCache && (!options.method || options.method === 'GET')) {
          this.setCache(cacheKey, data);
        }
        
        return data;
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      } finally {
        this.pendingRequests.delete(cacheKey);
      }
    })();

    // Store pending request
    if (useCache) {
      this.pendingRequests.set(cacheKey, requestPromise);
    }

    return requestPromise;
  }

  // Clear cache manually if needed
  clearCache(endpoint?: string): void {
    if (endpoint) {
      const cacheKey = this.getCacheKey(endpoint);
      this.cache.delete(cacheKey);
    } else {
      this.cache.clear();
    }
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
    }

    return response;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Blog operations
  async getAllBlogs(): Promise<BlogPost[]> {
    const response = await this.request<{ success: boolean; data: BlogPost[] }>('/blogs');
    return response.data || [];
  }

  async getBlogById(id: string): Promise<BlogPost> {
    const response = await this.request<{ success: boolean; data: BlogPost }>(`/blogs/${id}`);
    return response.data;
  }

  async createBlog(blog: CreateBlogRequest): Promise<BlogPost> {
    const response = await this.request<{ success: boolean; data: BlogPost }>('/blogs', {
      method: 'POST',
      body: JSON.stringify(blog),
    });
    return response.data;
  }

  async updateBlog(id: string, blog: Partial<CreateBlogRequest>): Promise<BlogPost> {
    const response = await this.request<{ success: boolean; data: BlogPost }>(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blog),
    });
    return response.data;
  }

  async deleteBlog(id: string): Promise<void> {
    await this.request(`/blogs/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();