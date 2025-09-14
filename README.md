# 📌 SnapCRM: A Mini Customer Relationship Management Application

SnapCRM is a full-stack web application designed to help users manage customer relationships and sales opportunities efficiently.  
It provides an intuitive dashboard to track customers and leads from a single, centralized location.

---

## ✨ Features

- **User Authentication** – Secure registration and login with JWTs.  
- **Role-Based Access Control** – Differentiates between user and admin roles.  
- **Customer Management** – CRUD operations for customer records.  
- **Lead Management** – Track sales opportunities with status, value, and linked customer.  
- **Search & Filter** – Find customers by name/email, filter leads by status.  
- **Reporting** – Visual breakdown of leads by status using charts.  
- **Responsive Design** – Built with Tailwind CSS for desktop and mobile.

---

## 💻 Tech Stack

**Backend**

* **Node.js & Express.js**: For a fast and unopinionated REST API.

* **MongoDB & Mongoose**: As the NoSQL database for flexible data storage.

* **jsonwebtoken**: For secure, token-based authentication.

* **bcryptjs**: To securely hash and store user passwords.

* **Joi**: For robust request validation to ensure data integrity.

**Frontend**

* **React.js**: A modern JavaScript library for building the user interface.

* **Vite**: A fast build tool that provides a great development experience.

* **axios**: A promise-based HTTP client for making API calls.

* **Recharts**: A charting library for creating responsive data visualizations.

* **Tailwind CSS**: A utility-first CSS framework for rapid and responsive styling.
---

## 🚀 Setup Instructions

### Prerequisites
- Node.js **v18+**  
- npm  
- MongoDB Atlas connection string  

---

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a .env file inside the backend/ directory
```
MONGO_URI=your_mongodb_atlas_uri_here
JWT_SECRET=your_secret_key_here
PORT=5000
```
Run the backend server
```
npm run dev
```
The server will start at: http://localhost:5000


### 2. Frontend Setup
```bash
cd frontend
npm install
```
Create a .env file inside the frontend/ directory:
```
VITE_API_BASE_URL=http://localhost:5000/api
```
Run the frontend:
```bash
npm run dev
```
The app will be available at: http://localhost:5173


### 3. Seeding Initial Data

Run the seeder script to create an admin user, demo customers, and leads:
```bash
cd backend
node seeder.js
```
Default Admin Credentials:
```
Email: admin@example.com
Password: 123456
```
---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` &rarr; Register a new user (with validation).
- `POST /api/auth/login` &rarr; Authenticate a user and return a JWT.
- `GET /api/auth/profile` &rarr; Get the logged-in user's profile.

### Customers
- `GET /api/customers` &rarr; List all customers (with search & role-based access).
- `POST /api/customers` &rarr; Create a new customer (with owner ID).
- `GET /api/customers/:id` &rarr; Get a single customer by ID (with role-based access).
- `PUT /api/customers/:id` &rarr; Update a customer (with role-based access).
- `DELETE /api/customers/:id` &rarr; Delete a customer (Admin-only).

### Leads
- `GET /api/leads` &rarr; List all leads (with role-based access).
- `POST /api/leads/:customerId` &rarr; Create a new lead for a specific customer.
- `PUT /api/leads/:id` &rarr; Update a lead (with role-based access).
- `DELETE /api/leads/:id` &rarr; Delete a lead (with role-based access).

---

## 📊 Database Schema

**Collections:**
- `users` → Stores user credentials & roles (admin/user)  
- `customers` → Stores customer information  
- `leads` → Tracks sales opportunities linked to customers  

**Relationships:**  
`Lead → Customer → User`

---

## 🔗 Live Demo (Optional)

* **Live Link:** [https://snap-crm.vercel.app/](https://snap-crm.vercel.app/)

***

---

## ✅ Bonus Features

- Role-based access control with middleware (admin vs. user).  
- Joi validation for request data (register/login).  
- Client-side search & filter in dashboard.  
- Interactive reports (Recharts pie chart for lead statuses).  
- Responsive design with Tailwind.  
