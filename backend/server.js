/*
    For Review:
    - for deletion/clean up: commented out lines that are transferred to router.js and controller.js
*/

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
// import { hash, compare } from 'bcrypt';
// import jwt from 'jsonwebtoken';
import router from './router.js';


//App using Express
const app = express();

//Connecting to MongoDB
//Using MongoDB Atlas as initial DB but same code can be used for MongoDB Compass
const dbURI = 'mongodb://localhost:27017/UsersDB';
// const dbURI = 'mongodb://localhost:27017/FarmToTable';

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
// app.use(express.json());
app.use(cors());

router(app);

//FOR STARTING BACKEND
//1. Change to the directory where the server.js file is located (backend)
//2. Run the command "npx modemon server.js" in the terminal

///Nodemon is used to automate restating server when changes are made to the code.