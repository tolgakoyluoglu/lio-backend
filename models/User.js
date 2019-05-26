const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, enum: ['user', 'admin'] },
    register_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', UserSchema);
