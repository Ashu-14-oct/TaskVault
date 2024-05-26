import request from 'supertest';
import express, {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/user.model';
import { check } from '../middleware/auth';

// mock the user model
jest.mock('../model/user.model');

const app = express();
app.use(express.json());

// endpoint for testing
app.get('/test', check, (req: Request, res: Response) =>{
    res.status(200).json({message: 'success'});
});

describe('Auth middleware', () => {
    let validToken: string;
    let invalidToken: string;
    let mockUser: any;

    beforeAll(() => {
        validToken = jwt.sign({_id: 'userId'}, 'jwtkeyexample', {expiresIn: '1h'});
        invalidToken = 'invalidtoken';

        mockUser = {_id: 'userId', name: 'Test user'};
        (User.findOne as jest.Mock).mockImplementation(({_id}) => {
            return _id === 'userId' ? Promise.resolve(mockUser) : Promise.resolve(null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return 409 if token is missing', async () => {
        const response = await request(app).get('/test');
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Missing token');
    });

    test('should return 401 if token is invalid', async () => {
        const response = await request(app).get('/test').set('Authorization', `Bearer ${invalidToken}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid token');
    });

    test('should return 404 if user is not found', async () => {
        const invalidUserToken = await jwt.sign({_id: 'invalidUserId'}, 'jwtkeyexample', {expiresIn: '1h'});
        const response = await request(app).get('/test').set('Authorization', `Bearer ${invalidUserToken}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });

    test('should call next() if token and user are valid', async () => {
        const response = await request(app).get('/test').set('Authorization', `Bearer ${validToken}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('success');
    });
})