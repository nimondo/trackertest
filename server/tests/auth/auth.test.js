const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

jest.mock('../../models/user');

describe('Auth Controller', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a new user', async () => {
        User.mockImplementation(() => ({
            save: jest.fn().mockResolvedValue({
                _id: uuid.v4(),
                email: 'test@testify.com',
                role: 'admin'
            }),
        }));

        const userData = {
            email: 'test@example.com',
            password: 'password',
            role: 'admin'
        };

        const response = await request(app)
            .post('/api/auth/signup')
            .send(userData);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User created successfully!');
    });
});