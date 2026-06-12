import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUserDocument } from '../models/User';

export interface RequestWithUser extends Request {
  user?: IUserDocument | null;
}

interface DecodedToken {
  user: {
    id: string;
    role: 'user' | 'admin';
  };
}

// Middleware to protect routes 
export const protect = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error("JWT_SECRET environment variable is not defined");
            }
            const decoded = jwt.verify(token, jwtSecret) as DecodedToken;

            req.user = await User.findById(decoded.user.id).select("-password"); //exclude password
            next();
        } catch (err) {
            console.log("Tolen verification failed : ", err);
            res.status(401).json({ message: "Not authorized, token failed!" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token provided!" });
    }
};

// Middleware to check user is admin 
export const admin = (req: RequestWithUser, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as an admin" });
    }
};
