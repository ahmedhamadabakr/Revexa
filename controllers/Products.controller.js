const productsSchema = require("../requests/products/products.schema");
const productIdschema = require("../requests/products/product.validation");
const Product = require("../models/Products.model");

const getAllProducts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));

    const products = await Product.find()
      .populate("category", "name")
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      message: "Products retrieved successfully",
      data: products.map((product) => ({
        id: product._id,
        title: product.title,
        description: product.description,
        images: product.images,
        price: product.price,
        category: product.category?.name,
        companyId: product.companyId,
        location: product.location,
      })),
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message, data: false });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.productId;
    productIdschema.parse({ productId: id });

    const product = await Product.findById(id).populate("category", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found", data: null });
    }

    res.status(200).json({
      message: "Product found",
      status: "success",
      data: {
        id: product._id,
        title: product.title,
        description: product.description,
        images: product.images,
        category: product.category?.name,
        price: product.price,
        location: product.location,
        companyId: product.companyId,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message, data: null });
  }
};

const createProduct = async (req, res) => {
  try {
    // Images come from Cloudinary via multer (req.files), not req.body
    const images = req.files
      ? req.files.map((file) => ({
          url: file.path,
          public_id: file.filename,
        }))
      : [];

    const bodyData = {
      ...req.body,
      price: parseFloat(req.body.price),
      images,
    };

    const data = productsSchema.parse(bodyData);

    const newProduct = await Product.create({
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      images: data.images,
      companyId: req.user.id,
      location: data.location,
    });

    res.status(201).json({
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(400).json({ message: "Validation error", error: error.message, data: false });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    productIdschema.parse({ productId: id });

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found", data: null });
    }

    // Ownership check: only the company that created it can update
    if (existingProduct.companyId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied. You don't own this product.", data: null });
    }

    // Partial update — only validate provided fields
    const partialSchema = productsSchema.partial();
    const data = partialSchema.parse(req.body);

    const updated = await Product.findByIdAndUpdate(id, { $set: data }, { new: true });

    res.status(200).json({
      message: "Product updated",
      status: "success",
      data: {
        id: updated._id,
        title: updated.title,
        description: updated.description,
        price: updated.price,
        category: updated.category,
        images: updated.images,
        location: updated.location,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message, data: null });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    productIdschema.parse({ productId: id });

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found", data: null });
    }

    // Ownership check: only the company that created it (or admin) can delete
    if (product.companyId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. You don't own this product.", data: null });
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully", data: true });
  } catch (error) {
    res.status(400).json({ message: error.message, data: null });
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
