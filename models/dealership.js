const mongoose = require('mongoose');

const dealershipSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    }
},  {
        timestamps: true
    }
);

const Dealership = mongoose.model('Dealership', dealershipSchema);

module.exports = Dealership;