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
    })

    if(newUser){
      generateToken(newUser._id, res)
      await newUser.save();

      res.status(201).json({
        _id:newUser._id,
        name: newUser.name,
      })
    }else{
      return res.status(400).json({message:"Invalid User Data"});
    }
    
  } catch (error) {
    console.log("Error in Signup Controller " , error);
    res.status(500).json({message: "Error on server side"})
  }

}

export const login = async (req,res) => {

    const { email, password} = req.body;

    try {
      const user = await User.findOne({
        email : email
        })
      if (!user){
        return res.status(400).json({message :"Invalid Credentials"})
      }
      if (user != null)
        {
          if (await bcrypt.compareSync(password,user.password))
            {
              const token = generateToken(user._id, res)
              res.status(201).json({
                _id:user._id,
                name: user.name,
              })
            } else {
              return res.status(400).json({message :"Invalid Credentials"})
            }
          }
    } catch (error) {
      console.log("Error in login Controller ", error.message);
      return res.status(500).json({message :"Internal Server Error"})
    }
}

export const logout = (req,res) => {
    try {
      res.cookie("jwt","",{maxAge:0})
      return res.status(200).json({message :"User Logged Out Succesfully"})
    } catch (error) {
      console.log("Error in Logout Controller ", error.message);
      return res.status(500).json({message :"Internal Server Error"})
    }
}

export const checkAuth = (req,res) => {
  try{
    res.status(200).json(req.user);
  } catch(error) {
    console.log("Error in checkAuth Controller ", error.message);
    return res.status(500).json({message :"Internal Server Error"})
  }
}