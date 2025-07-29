# Todo List API 🚀

![Todo List API](https://img.shields.io/badge/status-active-success.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-blue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust REST API for managing todo lists with user authentication, task management, and password recovery features.

## Table of Contents 📖

- [Features](#features-)
- [Technologies](#technologies-)
- [Installation](#installation-)
- [API Documentation](#api-documentation-)
  - [Authentication](#authentication)
  - [Tasks](#tasks)
  - [Users](#users)
- [Frontend Integration](#frontend-integration-)
- [Environment Variables](#environment-variables-)
- [Error Handling](#error-handling-)
- [Rate Limiting](#rate-limiting-)
- [Security](#security-)
- [Testing](#testing-)
- [Deployment](#deployment-)
- [Contributing](#contributing-)
- [License](#license-)

## Features ✨

- ✅ JWT Authentication
- 🔐 Password encryption
- 📧 Email password reset
- 📝 CRUD operations for tasks
- 👤 User profile management
- ⏱️ Rate limiting
- 🔒 Secure HTTP headers

## Technologies 💻

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, bcryptjs
- **Email**: Nodemailer (Brevo/Sendinblue)
- **Security**: Helmet, rate limiting
- **Logging**: Morgan

## Installation 🛠️

1. Clone the repository:
  
   git clone https://github.com/yourusername/todo-api.git
   cd todo-api
   Install dependencies:

    npm install
    Create a .env file in the root directory:

env
DATABASE=mongodb+srv://<username>:<password>@cluster0.mongodb.net/todo-app
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email@example.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=Todo App <noreply@todoapp.com>
Start the development server:


npm start
API Documentation 📚
Base URL: https://yourdomain.com/api/v1

Authentication
Register a new user
http
POST /auth/signup
Request:

json
{
"username": "testuser",
"email": "test@example.com",
"password": "test1234",
"passwordConfirm": "test1234"
}
Success Response (201 Created):

json
{
"status": "success",
"data": {
"user": {
"\_id": "5f8d...",
"username": "testuser",
"email": "test@example.com"
}
}
}
Login
http
POST /auth/login
Request:

json
{
"username": "testuser",
"password": "test1234"
}
Success Response (200 OK):

json
{
"status": "success",
"token": "eyJhb...",
"data": {
"user": {
"id": "5f8d...",
"username": "testuser"
}
}
}
Tasks
All task endpoints require authentication (JWT token in cookies).

Create a new task
http
POST /todo/tasks
Request:

json
{
"title": "Buy groceries",
"description": "Milk, eggs, bread",
"status": "pending"
}
Success Response (201 Created):

json
{
"status": "success",
"data": {
"task": {
"\_id": "5f8e...",
"title": "Buy groceries",
"status": "pending",
"createdAt": "2023-08-01T10:00:00.000Z"
}
}
}
Users
Update user profile
http
PATCH /todo/user/updateuser
Request:

json
{
"username": "newusername",
"email": "newemail@example.com"
}
Success Response (200 OK):

json
{
"status": "success",
"data": {
"user": {
"\_id": "5f8d...",
"username": "newusername",
"email": "newemail@example.com"
}
}
}
Frontend Integration 🌐
Example JavaScript fetch request for creating a task:

javascript
const createTask = async (taskData) => {
const response = await fetch('/api/v1/todo/tasks', {
method: 'POST',
credentials: 'include',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify(taskData)
});

if (!response.ok) {
const error = await response.json();
throw new Error(error.message);
}

return await response.json();
};

// Usage:
createTask({
title: "New Task",
description: "Task description",
status: "pending"
}).then(data => console.log(data));



## Environment Variables 🛡️
Variable Description Example
DATABASE MongoDB connection string mongodb+srv://user:pass@cluster.mongodb.net/db
JWT*SECRET Secret for signing JWTs supersecretpassword
JWT_EXPIRES_IN JWT expiration time 7d
EMAIL*\* Email service credentials See installation
Error Handling ⚠️
The API returns consistent error responses:

json
{
"status": "error",
"message": "Detailed error message",
"code": "ERROR_CODE",
"details": {
"field": "Specific error about this field"
}
}
Common error codes:

AUTH_001: Invalid credentials

VALID_001: Validation error

DB_001: Database error

Rate Limiting ⏱️
100 requests per 15 minutes per IP address

Exceeds response:

json
{
"status": "fail",
"message": "Too many requests from this IP, please try again in 15 minutes"
}
Security 🔒
Password hashing with bcrypt

JWT in HTTP-only cookies

CSRF protection

Helmet for secure headers

Input sanitization

Rate limiting

Testing 🧪
Run tests with:


npm test
Test coverage includes:

Authentication flows

Task CRUD operations

User management

Error scenarios

Deployment 🚀

Docker Example:

dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package\*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
Contributing 🤝
Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

License 📄
This project is licensed under the MIT License - see the LICENSE file for details.



