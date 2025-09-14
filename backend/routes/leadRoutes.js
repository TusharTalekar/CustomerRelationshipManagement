const express = require("express");
const Lead = require("../models/Lead");
const Customer = require("../models/Customer");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// @ route POST /api/leads/:customerId
// @ desc create a new lead for a specific customer
// @ access Private
router.post("/:customerId", protect, async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        if (customer.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to add leads for this customer" });
        }

        const newLead = new Lead({
            customerId: req.params.customerId,
            ...req.body,
        });

        const lead = await newLead.save();
        res.status(201).json(lead);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @ route GET /api/leads
// @ desc get all leads for the logged-in user's customers, or all for admin
// @ access Private
router.get("/", protect, async (req, res) => {
    try {
        let leads;
        if (req.user.role === 'admin') {
            leads = await Lead.find({}).populate('customerId');
        } else {
            const customers = await Customer.find({ ownerId: req.user.id });
            const customerIds = customers.map(customer => customer._id);
            leads = await Lead.find({ customerId: { $in: customerIds } });
        }
        res.json(leads);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @ route PUT /api/leads/:id
// @ desc update a lead by id
// @ access Private
router.put("/:id", protect, async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id).populate('customerId');

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }
        if (lead.customerId.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to update this lead" });
        }

        const updatedLead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(updatedLead);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @ route DELETE /api/leads/:id
// @ desc delete a lead by id
// @ access Private
router.delete("/:id", protect, async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id).populate('customerId');

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }
        if (lead.customerId.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to delete this lead" });
        }

        await lead.deleteOne();
        res.json({ message: "Lead removed" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
