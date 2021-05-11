//require mongoose
const mongoose = require('mongoose');

//design user schema
const userSchema = new mongoose.Schema({
    name: {
       type: String,
       required: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
}, 
    {
        timestamps: true,
    }
);

//assign name User to the user schema
const User = mongoose.model('User', userSchema);

//export User
module.exports = User;