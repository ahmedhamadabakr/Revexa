# Revexa API

A Node.js RESTful API for an Revexa platform, built with Express and MongoDB. It supports authentication, user management .

## Features

- **Authentication**
  - Register (Signup)
  - Login (Signin)
  - Logout
- **Users**
  - Get all users (with pagination)
  - Get user by ID
  - Update user
  - Delete user


## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local or remote)

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd Revexa
   ```
2. Install dependencies:
   ```bash
   npm install
   ```


   > By default, the app uses hardcoded values for JWT and connects to `.

4. Start the server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The server will run at [http://localhost:8000](http://localhost:8000)

## API Endpoints

### Authentication

- `POST /api/register` — Register a new user
- `POST /api/login` — Login
- `POST /api/logout` — Logout (requires authentication)

### Users

- `GET /api/users` — Get all users
- `GET /api/users/:userId` — Get user by ID
- `PUT /api/update/:userId` — Update user
- `DELETE /api/delete/:userId` — Delete user

## Database Structure

### Users

- `id`
- `firstname` (string, required)
- `lastname` (string, required)
- `email` (string, required)
- `password` (string, required)
- `gender` (male or female, optional)
- `address` (string, optional)

## Dependencies

- express
- mongoose
- jsonwebtoken
- bcrypt
- dotenv
- morgan
- errorhandler
- zod
- nodemon (dev)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Ahmed Bakr**

- Email: ahmedhamadabakr77@gmail.com
- GitHub: [@ahmedbakr](https://github.com/ahmedbakr)

---

⭐ If you like this project, don't forget to give it a star!
