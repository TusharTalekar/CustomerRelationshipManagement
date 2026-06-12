import express, { Response } from "express";
import Lead from "../models/Lead";
import Customer, { ICustomerDocument } from "../models/Customer";
import { protect, RequestWithUser } from "../middlewares/authMiddleware";

const router = express.Router();

// @ route POST /api/leads/:customerId
// @ desc create a new lead for a specific customer
// @ access Private
router.post("/:customerId", protect as express.RequestHandler, async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const customer = await Customer.findById(req.params.customerId);
        
        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        if (!customer) {
            res.status(404).json({ message: "Customer not found" });
            return;
        }
        if (customer.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403).json({ message: "Not authorized to add leads for this customer" });
            return;
        }

        const newLead = new Lead({
            customerId: req.params.customerId,
            ...req.body,
        });

        const lead = await newLead.save();
        res.status(201).json(lead);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @ route GET /api/leads
// @ desc get all leads for the logged-in user's customers, or all for admin
// @ access Private
router.get("/", protect as express.RequestHandler, async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        let leads;
        
        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        if (req.user.role === 'admin') {
            leads = await Lead.find({}).populate('customerId');
        } else {
            const customers = await Customer.find({ ownerId: req.user._id });
            const customerIds = customers.map(customer => customer._id);
            leads = await Lead.find({ customerId: { $in: customerIds } });
        }
        res.json(leads);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @ route PUT /api/leads/:id
// @ desc update a lead by id
// @ access Private
router.put("/:id", protect as express.RequestHandler, async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const lead = await Lead.findById(req.params.id).populate('customerId');

        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        if (!lead) {
            res.status(404).json({ message: "Lead not found" });
            return;
        }
        
        const customer = lead.customerId as unknown as ICustomerDocument;
        if (!customer || (customer.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
            res.status(403).json({ message: "Not authorized to update this lead" });
            return;
        }

        const updatedLead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(updatedLead);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @ route DELETE /api/leads/:id
// @ desc delete a lead by id
// @ access Private
router.delete("/:id", protect as express.RequestHandler, async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const lead = await Lead.findById(req.params.id).populate('customerId');

        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        if (!lead) {
            res.status(404).json({ message: "Lead not found" });
            return;
        }
        
        const customer = lead.customerId as unknown as ICustomerDocument;
        if (!customer || (customer.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
            res.status(403).json({ message: "Not authorized to delete this lead" });
            return;
        }

        await lead.deleteOne();
        res.json({ message: "Lead removed" });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

export default router;
