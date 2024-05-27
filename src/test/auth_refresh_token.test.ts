import request from 'supertest';
import express, {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/user.model';
import { tokenRefresh } from '../controller/user.controller';
import cookieParser from 'cookie-parser';

jest.mock('../model/user.model');

const app = express();
app.use(express.json());
app.use(cookieParser());

// endpoint to test token
app.post('/token', tokenRefresh);

describe('Token Refresh', () => {
    let refreshToken: string;
    let invalidToken: string;
    let mockUser: any;

    beforeAll(() => {
        refreshToken = jwt.sign({_id: 'userId'}, 'jwtkeyexample', {expiresIn: '7d'});
        invalidToken = 'invalidToken';

        mockUser = {_id: 'userId', name: 'Test User'};
        (User.findOne as jest.Mock).mockImplementation(({_id}) => {
            return _id === 'userId' ? Promise.resolve(mockUser) : Promise.resolve(null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return 401 if no refresh token is provided', async () => {
        const response  = await request(app).post('/token').send();
        expect(response.status).toBe(401);
    });

    test('should return 401 if refresh token is invalid', async () => {
        const response = await request(app).post('/token').set('Cookie', [`refreshToken=${invalidToken}`]);
        expect(response.status).toBe(401);
    });

    test('should return 200 and new access token if refresh token is valid', async () => {
        const response = await request(app).post('/token').set('Cookie', [`refreshToken=${refreshToken}`]).send();
        expect(response.status).toBe(200);
    });
});