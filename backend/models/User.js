const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: { type: String }, // Stores the hashed reset token
    resetTokenExpiry: { type: Date } // Stores expiry time
});

module.exports = mongoose.model('User', UserSchema);
