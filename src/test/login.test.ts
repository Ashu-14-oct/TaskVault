import request from "supertest";
import express from 'express';
import { logIn } from "../controller/user.controller";
import User from "../model/user.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body } from "express-validator";

// mock user model and jwt
jest.mock('../model/user.model');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');


const app = express();
app.use(express.json());

app.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
], logIn);

describe('User Login', () =>{
    let mockUser: any;

    beforeEach(() => {
        mockUser = {
            _id: 'userId',
            email: 'test@example.com',
            password: 'hashedpassword'
        };
        (User.findOne as jest.Mock).mockImplementation(({email}) => {
            return email == 'test@example.com' ? Promise.resolve(mockUser) : Promise.resolve(null);
        });
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue('validtoken');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should login successfully with valid credentials', async () => {
        const credentials = {email: 'test@example.com', password: 'password123'};
        const response = await request(app).post('/login').send(credentials);

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    test('should return 401 if email is incorrect', async () => {
        const credentials = {email: 'wrong@example.com', password: "password123"};
        const response = await request(app).post('/login').send(credentials);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Email is incorrect');
    });

    test('should return 401 if password is incorrect', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
        const credentials = {email: 'test@example.com', password:"wrongpassword123"};
        const response = await request(app).post('/login').send(credentials);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Wrong password');
    })
})