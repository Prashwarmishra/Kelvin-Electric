const mongoose = require('mongoose');

const testrideSchema = new mongoose.Schema({
    dealershipName: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
},  {
        timestamps: true,
    }
);

const Testride = mongoose.model('Testride', testrideSchema);

module.exports = Testride;