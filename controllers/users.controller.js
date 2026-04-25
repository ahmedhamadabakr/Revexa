const User = require("../models/user.model");
const userValidation = require("../requests/users/user.vaildation");

const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));

    const users = await User.find()
      .select("-password -refreshToken -passwordResetToken -passwordResetExpires")
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      message: "All users",
      status: "success",
      data: users,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message, data: null });
  }
};

const getUserById = async (req, res) => {
  try {
    userValidation.parse({ userId: req.params.userId });

    const user = await User.findById(req.params.userId)
      .select("-password -refreshToken -passwordResetToken -passwordResetExpires");

    if (!user) {
      return res.status(404).json({ message: "User not found", data: null });
    }

    res.status(200).json({ message: "User found", status: "success", data: user });
  } catch (error) {
    res.status(400).json({ message: error.message, data: null });
  }
};

const updateUser = async (req, res) => {
  try {
    userValidation.parse({ userId: req.params.userId });

    // Users can only update their own profile; admins can update anyone
    if (req.user.id !== req.params.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. You can only update your own profile.", data: null });
    }

    // Prevent role escalation
    const { password, role, ...allowedUpdates } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).select("-password -refreshToken -passwordResetToken -passwordResetExpires");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found", data: null });
    }

    res.status(200).json({ message: "User updated successfully", status: "success", data: updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message, data: null });
  }
};

const deleteUser = async (req, res) => {
  try {
    userValidation.parse({ userId: req.params.userId });

    // Users can only delete their own account; admins can delete anyone
    if (req.user.id !== req.params.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. You can only delete your own account.", data: null });
    }

    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", data: null });
    }

    res.status(200).json({ message: "User deleted successfully", data: true });
  } catch (error) {
    res.status(400).json({ message: error.message, data: null });
  }
};

const updateFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    if (!fcmToken) {
      return res.status(400).json({ message: "fcmToken is required", data: null });
    }

    // Clear token from any other user first
    await User.updateMany({ fcmToken, _id: { $ne: req.user.id } }, { $set: { fcmToken: null } });
    await User.findByIdAndUpdate(req.user.id, { fcmToken });

    res.status(200).json({ message: "FCM token updated successfully", data: true });
  } catch (error) {
    res.status(500).json({ message: error.message, data: null });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, updateFcmToken };
