import { useState, useEffect } from 'react';
import { apiService, BlogPost, CreateBlogRequest } from '../services/api';

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const blogs = await apiService.getAllBlogs();
      setBlogs(blogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (blogData: CreateBlogRequest) => {
    try {
      setError(null);
      const newBlog = await apiService.createBlog(blogData);
      setBlogs(prev => [newBlog, ...prev]); // Add new blog to the beginning
      return newBlog;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create blog';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateBlog = async (id: string, blogData: Partial<CreateBlogRequest>) => {
    try {
      setError(null);
      const updatedBlog = await apiService.updateBlog(id, blogData);
      setBlogs(prev => prev.map(blog => blog._id === id ? updatedBlog : blog));
      return updatedBlog;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update blog';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      setError(null);
      await apiService.deleteBlog(id);
      setBlogs(prev => prev.filter(blog => blog._id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete blog';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return {
    blogs,
    loading,
    error,
    fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
  };
};

export const useBlog = (id: string) => {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedBlog = await apiService.getBlogById(id);
        setBlog(fetchedBlog);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch blog');
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  return { blog, loading, error };
};