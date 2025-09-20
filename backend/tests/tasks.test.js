const request = require('supertest');
const app = require('../server');
const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

describe('Task API Routes', () => {
  let authToken;
  let userId;
  let testTask;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager_test');
    }
  });

  beforeEach(async () => {
    // Clean up database
    await Task.deleteMany({});
    await User.deleteMany({});

    // Create test user
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    await user.save();
    userId = user._id;

    // Create auth token
    const jwt = require('jsonwebtoken');
    authToken = jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '7d' });

    // Create test task
    testTask = new Task({
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending',
      priority: 'medium',
      user: userId
    });
    await testTask.save();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks for authenticated user', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Test Task');
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .get('/api/tasks')
        .expect(401);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/api/tasks?status=pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description',
        status: 'pending',
        priority: 'high',
        dueDate: '2024-12-31'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('New Task');
      expect(response.body.data.user).toBe(userId.toString());
    });

    it('should return 400 for invalid task data', async () => {
      const invalidData = {
        title: '', // Empty title
        description: 'A'.repeat(501) // Too long description
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .post('/api/tasks')
        .send({ title: 'Test' })
        .expect(401);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      const updateData = {
        title: 'Updated Task',
        status: 'in-progress',
        priority: 'high'
      };

      const response = await request(app)
        .put(`/api/tasks/${testTask._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Task');
      expect(response.body.data.status).toBe('in-progress');
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      await request(app)
        .put(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${testTask._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task deleted successfully');

      // Verify task is deleted
      const deletedTask = await Task.findById(testTask._id);
      expect(deletedTask).toBeNull();
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      await request(app)
        .delete(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    it('should update task status', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${testTask._id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'completed' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('completed');
    });

    it('should return 400 for invalid status', async () => {
      await request(app)
        .patch(`/api/tasks/${testTask._id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'invalid-status' })
        .expect(400);
    });
  });
});
