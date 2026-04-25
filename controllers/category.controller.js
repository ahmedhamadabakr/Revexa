const Category = require("../models/Category.model");

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "Category name is required and must be at least 2 characters", data: null });
    }

    const category = await Category.create({ name: name.trim(), description });
    res.status(201).json({ message: "Category created", status: "success", data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Category already exists", data: null });
    }
    res.status(400).json({ message: error.message, data: null });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ message: "Categories retrieved successfully", status: "success", data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message, data: null });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found", data: null });
    }
    res.status(200).json({ message: "Category deleted successfully", data: true });
  } catch (error) {
    res.status(400).json({ message: error.message, data: null });
  }
};

module.exports = { createCategory, getAllCategories, deleteCategory };
