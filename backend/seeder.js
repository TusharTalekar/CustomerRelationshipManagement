const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Customer = require("./models/Customer");
const Lead = require("./models/Lead");

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully!");
    } catch (err) {
        console.error("MongoDB connection failed! Error:", err);
        process.exit(1);
    }
}

// Function to seed data
const seedData = async () => {
    await connectDB();
    try {
        // Clear existing data
        console.log("Clearing existing data...");
        await User.deleteMany();
        await Customer.deleteMany();
        await Lead.deleteMany();
        console.log("Existing data cleared.");

        // Create a default admin user
        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "123456",
            role: "admin"
        });
        const userId = createdUser._id;
        console.log(`Admin user created with ID: ${userId}`);

        // Sample customer data
        const sampleCustomers = [
            {
                name: "Alpha Corp",
                email: "contact@alphacorp.com",
                phone: "555-123-4567",
                company: "Alpha Corporation",
                ownerId: userId
            },
            {
                name: "Beta Solutions",
                email: "sales@betasolutions.net",
                phone: "555-987-6543",
                company: "Beta Solutions LLC",
                ownerId: userId
            },
            {
                name: "Gamma Innovations",
                email: "info@gammainnovations.co",
                phone: "555-555-5555",
                company: "Gamma Innovations",
                ownerId: userId
            }
        ];

        // Insert customers and get the created documents to use their IDs
        const customers = await Customer.insertMany(sampleCustomers);
        console.log("Sample customers seeded successfully.");

        // Sample lead data associated with the new customers
        const sampleLeads = [
            {
                customerId: customers[0]._id, // Lead for Alpha Corp
                title: "Large Software Contract",
                description: "Proposal for a multi-year software development project.",
                status: "New",
                value: 50000
            },
            {
                customerId: customers[0]._id, // Another lead for Alpha Corp
                title: "Database Migration Project",
                description: "Migrating existing databases to the cloud.",
                status: "Contacted",
                value: 25000
            },
            {
                customerId: customers[1]._id, // Lead for Beta Solutions
                title: "Hardware Upgrade Quote",
                description: "Quotation for new server hardware and installation services.",
                status: "Converted",
                value: 15000
            },
            {
                customerId: customers[2]._id, // Lead for Gamma Innovations
                title: "Marketing Strategy Consultation",
                description: "Developing a comprehensive digital marketing plan.",
                status: "New",
                value: 8000
            },
            {
                customerId: customers[2]._id, // Another lead for Gamma Innovations
                title: "Product Launch Support",
                description: "Assistance with upcoming product launch campaign.",
                status: "Lost",
                value: 12000
            }
        ];

        // Insert leads into the database
        await Lead.insertMany(sampleLeads);
        console.log("Sample leads seeded successfully!");

        process.exit();
    } catch (err) {
        console.error("Error seeding data:", err);
        process.exit(1);
    }
}

seedData();
