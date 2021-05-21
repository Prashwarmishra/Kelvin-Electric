const mongoose = require('mongoose');

const testrideSchema = new mongoose.Schema({
    dealershipName: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    isValid: {
        type: Boolean,
        required: true,
    }
},  {
        timestamps: true,
    }
);

const Testride = mongoose.model('Testride', testrideSchema);

module.exports = Testride;