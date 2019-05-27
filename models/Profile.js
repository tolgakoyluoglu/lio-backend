const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String }, // Company name
    firstname: { type: String },
    surname: { type: String },
    type: { type: String, required: true },
    status: { type: String },
    description: { type: String, default: '--' },
    industry: { type: String },
    skills: { type: [String] },
    location: { type: String },
    picture: { type: String, default: 'https://i.imgur.com/EuSn6V6.jpg' },
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
    ]
});

module.exports = mongoose.model('Profile', ProfileSchema);
