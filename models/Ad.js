const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], required: true },
    location: { type: String, required: true }, //Either you write your own information on all fields or what you require as company ? Probably need to make a better solution for this later..
    endDate: { type: Date, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ad', AdSchema);
