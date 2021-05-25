const mongoose = require('mongoose');

const preorderSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true
    },
    shippingState: {
        type: String,
        required: true,
    },
    shippingCity: {
        type: String,
        required: true,
    },
    shippingPincode: {
        type: String,
        required: true,
    },
    shippingDealershipName: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    billingAddress: {
        type: String,
        required: true,
    },
    billingLandmark: {
        type: String,
        required: true, 
    },
    billingPincode: {
        type: String,
        required: true, 
    },
    billingCity: {
        type: String,
        required: true,
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',        
    }
},  {
        timestamps: true,
    }
)

const Preorder = mongoose.model('Preorder', preorderSchema);

module.exports = Preorder;