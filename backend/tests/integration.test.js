const request = require('supertest');
const app = require('../src/app');

describe('Integration Tests - Complete Workflows', () => {
  describe('Complete Blog Management Workflow', () => {
    let authToken;
    let createdBlogId;

    test('should complete full blog management lifecycle', async () => {
      // Step 1: Admin Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.token).toBeDefined();
      authToken = loginResponse.body.token;

      // Step 2: Create a new blog post
      const createResponse = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Integration Test Blog',
          content: 'This is a comprehensive integration test for the blog API.',
          author: 'Integration Tester'
        });

      expect(createResponse.status).toBe(201);
      expect(createResponse.body.success).toBe(true);
      expect(createResponse.body.data.title).toBe('Integration Test Blog');
      createdBlogId = createResponse.body.data._id;

      // Step 3: Retrieve all blogs (should include the created one)
      const getAllResponse = await request(app)
        .get('/api/blogs');

      expect(getAllResponse.status).toBe(200);
      expect(getAllResponse.body.success).toBe(true);
      expect(getAllResponse.body.data).toHaveLength(1);
      expect(getAllResponse.body.data[0]._id).toBe(createdBlogId);

      // Step 4: Retrieve the specific blog by ID
      const getByIdResponse = await request(app)
        .get(`/api/blogs/${createdBlogId}`);

      expect(getByIdResponse.status).toBe(200);
      expect(getByIdResponse.body.success).toBe(true);
      expect(getByIdResponse.body.data._id).toBe(createdBlogId);
      expect(getByIdResponse.body.data.title).toBe('Integration Test Blog');

      // Step 5: Update the blog post
      const updateResponse = await request(app)
        .put(`/api/blogs/${createdBlogId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Integration Test Blog',
          content: 'This content has been updated during integration testing.',
          author: 'Updated Integration Tester'
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.data.title).toBe('Updated Integration Test Blog');

      // Step 6: Verify the update by retrieving the blog again
      const verifyUpdateResponse = await request(app)
        .get(`/api/blogs/${createdBlogId}`);

      expect(verifyUpdateResponse.status).toBe(200);
      expect(verifyUpdateResponse.body.data.title).toBe('Updated Integration Test Blog');
      expect(verifyUpdateResponse.body.data.content).toBe('This content has been updated during integration testing.');

      // Step 7: Delete the blog post
      const deleteResponse = await request(app)
        .delete(`/api/blogs/${createdBlogId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(deleteResponse.status).toBe(204);

      // Step 8: Verify deletion by trying to retrieve the blog
      const verifyDeleteResponse = await request(app)
        .get(`/api/blogs/${createdBlogId}`);

      expect(verifyDeleteResponse.status).toBe(404);
      expect(verifyDeleteResponse.body.success).toBe(false);

      // Step 9: Verify the blog is no longer in the list
      const finalGetAllResponse = await request(app)
        .get('/api/blogs');

      expect(finalGetAllResponse.status).toBe(200);
      expect(finalGetAllResponse.body.data).toHaveLength(0);
    });
  });

  describe('Multiple Blog Posts Management', () => {
    let authToken;
    const blogIds = [];

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });
      authToken = loginResponse.body.token;
    });

    test('should handle multiple blog posts correctly', async () => {
      // Create multiple blog posts
      const blogData = [
        {
          title: 'First Blog Post',
          content: 'Content of the first blog post',
          author: 'Author One'
        },
        {
          title: 'Second Blog Post',
          content: 'Content of the second blog post',
          author: 'Author Two'
        },
        {
          title: 'Third Blog Post',
          content: 'Content of the third blog post',
          author: 'Author Three'
        }
      ];

      // Create all blog posts
      for (const blog of blogData) {
        const response = await request(app)
          .post('/api/blogs')
          .set('Authorization', `Bearer ${authToken}`)
          .send(blog);

        expect(response.status).toBe(201);
        blogIds.push(response.body.data._id);
        
        // Add small delay to ensure different timestamps
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Retrieve all blogs and verify order (newest first)
      const getAllResponse = await request(app)
        .get('/api/blogs');

      expect(getAllResponse.status).toBe(200);
      expect(getAllResponse.body.data).toHaveLength(3);
      
      const blogs = getAllResponse.body.data;
      expect(blogs[0].title).toBe('Third Blog Post'); // Newest first
      expect(blogs[1].title).toBe('Second Blog Post');
      expect(blogs[2].title).toBe('First Blog Post'); // Oldest last

      // Update the middle blog post
      const updateResponse = await request(app)
        .put(`/api/blogs/${blogIds[1]}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Second Blog Post',
          content: 'Updated content of the second blog post',
          author: 'Updated Author Two'
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.title).toBe('Updated Second Blog Post');

      // Delete the first blog post
      const deleteResponse = await request(app)
        .delete(`/api/blogs/${blogIds[0]}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(deleteResponse.status).toBe(204);

      // Verify final state
      const finalGetAllResponse = await request(app)
        .get('/api/blogs');

      expect(finalGetAllResponse.status).toBe(200);
      expect(finalGetAllResponse.body.data).toHaveLength(2);
      
      const finalBlogs = finalGetAllResponse.body.data;
      const titles = finalBlogs.map(blog => blog.title);
      expect(titles).toContain('Updated Second Blog Post');
      expect(titles).toContain('Third Blog Post');
      expect(titles).not.toContain('First Blog Post');
    });
  });

  describe('Authentication and Authorization Flow', () => {
    test('should enforce authentication across all protected endpoints', async () => {
      // Try to access protected endpoints without authentication
      const protectedEndpoints = [
        { method: 'post', path: '/api/blogs', data: { title: 'Test', content: 'Test', author: 'Test' } },
        { method: 'put', path: '/api/blogs/507f1f77bcf86cd799439011', data: { title: 'Test', content: 'Test', author: 'Test' } },
        { method: 'delete', path: '/api/blogs/507f1f77bcf86cd799439011' }
      ];

      for (const endpoint of protectedEndpoints) {
        let response;
        if (endpoint.method === 'post') {
          response = await request(app).post(endpoint.path).send(endpoint.data);
        } else if (endpoint.method === 'put') {
          response = await request(app).put(endpoint.path).send(endpoint.data);
        } else if (endpoint.method === 'delete') {
          response = await request(app).delete(endpoint.path);
        }

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
      }

      // Get valid token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      const token = loginResponse.body.token;

      // Create a blog post to test update and delete
      const createResponse = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Auth Test Blog',
          content: 'Testing authentication',
          author: 'Auth Tester'
        });

      const blogId = createResponse.body.data._id;

      // Now try the same endpoints with valid authentication
      const authenticatedTests = [
        { method: 'post', path: '/api/blogs', data: { title: 'Authenticated Test', content: 'Authenticated content', author: 'Authenticated Author' } },
        { method: 'put', path: `/api/blogs/${blogId}`, data: { title: 'Updated Auth Test', content: 'Updated content', author: 'Updated Author' } },
        { method: 'delete', path: `/api/blogs/${blogId}` }
      ];

      for (const endpoint of authenticatedTests) {
        let response;
        if (endpoint.method === 'post') {
          response = await request(app)
            .post(endpoint.path)
            .set('Authorization', `Bearer ${token}`)
            .send(endpoint.data);
          expect(response.status).toBe(201);
        } else if (endpoint.method === 'put') {
          response = await request(app)
            .put(endpoint.path)
            .set('Authorization', `Bearer ${token}`)
            .send(endpoint.data);
          expect(response.status).toBe(200);
        } else if (endpoint.method === 'delete') {
          response = await request(app)
            .delete(endpoint.path)
            .set('Authorization', `Bearer ${token}`);
          expect(response.status).toBe(204);
        }
      }
    });
  });

  describe('Data Persistence and Consistency', () => {
    let authToken;

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });
      authToken = loginResponse.body.token;
    });

    test('should maintain data consistency across operations', async () => {
      // Create a blog post
      const createResponse = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Consistency Test Blog',
          content: 'Testing data consistency across operations',
          author: 'Consistency Tester'
        });

      const blogId = createResponse.body.data._id;
      const originalCreatedAt = createResponse.body.data.createdAt;

      // Retrieve the blog and verify data consistency
      const getResponse = await request(app)
        .get(`/api/blogs/${blogId}`);

      expect(getResponse.body.data._id).toBe(blogId);
      expect(getResponse.body.data.title).toBe('Consistency Test Blog');
      expect(getResponse.body.data.createdAt).toBe(originalCreatedAt);

      // Update the blog and verify timestamps
      await new Promise(resolve => setTimeout(resolve, 100)); // Ensure different timestamp

      const updateResponse = await request(app)
        .put(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Consistency Test Blog',
          content: 'Updated content for consistency testing',
          author: 'Updated Consistency Tester'
        });

      expect(updateResponse.body.data._id).toBe(blogId);
      expect(updateResponse.body.data.createdAt).toBe(originalCreatedAt); // Should remain same
      expect(updateResponse.body.data.updatedAt).not.toBe(originalCreatedAt); // Should be different

      // Verify the update persisted
      const verifyResponse = await request(app)
        .get(`/api/blogs/${blogId}`);

      expect(verifyResponse.body.data.title).toBe('Updated Consistency Test Blog');
      expect(verifyResponse.body.data.content).toBe('Updated content for consistency testing');
      expect(verifyResponse.body.data.createdAt).toBe(originalCreatedAt);
    });
  });
});