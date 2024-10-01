import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";
import bcrypt from "bcrypt";

// @desc   Get all users
// @route  GET /api/users
export const getUsers = async (req, res, next) => {
  try {
    // Fetch all users from the database
    const users = await User.find({}).select("-_id -password");

    // Send users in the response
    res.status(200).json(users);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
export const getUser = async (req, res, next) => {
  try {
    // Retrieve user ID from the request parameters
    const id = req.params.id;

    // Find user by ID, excluding the password field
    const user = await User.findById(id).select("-password");

    // If user not found, return an error response
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the user details in the response
    res.status(200).json(user);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the hashed password in DB with the password sent by the user
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Password is valid, login the user (e.g., create a session or token)
    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// @desc    Create new user
// @route   POST /api/users
export const createUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.json({ error: "User already exists" });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
    });

    // If user is created successfully
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { email, username, logo, password } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if they are provided
    if (email) user.email = email;
    if (username) user.username = username;
    if (logo) user.logo = logo;

    // Hash the new password if provided
    if (password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    // Save the updated user
    const updatedUser = await user.save();

    // Respond with the updated user information excluding the password
    res.status(200).json({
      _id: updatedUser._id,
      email: updatedUser.email,
      username: updatedUser.username,
      logo: updatedUser.logo,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userDeleted = await User.findByIdAndDelete(id);
    // Delete users that belong to the user (where user_id matches the user's id)
    await Post.deleteMany({ user_id: id });
    await Comment.deleteMany({ user_id: id });
    if (!userDeleted) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};
