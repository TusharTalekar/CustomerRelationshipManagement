import express, { Response } from "express";
import Customer from "../models/Customer";
import { protect, admin, RequestWithUser } from "../middlewares/authMiddleware";

const router = express.Router();

// @ route POST /api/customers
// @ desc create a new customer 
// @ access Private
router.post("/", protect as express.RequestHandler, async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const { name, email, phone, company } = req.body;
        
        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        const newCustomer = new Customer({
            name,
            email,
            phone,
            company,
            ownerId: req.user._id,
        });

        const customer = await newCustomer.save();
        res.status(201).json(customer);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @ route GET /api/customers
// @ desc get all customers for the logged-in user, or all for admin, with search functionality
// @ access Private
router.get("/", protect as express.RequestHandler, async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const query = req.query.query as string | undefined;
        let customers;
        
        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        const searchCondition = query ? {
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { company: { $regex: query, $options: 'i' } }
            ]
        } : {};

        if (req.user.role === 'admin') {
            customers = await Customer.find(searchCondition);
        } else {
            customers = await Customer.find({
                ownerId: req.user._id,
                ...searchCondition
            });
        }
        res.json(customers);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @ route GET /api/customers/:id
// @ desc get a single customer by id
// @ access Private
router.get("/:id", protect as express.RequestHandler, async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        if (!customer) {
            res.status(404).json({ message: "Customer not found" });
            return;
        }

        // Check if the logged-in user is the owner OR is an admin
        if (customer.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403).json({ message: "Not authorized to view this customer" });
            return;
        }

        res.json(customer);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @ route PUT /api/customers/:id
// @ desc update a customer by id
// @ access Private
router.put("/:id", protect as express.RequestHandler, async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        if (!customer) {
            res.status(404).json({ message: "Customer not found" });
            return;
        }

        // Check if the logged-in user is the owner OR is an admin
        if (customer.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403).json({ message: "Not authorized to update this customer" });
            return;
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(updatedCustomer);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @ route DELETE /api/customers/:id
// @ desc delete a customer by id (Admin Only)
// @ access Private
router.delete("/:id", [protect as express.RequestHandler, admin as express.RequestHandler], async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            res.status(404).json({ message: "Customer not found" });
            return;
        }

        await customer.deleteOne();
        res.json({ message: "Customer removed" });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

export default router;
