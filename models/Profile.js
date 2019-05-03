const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    status: { type: String, required: true }, //Employed or unemployed etc
    type: { type: String, required: true },    //company or student
    description: { type: String, required: true },
    skills: { type: [String], required: true },
    location: { type: String }, //Either you write your own information on all fields or what you require as company
    website: { type: String },
    social: { type: String },
    experience: { type: String },
    language: { type: String },
    education: { type: String },
})

module.exports = mongoose.model('Profile', ProfileSchema);