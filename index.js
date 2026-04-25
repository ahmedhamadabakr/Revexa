const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const notificationRoutes = require('./routes/notificationRoutes');
const authenticationRouter = require('./routes/authentication.routes');
const usersRouter = require('./routes/users.routes');
const productRouter = require('./routes/products.routes');
const categoryRouter = require('./routes/category.routes');
const orederRouter = require('./routes/order.routes');

const app = express();
app.use(express.json());

// Database Connection
const dbUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!dbUri) {
  console.error('خطأ حرِج: لم يتم العثور على MONGODB_URI أو MONGO_URI في ملف .env');
  process.exit(1);
}

mongoose.connect(dbUri)
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