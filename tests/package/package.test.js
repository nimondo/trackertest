const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Package = require('../../models/package');
const Delivery = require('../../models/Delivery');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

describe('Package Controller', () => {
    let token;
    let userId;
    let server;
    let deliveryId;

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
        // Créez un Delivery et récupérez son ID
        const delivery = new Delivery({
            package_id: 'test_package_id',
            pickup_time: new Date(),
            start_time: new Date(),
            end_time: new Date(),
            location: {
                lat: '0',
                long: '0'
            },
            status: 'open',
        });
        await delivery.save();
        deliveryId = delivery._id;
        server = app.listen(3002);
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
        await server.close();
    });

    it('should create a new package', async () => {
        const packageData = {
            _id: uuid.v4(),
            description: 'Test Package',
            width: 10,
            weight: 5,
            height: 10,
            depth: 10,
            from_name: 'Test Sender',
            from_address: '123 Test St',
            from_location: {
                lat: '0',
                long: '0'
            },
            to_name: 'Test Receiver',
            to_location: {
                lat: '0',
                long: '0'
            },
            to_address: '456 Test St',
            active_delivery_id: deliveryId, // Ajoutez cette ligne
        };

        jest.spyOn(Package.prototype, 'save').mockResolvedValue(packageData);

        const response = await request(app)
            .post('/api/packages')
            .set('Authorization', `Bearer ${token}`)
            .send(packageData);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Package created!');
    });

    it('should get all packages', async () => {
        const packages = [{
                _id: '1',
                description: 'Package 1'
            },
            {
                _id: '2',
                description: 'Package 2'
            },
        ];

        jest.spyOn(Package, 'find').mockResolvedValue(packages);

        const response = await request(app)
            .get('/api/packages')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(2);
    });

    it('should get a package by ID', async () => {
        const packageData = {
            _id: '1',
            description: 'Package 1'
        };

        jest.spyOn(Package, 'findOne').mockResolvedValue(packageData);

        const response = await request(app)
            .get('/api/packages/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body._id).toBe('1');
    });

    it('should update a package by ID', async () => {
        const updatedPackage = {
            _id: '1',
            description: 'Updated Package'
        };

        jest.spyOn(Package, 'updateOne').mockResolvedValue({
            nModified: 1
        });

        const response = await request(app)
            .put('/api/packages/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                description: 'Updated Package'
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Package updated!');
    });

    it('should delete a package by ID', async () => {
        jest.spyOn(Package, 'deleteOne').mockResolvedValue({
            deletedCount: 1
        });

        const response = await request(app)
            .delete('/api/packages/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Package deleted!');
    });
});