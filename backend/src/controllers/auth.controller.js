import jwt from "jsonwebtoken";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signup = async(req,res) => {
  const { name, email, password, role} = req.body;
  
  if (!name || !password || !email){
    return res.status(400).json({
      message: "all fields are required"
    });
  }
  try {
    if (password.length < 8){
      return res.status(400).json({
        message: "Password must be greater than 6 Characters"
      });
    }

    const user = await User.findOne({email})

    if (user){
      return res.status(400).json({message:"email already exists."});
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      name: name,
      email : email,
      password: hashedPassword,
      role: role || "Associate",
    })

    if(newUser){
      generateToken(newUser._id, res)
      await newUser.save();

      res.status(201).json({
        _id:newUser._id,
        name: newUser.name,
        role: newUser.role
      })
    }else{
      return res.status(400).json({message:"Invalid User Data"});
    }
    
  } catch (error) {
    console.log("Error in Signup Controller " , error);
    res.status(500).json({message: "Error on server side"})
  }

}

export const login = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    // 1. Auto-login with token if valid
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }

        return res.status(200).json({
          _id: user._id,
          name: user.name,
          role: user.role,
          message: "Auto-login successful",
        });
      } catch (err) {
        console.log("Auto-login token error:", err.message);
        // Continue to manual login fallback
      }
    }

    // 2. Manual login with credentials
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      role: user.role,
      message: "Login successful",
    });

  } catch (error) {
    console.log("Login error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const logout = (req,res) => {
    try {
      res.cookie("jwt","",{maxAge:0})
      return res.status(200).json({message :"User Logged Out Succesfully"})
    } catch (error) {
      console.log("Error in Logout Controller ", error.message);
      return res.status(500).json({message :"Internal Server Error"})
    }
}

export const checkAuth = async (req, res) => {
  const user = req.user; // set by protectRoute middleware
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.status(200).json({
    _id: user._id,
    name: user.name,
    role: user.role,
    message: "Authenticated"
  });
};