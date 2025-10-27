const request = require('supertest');
const app = require('../src/app');
const Blog = require('../src/models/Blog');

describe('Blog CRUD Operations', () => {
  let validToken;

  beforeEach(async () => {
    // Get valid JWT token for authenticated requests
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });
    validToken = loginResponse.body.token;
  });

  describe('POST /api/blogs - Create Blog', () => {
    test('should create new blog post with valid data and authentication', async () => {
      const blogData = {
        title: 'Test Blog Post',
        content: 'This is a test blog post content.',
        author: 'Test Author'
      };

      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send(blogData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(blogData.title);
      expect(response.body.data.content).toBe(blogData.content);
      expect(response.body.data.author).toBe(blogData.author);
      expect(response.body.data._id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();
    });

    test('should return 401 when creating blog without authentication', async () => {
      const blogData = {
        title: 'Test Blog Post',
        content: 'This is a test blog post content.',
        author: 'Test Author'
      };

      const response = await request(app)
        .post('/api/blogs')
        .send(blogData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 when title is missing', async () => {
      const blogData = {
        content: 'This is a test blog post content.',
        author: 'Test Author'
      };

      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send(blogData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 when content is missing', async () => {
      const blogData = {
        title: 'Test Blog Post',
        author: 'Test Author'
      };

      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send(blogData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 when author is missing', async () => {
      const blogData = {
        title: 'Test Blog Post',
        content: 'This is a test blog post content.'
      };

      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send(blogData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 when title exceeds 200 characters', async () => {
      const blogData = {
        title: 'A'.repeat(201), // 201 characters
        content: 'This is a test blog post content.',
        author: 'Test Author'
      };

      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send(blogData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 when author exceeds 100 characters', async () => {
      const blogData = {
        title: 'Test Blog Post',
        content: 'This is a test blog post content.',
        author: 'A'.repeat(101) // 101 characters
      };

      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send(blogData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/blogs - Retrieve All Blogs', () => {
    test('should return empty array when no blogs exist', async () => {
      const response = await request(app)
        .get('/api/blogs');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    test('should return all blogs in descending order by creation date', async () => {
      // Create multiple blog posts
      const blog1Data = {
        title: 'First Blog',
        content: 'First blog content',
        author: 'Author 1'
      };

      const blog2Data = {
        title: 'Second Blog',
        content: 'Second blog content',
        author: 'Author 2'
      };

      await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send(blog1Data);

      // Add small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send(blog2Data);

      const response = await request(app)
        .get('/api/blogs');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      
      // Check that blogs are in descending order (newest first)
      const blogs = response.body.data;
      expect(new Date(blogs[0].createdAt).getTime()).toBeGreaterThan(
        new Date(blogs[1].createdAt).getTime()
      );
      expect(blogs[0].title).toBe('Second Blog');
      expect(blogs[1].title).toBe('First Blog');
    });

    test('should include all necessary fields in blog response', async () => {
      const blogData = {
        title: 'Test Blog',
        content: 'Test content',
        author: 'Test Author'
      };

      await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send(blogData);

      const response = await request(app)
        .get('/api/blogs');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      
      const blog = response.body.data[0];
      expect(blog._id).toBeDefined();
      expect(blog.title).toBe(blogData.title);
      expect(blog.content).toBe(blogData.content);
      expect(blog.author).toBe(blogData.author);
      expect(blog.createdAt).toBeDefined();
      expect(blog.updatedAt).toBeDefined();
    });
  });

  describe('GET /api/blogs/:id - Retrieve Specific Blog', () => {
    let blogId;

    beforeEach(async () => {
      const blogData = {
        title: 'Test Blog',
        content: 'Test content',
        author: 'Test Author'
      };

      const createResponse = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send(blogData);

      blogId = createResponse.body.data._id;
    });

    test('should return specific blog by valid ID', async () => {
      const response = await request(app)
        .get(`/api/blogs/${blogId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(blogId);
      expect(response.body.data.title).toBe('Test Blog');
    });

    test('should return 404 for non-existent blog ID', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011'; // Valid ObjectId format

      const response = await request(app)
        .get(`/api/blogs/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 for invalid ObjectId format', async () => {
      const invalidId = 'invalid-id';

      const response = await request(app)
        .get(`/api/blogs/${invalidId}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/blogs/:id - Update Blog', () => {
    let blogId;

    beforeEach(async () => {
      const blogData = {
        title: 'Original Title',
        content: 'Original content',
        author: 'Original Author'
      };

      const createResponse = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send(blogData);

      blogId = createResponse.body.data._id;
    });

    test('should update blog with valid data and authentication', async () => {
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
        author: 'Updated Author'
      };

      const response = await request(app)
        .put(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.content).toBe(updateData.content);
      expect(response.body.data.author).toBe(updateData.author);
    });

    test('should return 401 when updating without authentication', async () => {
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
        author: 'Updated Author'
      };

      const response = await request(app)
        .put(`/api/blogs/${blogId}`)
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should return 404 when updating non-existent blog', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
        author: 'Updated Author'
      };

      const response = await request(app)
        .put(`/api/blogs/${nonExistentId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 with invalid update data', async () => {
      const updateData = {
        title: '', // Empty title should be invalid
        content: 'Updated content',
        author: 'Updated Author'
      };

      const response = await request(app)
        .put(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/blogs/:id - Delete Blog', () => {
    let blogId;

    beforeEach(async () => {
      const blogData = {
        title: 'Blog to Delete',
        content: 'Content to delete',
        author: 'Author'
      };

      const createResponse = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send(blogData);

      blogId = createResponse.body.data._id;
    });

    test('should delete blog with valid ID and authentication', async () => {
      const response = await request(app)
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(204);

      // Verify blog is actually deleted
      const getResponse = await request(app)
        .get(`/api/blogs/${blogId}`);
      expect(getResponse.status).toBe(404);
    });

    test('should return 401 when deleting without authentication', async () => {
      const response = await request(app)
        .delete(`/api/blogs/${blogId}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should return 404 when deleting non-existent blog', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/api/blogs/${nonExistentId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 for invalid ObjectId format', async () => {
      const invalidId = 'invalid-id';

      const response = await request(app)
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});