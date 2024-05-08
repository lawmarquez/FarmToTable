const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//SCHEMA
const User = require('./models/UserSchema');
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
        const {email, username, password} = req.body;
        //Password hashing for added security (10 as key rotation, normally 12 or 13)
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            username,
            password: hashedPassword
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
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({error: 'Invalid Username or Password'});
        }

        const token = jwt.sign({userId: user._id}, SECRET_KEY, {expiresIn : '1h'});
        res.json({message: 'Login Successful'});
    }catch(err){
        res.status(500).json({error: 'Login error'});
    }
})