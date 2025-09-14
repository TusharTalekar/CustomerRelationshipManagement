const express = require("express");
const Customer = require("../models/Customer");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

// @ route POST /api/customers
// @ desc create a new customer 
// @ access Private
router.post("/", protect, async (req, res) => {
    try {
        const { name, email, phone, company } = req.body;
        const newCustomer = new Customer({
            name,
            email,
            phone,
            company,
            ownerId: req.user.id,
        });

        const customer = await newCustomer.save();
        res.status(201).json(customer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @ route GET /api/customers
// @ desc get all customers for the logged-in user, or all for admin, with search functionality
// @ access Private
router.get("/", protect, async (req, res) => {
    try {
        const { query } = req.query;
        let customers;
        
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
                ownerId: req.user.id,
                ...searchCondition
            });
        }
        res.json(customers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @ route GET /api/customers/:id
// @ desc get a single customer by id
// @ access Private
router.get("/:id", protect, async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Check if the logged-in user is the owner OR is an admin
        if (customer.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to view this customer" });
        }

        res.json(customer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @ route PUT /api/customers/:id
// @ desc update a customer by id
// @ access Private
router.put("/:id", protect, async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Check if the logged-in user is the owner OR is an admin
        if (customer.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to update this customer" });
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(updatedCustomer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @ route DELETE /api/customers/:id
// @ desc delete a customer by id (Admin Only)
// @ access Private
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        await customer.deleteOne();
        res.json({ message: "Customer removed" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
