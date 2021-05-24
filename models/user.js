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
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    preorders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Preorder',
        }
    ]
}, 
    {
        timestamps: true,
    }
);

//assign name User to the user schema
const User = mongoose.model('User', userSchema);

//export User
module.exports = User;