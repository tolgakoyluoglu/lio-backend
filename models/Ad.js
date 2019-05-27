const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], required: true },
    location: { type: String, required: true },
    endDate: { type: Date, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ad', AdSchema);
