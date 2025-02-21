const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth Controller', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should create a new user', async () => {
        const userData = {
            email: 'test@example.com',
            password: 'Password123!',
            role: 'admin'
        };

        const response = await request(app)
            .post('/api/auth/signup')
            .send(userData);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User created successfully!');
        expect(response.body.user.email).toBe(userData.email);

        const user = await User.findOne({ email: userData.email });
        expect(user).toBeTruthy();
        expect(user.email).toBe(userData.email);
    });

    it('should return error if user already exists', async () => {
        const userData = {
            email: 'test@example.com',
            password: 'Password123!',
            role: 'admin'
        };

        // Créer d'abord un utilisateur
        await User.create(userData);

        // Tenter de créer le même utilisateur
        const response = await request(app)
            .post('/api/auth/signup')
            .send(userData);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('User with this email already exists');
    });

    it('should return error if password is weak', async () => {
        const response = await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test@example.com',
                password: '123',
                role: 'admin'
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Password must be at least 8 characters, include uppercase, lowercase, and a digit, and have no spaces.');
    });

    it('should return a token on successful login', async () => {
        const userData = {
            email: 'test@example.com',
            password: 'Password123!',
            role: 'admin'
        };

        // Créer un utilisateur
        await User.create(userData);

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: userData.email,
                password: userData.password
            });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeTruthy();
        expect(typeof response.body.token).toBe('string');
    });

    it('should return error if password is incorrect', async () => {
        const userData = {
            email: 'test@example.com',
            password: 'Password123!',
            role: 'admin'
        };

        // Créer un utilisateur
        await User.create(userData);

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: userData.email,
                password: 'WrongPassword123!'
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid password');
    });

    it('should return error if user does not exist', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'notfound@example.com',
                password: 'Password123!'
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
    });
});