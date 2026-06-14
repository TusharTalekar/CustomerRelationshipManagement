import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUserDocument } from '../models/User';

export interface RequestWithUser extends Request {
    user?: IUserDocument | null;
}

interface DecodedToken {
    user: {
        id: string;
        role: 'user' | 'admin' | 'manager' | 'support';
    };
}

export const protect = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error("JWT_SECRET environment variable is not defined");
            }
            const decoded = jwt.verify(token, jwtSecret) as DecodedToken;

            const userRecord = await User.findById(decoded.user.id).select("-password");
            if (!userRecord) {
                res.status(401).json({ message: "Not authorized, user database record missing" });
                return;
            }

            req.user = userRecord;
            next();
        } catch (err) {
            console.error("Token verification failed:", err);
            res.status(401).json({ message: "Not authorized, token failed!" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token provided!" });
    }
};


// Middleware to check user is admin 
// export const admin = (req: RequestWithUser, res: Response, next: NextFunction): void => {
//     if (req.user && req.user.role === "admin") {
//         next();
//     } else {
//         res.status(403).json({ message: "Not authorized as an admin" });
//     }
// };

// dynamic role authorization factory
export const authorizeRoles = (...allowedRoles: ('user' | 'admin' | 'manager' | 'support')[]) => {
    return (req: RequestWithUser, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: "Not authorized, no user session" });
            return;
        }

        if (allowedRoles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ message: `Forbidden: Role '${req.user.role}' does not have access to this resource` });
        }
    };
};
