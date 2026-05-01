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


# Revexa API Endpoints

## Authentication

### POST `/register`
- **Body:**
   - `email` (string, required)
   - `password` (string, required, min 6)
   - `firstName` (string, required)
   - `lastName` (string, required)
   - `phone` (string, required)
   - `address` (string, optional)
   - `age` (number, required, min 18)
   - `gender` ("male" | "female", required)
- **Returns:**
   - `token`, `user` object

### POST `/login`
- **Body:**
   - `email` (string, required)
   - `password` (string, required)
- **Returns:**
   - `token`, `user` object

### POST `/logout`
- **Headers:**
   - `Authorization: Bearer <token>` (required)
- **Returns:**
   - Success message

### POST `/forgot-password`
- **Body:**
   - `email` (string, required)
- **Returns:**
   - Success message

### POST `/reset-password/:token`
- **Body:**
   - `password` (string, required)
- **Returns:**
   - Success message

---

## Products

### GET `/products`
- **Query:**
   - `page` (number, optional)
   - `limit` (number, optional)
- **Returns:**
   - List of products, pagination info

### GET `/products/:productId`
- **Params:**
   - `productId` (string, required)
- **Returns:**
   - Product object

### POST `/products`
- **Headers:**
   - `Authorization: Bearer <token>` (required, company only)
- **Body (form-data):**
   - `title` (string, required)
   - `description` (string, required)
   - `category` (string, required)
   - `price` (number, required)
   - `images` (array of files, required, min 1, max 5)
   - `location` (string, optional)
- **Returns:**
   - Created product object

### PUT `/products/:productId`
- **Headers:**
   - `Authorization: Bearer <token>` (required, company only)
- **Body:**
   - Any updatable product fields
- **Returns:**
   - Updated product object

### DELETE `/products/:productId`
- **Headers:**
   - `Authorization: Bearer <token>` (required)
- **Returns:**
   - Success message

---

## Orders

### GET `/orders`
- **Headers:**
   - `Authorization: Bearer <token>` (required)
- **Returns:**
   - List of orders

### GET `/orders/:orderId`
- **Headers:**
   - `Authorization: Bearer <token>` (required)
- **Params:**
   - `orderId` (string, required)
- **Returns:**
   - Order object

### POST `/orders/:productId`
- **Headers:**
   - `Authorization: Bearer <token>` (required)
- **Body:**
   - `carDetails` (string, required)
   - `appointmentDate` (string, required)
- **Returns:**
   - Created order object

### PUT `/orders/:orderId`
- **Headers:**
   - `Authorization: Bearer <token>` (required)
- **Body:**
   - `status` (string, optional: pending, confirmed, in-progress, completed, cancelled)
- **Returns:**
   - Updated order object

### DELETE `/orders/:orderId`
- **Headers:**
   - `Authorization: Bearer <token>` (required)
- **Returns:**
   - Success message

---

## Users

### GET `/users`
- **Headers:**
   - `Authorization: Bearer <token>` (required, admin only)
- **Returns:**
   - List of users

### GET `/users/:userId`
- **Headers:**
   - `Authorization: Bearer <token>` (required)
- **Params:**
   - `userId` (string, required)
- **Returns:**
   - User object

### PUT `/users/:userId`
- **Headers:**
   - `Authorization: Bearer <token>` (required)
- **Body:**
   - Updatable user fields (except role/password)
- **Returns:**
   - Updated user object

### DELETE `/users/:userId`
- **Headers:**
   - `Authorization: Bearer <token>` (required)
- **Returns:**
   - Success message

### POST `/users/fcm-token`
- **Headers:**
   - `Authorization: Bearer <token>` (required)
- **Body:**
   - `fcmToken` (string, required)
- **Returns:**
   - Success message

---

## Categories

### GET `/categories`
- **Returns:**
   - List of categories

### POST `/categories`
- **Headers:**
   - `Authorization: Bearer <token>` (required, admin only)
- **Body:**
   - `name` (string, required)
   - `description` (string, optional)
- **Returns:**
   - Created category object

### DELETE `/categories/:id`
- **Headers:**
   - `Authorization: Bearer <token>` (required, admin only)
- **Returns:**
   - Success message

---

## Notifications

### POST `/notifications/send`
- **Body:**
   - `userId` (string, required)
   - `fcmToken` (string, optional)
   - `title` (string, required)
   - `body` (string, required)
   - `data` (object, optional)
- **Returns:**
   - Success message

---

**ملاحظة:**
- كل endpoint يتطلب Authorization header إذا كان خاص أو يتطلب صلاحيات.
- الحقول المطلوبة (required) يجب إرسالها، أما الحقول الاختيارية (optional) يمكن عدم إرسالها.
- كل endpoint يرجع رسالة نجاح أو بيانات أو رسالة خطأ حسب الحالة.

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
