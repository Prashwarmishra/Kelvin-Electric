const mongoose = require('mongoose');

const accessTokenSchema = new mongoose.Schema({
    accessToken: {
        type: String,
        required: true,
    },
    isValid: {
        type: Boolean,
        required: true
    },
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

const AccessToken = mongoose.model('AccessToken', accessTokenSchema);
module.exports = AccessToken;