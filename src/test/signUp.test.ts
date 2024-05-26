import request from 'supertest';
import express from 'express';
import User from '../model/user.model';
import { signUp } from '../controller/user.controller';
import bcrypt from 'bcrypt';
import { body } from 'express-validator';

// mock the user
jest.mock('../model/user.model');

const app = express();
app.use(express.json());

app.post('/signup', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
], signUp);

describe('User Sign-Up', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create a user with valid data', async () => {
        const newUser = {name: 'testUser', email: 'test@example.com', password: 'password123'};
        (User.findOne as jest.Mock).mockResolvedValueOnce(null);
        (User.create as jest.Mock).mockResolvedValueOnce({
            ...newUser,
            password: await bcrypt.hash(newUser.password, 10)
        });

        const response = await request(app).post('/signup').send(newUser);
        expect(response.status).toBe(201);
        expect(response.body.newUser.email).toBe(newUser.email);
    });

    test('should return validation error if required fields are missing', async () => {
        const response = await request(app).post('/signup').send({name: 'testuser'});

        expect(response.status).toBe(400);
        expect(response.body.errors).toHaveLength(2);
    });

    test('should return 409 if user is already exists', async () => {
        const newUser = {name: 'testuser', email: 'test@example.com', password: 'password123'};
        (User.findOne as jest.Mock).mockResolvedValueOnce(newUser);

        const response = await request(app).post('/signup').send(newUser);
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('User with this mail already exist, try different mail.');
    });
});