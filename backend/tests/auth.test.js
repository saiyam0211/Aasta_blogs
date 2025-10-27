const request = require('supertest');
const app = require('../src/app');

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/login', () => {
    test('should return JWT token with valid admin credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe('string');
    });

    test('should return 401 with invalid username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'wronguser',
          password: 'admin123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    test('should return 401 with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    test('should return 400 with missing username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'admin123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 with empty request body', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('JWT Token Validation', () => {
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

    test('should allow access to protected routes with valid token', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          title: 'Test Blog',
          content: 'Test content',
          author: 'Test Author'
        });

      expect(response.status).toBe(201);
    });

    test('should deny access with invalid token', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', 'Bearer invalidtoken')
        .send({
          title: 'Test Blog',
          content: 'Test content',
          author: 'Test Author'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should deny access with missing token', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .send({
          title: 'Test Blog',
          content: 'Test content',
          author: 'Test Author'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should deny access with malformed Authorization header', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', validToken) // Missing 'Bearer ' prefix
        .send({
          title: 'Test Blog',
          content: 'Test content',
          author: 'Test Author'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});