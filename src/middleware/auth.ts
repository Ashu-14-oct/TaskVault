import jwt from "jsonwebtoken";
import User, { IUser } from "../model/user.model";
import { NextFunction, Request, Response } from "express";

// adding user inteface into Request
declare global {
    namespace Express {
        interface Request {
            user?: IUser | null;
        }
    }
}

interface JwtPayloadWithId extends jwt.JwtPayload {
    _id: string,
}

export const check = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const token = req.headers.authorization;
        if(!token){
            return res.status(409).json({message: "Missing token"});
        }
        const auth = token.replace("Bearer ", "");

        // checking token
        let decoded;
        try {
            decoded = jwt.verify(auth, 'jwtkeyexample') as JwtPayloadWithId;
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const user: IUser | null = await User.findOne({_id: decoded._id});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("error in auth.js(check)", error);
        return res.status(500).json({message: "Internal server error"});
    }
}