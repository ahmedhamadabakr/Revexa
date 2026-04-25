const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const notificationRoutes = require('./routes/notificationRoutes');
const authenticationRouter = require('./routes/authentication.routes');
const usersRouter = require('./routes/users.routes');
const productRouter = require('./routes/products.routes');
const categoryRouter = require('./routes/category.routes');
const orederRouter = require('./routes/order.routes');

dotenv.config();
const app = express();
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('DB Connection Error:', err));

// Routes
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authenticationRouter);
app.use('/api/users', usersRouter);
app.use('/', productRouter); // يحتوي بالفعل على /api/products داخل ملفه
app.use('/api/categories', categoryRouter);
app.use('/', orederRouter); // يحتوي بالفعل على /api/orders داخل ملفه

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;