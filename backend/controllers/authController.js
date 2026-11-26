import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Account from "../models/Account.js";
import generateAccountNumber from "../utils/generateAccountNumber.js";

const registerUser = async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;
    
    if (!full_name || !email || !phone || !password) {
      return res.status(400).json({
        message: "Please fill in all fields",
      });
    }
    
    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^[0-9]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    
    if (!nameRegex.test(full_name)) {
      return res.status(400).json({
        message: "Full name can only contain letters and spaces",
      });
    }
    
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: "Phone number can only contain numbers",
      });
    }
    
    if (phone.length < 10 || phone.length > 15) {
      return res.status(400).json({
        message: "Please enter a valid phone number",
      });
    }
    
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
        "Password must be at least 8 characters and contain a letter and a number",
      });
    }
    
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists",
      });
    }
    
    const password_hash = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      full_name,
      email,
      phone,
      password_hash,
    });
    
    const accountNumber = generateAccountNumber();
    
    await Account.create({
      user_id: user._id,
      account_number: accountNumber,
    });
    
    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter your email and password",
      });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    
    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );
    
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};


export { registerUser, loginUser };