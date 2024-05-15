/*
  For Review:
  - transferred methods from server.js
*/

import mongoose from "mongoose";
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

const { sign } = jwt;
const SECRET_KEY = 'authentication'

//SCHEMA
import User from './models/UserSchema.js';

// From server.js: Authentication
const getReg = async (req, res) => {
  try{
    //Finding the user in the database
    const users = await User.find();
    res.status(201).json(users);
  }catch(err){
    res.status(500).json({error: 'Unable to get users'});
  }
};

const register = async (req, res) => {
  try{
    const {fname, mname, lname, email, username, password} = req.body;
    //Password hashing for added security (10 as key rotation, normally 12 or 13)
    const hashedPassword = await hash(password, 10);
    const newUser = new User({
        fname,
        mname,
        lname,
        email,
        username,
        password: hashedPassword
    });
    await newUser.save();
    res.status(201).json({message: "User Registered"});
  } catch(err){
      res.status(500).json({error: 'Error registering new user'});
  }
};

const login = async(req, res) => {
  try{
    const {username, password} = req.body;
    
    //username comparison
    const user = await User.findOne({ username })
    if(!user){
        return res.status(401).json({error: 'Invalid Username or Password'});
    }

    //password comparison (since encrypted, use bcrypt to compare passwords)
    const isPasswordValid = await compare(password, user.password);
    if(!isPasswordValid){
        return res.status(401).json({error: 'Invalid Username or Password'});
    }
    
    const token = sign({userId: user._id}, SECRET_KEY, {expiresIn : '1h'});
    const user_info = {userFName: user.fname, userLName: user.lname, userEmail: user.email};
    res.json({message: 'Login Successful'});
  }catch(err){
    res.status(500).json({error: 'Login error'});
  }
};


// Other funcs from dbCart here






export {getReg, register, login};



