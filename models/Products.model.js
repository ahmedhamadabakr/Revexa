const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      unique: true,
      trim: true, // إزالة المسافات الزائدة
    },
    description: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 1000, // زيادة الحد الأقصى للوصف
      trim: true,
    },
    price: {
      type: Number, // تحويل السعر إلى رقم بدلاً من نص
      required: true,
      min: 0, // تجنب القيم السالبة
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true }, // مطلوب للتحكم في الصور في Cloudinary
      }
    ],
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
      trim: true,
    }
  },
  { timestamps: true } // يضيف createdAt و updatedAt تلقائيًا
);

const Product = mongoose.model("Product", ProductsSchema);
module.exports = Product;
