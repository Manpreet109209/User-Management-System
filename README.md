👥 User Management System

A production-style full-stack (server-rendered) CRUD application built with Node.js, Express, MySQL, and EJS.

This project focuses on real backend engineering principles: clean architecture, secure authentication, and scalable structure without relying on heavy frontend frameworks.

🚀 Overview

This is a complete user management system that allows creating, viewing, updating, and deleting users with proper validation and password verification.

The application uses server-side rendering (EJS) and follows a structured MVC pattern to simulate real-world backend development practices.

✨ Features

View all users

Create new users

Edit users (with password verification)

Delete users (with confirmation + auth check)

Secure password hashing using bcrypt

UUID-based user identification

Clean and responsive UI (mobile-friendly)

Centralized error handling (auth + database)

Scalable folder structure (MVC + utilities)

🛠 Tech Stack

Backend

Node.js

Express.js

Database

MySQL

Templating

EJS (server-side rendering)

Authentication

bcrypt (password hashing & verification)

Utilities

@faker-js/faker (UUID generation)

method-override

Development

Nodemon

🌐 Live Demo

👉 https://user-management-system-l8xd.onrender.com/

src/
│
├── config/              # Database configuration
│   └── db.js
│
├── controllers/         # Business logic
│   └── user.controller.js
│
├── middlewares/         # Custom middlewares
│   └── auth.middleware.js
│
├── models/              # Database queries
│   └── user.model.js
│
├── routes/              # Route definitions
│   └── user.routes.js
│
├── utils/               # Helper functions
│   └── hash.js
│
├── public/              # Static files
│   ├── css/
│   ├── js/
│   └── images/
│
├── views/
│   ├── layouts/         # Main layout
│   │   └── main.ejs
│   │
│   ├── partials/        # Reusable components
│   │   └── header.ejs
│   │
│   ├── users/           # User-related views
│   │   ├── users.ejs
│   │   ├── new.ejs
│   │   ├── edit.ejs
│   │   └── delete.ejs
│   │
│   ├── home.ejs
│   ├── error.ejs
│   └── databaseError.ejs
│
├── app.js               # Express app setup
├── server.js            # Entry point
└── schema.sql           # Database schema

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/Manpreet109209/User-Management-System
cd User-Management-System
2️⃣ Install dependencies
npm install
3️⃣ Setup environment variables

Create a .env file:

PORT=2211
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=yourdatabase
4️⃣ Run the server
npm run dev
5️⃣ Open in browser
http://localhost:2211/
🔐 Security Implementation

Passwords are hashed using bcrypt before storage

Sensitive actions (update/delete) require password verification

Prevents unauthorized modifications

Basic authentication flow implemented at controller level

📚 What This Project Demonstrates

MVC architecture in Express applications

Clean backend project structuring

Server-side rendering with EJS

RESTful routing principles

MySQL integration and query handling

Authentication fundamentals (hashing + verification)

Error handling in production-style apps

Responsive UI without frontend frameworks

🚧 Future Improvements

Session-based authentication (login system)

JWT authentication (API-ready version)

Role-based access control (admin/user)

Input validation (Joi / Zod)

Pagination & search

Convert to REST API + React frontend

👨‍💻 Author

Manpreet
Class 11 Student | Aspiring Software Engineer

Building real-world systems with limited resources and no excuses.
