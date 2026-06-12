import express, { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { protect, RequestWithUser } from '../middlewares/authMiddleware';
import validate from '../middlewares/validationMiddleware';
import { registerSchema, loginSchema } from '../validation/userValidation';

const router = express.Router();

router.post("/register", validate(registerSchema, 'body'), async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ message: "User already exists." });
            return;
        }

        user = new User({ name, email, password });
        await user.save();

        const payload = { user: { id: user._id, role: user.role } };
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET environment variable is not defined");
        }

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: "40h" },
            (err, token) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Server error");
                    return;
                }
                res.status(201).json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token,
                });
            });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});


router.post("/login", validate(loginSchema, 'body'), async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const payload = { user: { id: user._id, role: user.role } };
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET environment variable is not defined");
        }

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: "40h" },
            (err, token) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Server error");
                    return;
                }
                res.json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token,
                });
            });

    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

router.get("/profile", protect as express.RequestHandler, async (req: RequestWithUser, res: Response): Promise<void> => {
    res.json(req.user);
});

export default router;
