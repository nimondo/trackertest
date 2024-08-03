const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Delivery = require('../../models/Delivery');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

describe('Delivery Controller', () => {
    let token;
    let userId;
    let server;

    beforeAll(async () => {
        // Setup user and token for authentication
        const user = new User({
            email: 'testuser@example.com',
            password: 'hashedpassword',
            role: 'admin',
        });
        await user.save();

        userId = user._id;
        token = jwt.sign({
            userId: user._id,
            email: user.email,
            role: user.role
        }, process.env.TOKEN, {
            expiresIn: '24h'
        });

        const url = process.env.MONGODB;
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        server = app.listen(3001);
    });

    afterAll(async () => {
        // await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
        await server.close();
    });

    it('should create a new delivery', async () => {
        const deliveryData = {
            _id: uuid.v4(),
            package_id: 'test_package_id',
            pickup_time: new Date(),
            start_time: new Date(),
            end_time: new Date(),
            location: {
                lat: '0',
                long: '0'
            },
            status: 'open',
        };

        jest.spyOn(Delivery.prototype, 'save').mockResolvedValue(deliveryData);

        const response = await request(app)
            .post('/api/deliveries')
            .set('Authorization', `Bearer ${token}`)
            .send(deliveryData);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Delivery created successfully!');
    });

    it('should get all deliveries', async () => {
        const deliveries = [{
                _id: '1',
                status: 'open'
            },
            {
                _id: '2',
                status: 'delivered'
            },
        ];

        jest.spyOn(Delivery, 'find').mockResolvedValue(deliveries);

        const response = await request(app)
            .get('/api/deliveries')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    it('should get a delivery by ID', async () => {
        const delivery = {
            _id: '1',
            status: 'open'
        };

        jest.spyOn(Delivery, 'findById').mockResolvedValue(delivery);

        const response = await request(app)
            .get('/api/deliveries/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body._id).toBe('1');
    });

    it('should update a delivery by ID', async () => {
        const updatedDelivery = {
            _id: '1',
            status: 'delivered'
        };

        jest.spyOn(Delivery, 'findByIdAndUpdate').mockResolvedValue(updatedDelivery);

        const response = await request(app)
            .put('/api/deliveries/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                status: 'delivered'
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Delivery updated successfully!');
    });

    it('should delete a delivery by ID', async () => {
        jest.spyOn(Delivery, 'findByIdAndDelete').mockResolvedValue({
            deletedCount: 1
        });

        const response = await request(app)
            .delete('/api/deliveries/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Delivery deleted successfully!');
    });
});