import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';


//SCHEMA
import User from './models/UserSchema.js';

const { sign } = jwt;

const SECRET_KEY = 'authentication'

//App using Express
const app = express();

//Connecting to MongoDB
//Using MongoDB Atlas as initial DB but same code can be used for MongoDB Compass
const dbURI = 'mongodb://localhost:27017/UsersDB';

mongoose.connect(dbURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => {
    //Assigning port 3001 to the server (Accessing Database)
    app.listen(3001, () => {
        console.log('Server is running on port 3001 and connected to MongoDB');
    });
})
.catch((err) => {
    console.log('Unable to connect to MongoDB',err)
});

//Middleware (connecting code to database)
app.use(bodyParser.json());
app.use(cors());

//Routes
//Registration
//POST Registration (sending requestto register)
app.post("/register", async(req, res)=>{
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
            password: hashedPassword,
            type: "user"
        });
        await newUser.save();
        res.status(201).json({message: "User Registered"});
    } catch(err){
        res.status(500).json({error: 'Error registering new user'});
    }

})

//GET Registration (getting data from database)
app.get("/register", async(req, res)=>{
    try{
        //Finding the user in the database
        const users = await User.find();
        res.status(201).json(users);
    }catch(err){
        res.status(500).json({error: 'Unable to get users'});
    }
})


//Login
//POST Login (getting data from database)

app.post("/login", async(req, res)=>{
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
        const user_info = {userFName: user.fname, userLName: user.lname, userEmail: user.email, userType: user.type};
        res.json({message: 'Login Successful', token: token, user_info: user_info});
    }catch(err){
        res.status(500).json({error: 'Login error'});
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Error deleting user' });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;
        const user = await User.findByIdAndUpdate(id, { type }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Error updating user type' });
    }
});

//FOR STARTING BACKEND
//1. Change to the directory where the server.js file is located (backend)
//2. Run the command "npx modemon server.js" in the terminal

///Nodemon is used to automate restating server when changes are made to the code.