const User = require("../models/user.model");
const userVaildation = require("../requests/users/user.vaildation");

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await User.find()
      .skip((page - 1) * limit) //skip the first n items returned by the query where n = (page - 1) * limit
      .limit(parseInt(limit)); //limit the number of items returned

    if (!users) {
      res.status(404).send("No users found");
      return;
    }

    const totalUsers = await User.countDocuments(); //count the total number of documents in the collection
    const totalPages = Math.ceil(totalUsers / limit); //calculate the total number of pages - ceil() rounds up to the nearest whole number

    res.status(200).json({
      message: "All users",
      status: "success",
      data: users.map((user) => ({
        //map the users array to a new array of objects with only the email, firstName, and lastName properties
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      })),
      pagination: {
        totalUsers,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.userId;
    userVaildation.parse({ userId: id });

    const isUser = await User.findById(id);
    console.log(isUser);
    if (!isUser) {
      res.status(404).send("User not found");
      return;
    }

    res.status(200).json({
      message: "User found",
      status: "success",
      data: {
        email: isUser.email,
        firstName: isUser.firstName,
        lastName: isUser.lastName,
        phone: isUser.phone,
      },
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.userId;
    try {
      userVaildation.parse({ userId: id }); //validate the id
    } catch (error) {
      res.status(400).send("Invalid user ID");
      return;
    }
    const user = await User.findById(id); //find the user by id

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    await User.updateOne({ _id: id }, { $set: { ...req.body } }); //update the user with the new data

    const userAfterUpdate = await User.findById(id);// call user after up date
    
    res.status(200).json({
      message: "User updated",
      status: "success",
      data: {
        email: userAfterUpdate.email,
        firstName: userAfterUpdate.firstName,
        lastName: userAfterUpdate.lastName,
      },
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.userId;
    userVaildation.parse({ userId: id }); //validate the id

    const user = await User.findById(id); //find the user by id
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    await User.deleteOne({ _id: id });
    res.send("delete user");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
