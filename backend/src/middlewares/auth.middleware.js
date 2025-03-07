import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async(req, res, next) => {
    try {
        let token = null
        try {
            token = req.cookie.jwt;
        } catch (error) {
            token = null
            return res.status(401).json({message: "Unauthorized - No Token Provided"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded)
        {
            return res.status(401).json({message: "Unauthorized - Invalid Token"})
        }

        const User = await User.findById(decoded.userId).select("-password");

        if(!User){
            return res.status(401).json({message: "User not Found"})
        }

        req.user = user;

        next()
    } catch (error) {
        console.log("Error in Auth Middleware ", error.message);
        return res.status(500).json({message: "Internal Server Error"})
    }
}
