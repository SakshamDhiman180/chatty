import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protectedRoute = async (req, res, next) => {
    try {
        const token  =  req.cookies.jwt || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }

        req.user = await User.findById(decoded.userId).select("-password");
        next();
    
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
}