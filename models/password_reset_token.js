const mongoose = require('mongoose');

const passwordResetTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    isValid: {
       type: Boolean,
       required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true,
});

const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);

module.exports = PasswordResetToken;