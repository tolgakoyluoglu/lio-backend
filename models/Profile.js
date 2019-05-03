const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    type: { type: String, required: true },    //company or student
    status: { type: String, required: true }, //Employed or unemployed etc
    description: { type: String, required: true },
    skills: { type: [String], required: true },
    location: { type: String }, //Either you write your own information on all fields or what you require as company
    website: { type: String },
    language: { type: String },
    date: { type: Date, default: Date.now },
    experience: [
        {
            title: { type: String },
            company: { type: String },
            location: { type: String },
            description: { type: String },
            from: { type: Date },
            to: { type: Date },
            isEmployed: { type: Boolean, default: false },
        }
    ],
    education: [
        {
            school: { type: String },
            degree: { type: String },
            field: { type: String },
            description: { type: String },
            from: { type: Date },
            to: { type: Date },
            isStudying: { type: Boolean, default: false },
        }
    ],
    social: [
        {
            linkedin: { type: String },
            facebook: { type: String },
            instagram: { type: String },
            twitter: { type: String },
        }
    ],
})

module.exports = mongoose.model('Profile', ProfileSchema);