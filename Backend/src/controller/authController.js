import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import User from '../models/userModel.js';
import e from 'express';

export const signup = async (req, res) => {
    const { fullname, email, password, phone } = req.body;
    try{
        if (!fullname || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        } 
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({ message: 'Phone number must be 10 digits long' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname:fullname,
            email:email,
            password:hashedPassword,
            phone:phone,
            profilePic: req.file ? req.file.path : undefined,
            isAdmin: req.route.path.includes('/admin') ? true : false,
        });

        newUser.save()
            .then(() => {
                generateToken(newUser._id, res);
                res.status(201).json({ message: 'User created successfully', user: {email: newUser.email, fullname: newUser.fullname, phone: newUser.phone} });
            })
            .catch((error) => {
                res.status(500).json({ message: 'Error creating user', error });
            });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            generateToken(existingUser._id, res);
            res.status(200).json({ message: 'Login successful', user: { email: existingUser.email, fullname: existingUser.fullname, phone: existingUser.phone } });
        }
        else {
            return res.status(400).json({ message: 'User does not exist' });
        }
    }
    catch {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
    
}

export const logout = (req, res) => {
    try{
        res.clearCookie("jwt", { path: '/' });
        res.status(200).json({ message: 'Logout successful' });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}