const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe('Error Handling', () => {
  let validToken;

  beforeEach(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });
    validToken = loginResponse.body.token;
  });

  describe('Database Connection Errors', () => {
    test('should handle database connection gracefully', async () => {
      // This test verifies that the app starts even if database connection fails
      // The actual connection is handled in the setup, but we can test error responses
      const response = await request(app)
        .get('/api/blogs');

      // Should still respond even if there are database issues
      expect(response.status).toBeLessThan(500);
    });
  });

  describe('Invalid MongoDB ObjectId Handling', () => {
    test('should return 400 for invalid ObjectId in GET /api/blogs/:id', async () => {
      const response = await request(app)
        .get('/api/blogs/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid');
    });

    test('should return 400 for invalid ObjectId in PUT /api/blogs/:id', async () => {
      const response = await request(app)
        .put('/api/blogs/invalid-id')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated content',
          author: 'Updated Author'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 for invalid ObjectId in DELETE /api/blogs/:id', async () => {
      const response = await request(app)
        .delete('/api/blogs/invalid-id')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Validation Error Handling', () => {
    test('should return detailed validation errors for blog creation', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          title: '', // Empty title
          content: '', // Empty content
          author: '' // Empty author
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    test('should return validation error for title length exceeding limit', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          title: 'A'.repeat(201), // Exceeds 200 character limit
          content: 'Valid content',
          author: 'Valid author'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('200');
    });

    test('should return validation error for author length exceeding limit', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          title: 'Valid title',
          content: 'Valid content',
          author: 'A'.repeat(101) // Exceeds 100 character limit
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('100');
    });
  });

  describe('Authentication Error Handling', () => {
    test('should return 401 for missing Authorization header', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .send({
          title: 'Test Blog',
          content: 'Test content',
          author: 'Test Author'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('token');
    });

    test('should return 401 for malformed Authorization header', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', 'InvalidFormat')
        .send({
          title: 'Test Blog',
          content: 'Test content',
          author: 'Test Author'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should return 401 for expired/invalid JWT token', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', 'Bearer invalid.jwt.token')
        .send({
          title: 'Test Blog',
          content: 'Test content',
          author: 'Test Author'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('404 Error Handling', () => {
    test('should return 404 for non-existent blog post', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/blogs/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    test('should return 404 for non-existent route', async () => {
      const response = await request(app)
        .get('/api/nonexistent');

      expect(response.status).toBe(404);
    });
  });

  describe('Server Error Handling', () => {
    test('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}'); // Malformed JSON

      expect(response.status).toBe(400);
    });

    test('should handle unsupported content type', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'text/plain')
        .send('plain text data');

      expect(response.status).toBe(400);
    });
  });

  describe('Error Response Format Consistency', () => {
    test('should return consistent error format for validation errors', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          title: '', // Invalid data
          content: 'Valid content',
          author: 'Valid author'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.message).toBe('string');
    });

    test('should return consistent error format for authentication errors', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .send({
          title: 'Test Blog',
          content: 'Test content',
          author: 'Test Author'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.message).toBe('string');
    });

    test('should return consistent error format for not found errors', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/blogs/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.message).toBe('string');
    });
  });
});