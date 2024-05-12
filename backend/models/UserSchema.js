const mongoose = require('mongoose');

//Creating user schema to be used in MongoDB
const UserSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    
    mname: {
        type: String,
    },

    lname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;