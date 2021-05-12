const mongoose = require('mongoose');

const accessTokenSchema = new mongoose.Schema({
    accessToken: {
        type: String,
        required: true,
    },
    isValid: {
        type: boolean,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
},  
    {
        timestamps: true,
    }
);

const AccessToken = mongoose.model('AccessToken', accessTokenSchema);
module.exports = AccessToken;