const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    firstname: { type: String },
    surname: { type: String },
    type: { type: String, required: true },    //company or student
    status: { type: String }, //Employed or unemployed etc
    description: { type: String },
    skills: { type: [String] },
    location: { type: String }, //Either you write your own information on all fields or what you require as company ? Probably need to make a better solution for this later..
    picture: { type: String },
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
