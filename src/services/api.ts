// API service for backend communication
const API_BASE_URL = 'http://localhost:5000/api';

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

  constructor() {
    // Load token from localStorage if available
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

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
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
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