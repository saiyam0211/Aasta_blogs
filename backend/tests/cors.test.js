const request = require('supertest');
const app = require('../src/app');

describe('CORS Functionality', () => {
  describe('CORS Headers', () => {
    test('should include CORS headers in response', async () => {
      const response = await request(app)
        .get('/api/blogs')
        .set('Origin', 'http://localhost:5173');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    test('should handle preflight OPTIONS request', async () => {
      const response = await request(app)
        .options('/api/blogs')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type,Authorization');

      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-methods']).toBeDefined();
      expect(response.headers['access-control-allow-headers']).toBeDefined();
    });

    test('should allow GET requests from frontend origin', async () => {
      const response = await request(app)
        .get('/api/blogs')
        .set('Origin', 'http://localhost:5173');

      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    test('should allow POST requests with proper CORS headers', async () => {
      // First get a valid token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:5173')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      const token = loginResponse.body.token;

      const response = await request(app)
        .post('/api/blogs')
        .set('Origin', 'http://localhost:5173')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'CORS Test Blog',
          content: 'Testing CORS functionality',
          author: 'CORS Tester'
        });

      expect(response.status).toBe(201);
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    test('should allow PUT requests with proper CORS headers', async () => {
      // First create a blog post and get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      const token = loginResponse.body.token;

      const createResponse = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Original Title',
          content: 'Original content',
          author: 'Original Author'
        });

      const blogId = createResponse.body.data._id;

      const response = await request(app)
        .put(`/api/blogs/${blogId}`)
        .set('Origin', 'http://localhost:5173')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title',
          content: 'Updated content',
          author: 'Updated Author'
        });

      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    test('should allow DELETE requests with proper CORS headers', async () => {
      // First create a blog post and get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      const token = loginResponse.body.token;

      const createResponse = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Blog to Delete',
          content: 'Content to delete',
          author: 'Author'
        });

      const blogId = createResponse.body.data._id;

      const response = await request(app)
        .delete(`/api/blogs/${blogId}`)
        .set('Origin', 'http://localhost:5173')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Cross-Origin Request Handling', () => {
    test('should handle requests without Origin header', async () => {
      const response = await request(app)
        .get('/api/blogs');

      expect(response.status).toBe(200);
    });

    test('should handle authentication endpoint with CORS', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:5173')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    test('should include credentials in CORS if configured', async () => {
      const response = await request(app)
        .get('/api/blogs')
        .set('Origin', 'http://localhost:5173');

      // Check if credentials are allowed (depends on CORS configuration)
      if (response.headers['access-control-allow-credentials']) {
        expect(response.headers['access-control-allow-credentials']).toBe('true');
      }
    });
  });

  describe('Content-Type Handling', () => {
    test('should handle JSON content type in CORS requests', async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:5173')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({
          username: 'admin',
          password: 'admin123'
        }));

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.headers['access-control-allow-origin']).toBeDefined();
    });

    test('should handle Authorization header in CORS requests', async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      const token = loginResponse.body.token;

      const response = await request(app)
        .get('/api/blogs')
        .set('Origin', 'http://localhost:5173')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Frontend Integration Simulation', () => {
    test('should simulate typical frontend login flow', async () => {
      // Simulate preflight request
      const preflightResponse = await request(app)
        .options('/api/auth/login')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type');

      expect(preflightResponse.status).toBe(204);

      // Simulate actual login request
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:5173')
        .set('Content-Type', 'application/json')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.token).toBeDefined();
    });

    test('should simulate typical frontend blog creation flow', async () => {
      // Get token first
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:5173')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      const token = loginResponse.body.token;

      // Simulate preflight request for blog creation
      const preflightResponse = await request(app)
        .options('/api/blogs')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type,Authorization');

      expect(preflightResponse.status).toBe(204);

      // Simulate actual blog creation request
      const createResponse = await request(app)
        .post('/api/blogs')
        .set('Origin', 'http://localhost:5173')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Frontend Test Blog',
          content: 'This blog was created from a simulated frontend request',
          author: 'Frontend User'
        });

      expect(createResponse.status).toBe(201);
      expect(createResponse.body.data.title).toBe('Frontend Test Blog');
    });

    test('should simulate frontend blog retrieval flow', async () => {
      // Create a blog first
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      const token = loginResponse.body.token;

      await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Blog for Frontend',
          content: 'Content for frontend retrieval',
          author: 'Backend Author'
        });

      // Simulate frontend retrieving blogs
      const getResponse = await request(app)
        .get('/api/blogs')
        .set('Origin', 'http://localhost:5173');

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.data).toHaveLength(1);
      expect(getResponse.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});