const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        displayName: { type: String, required: true },
        password: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    })
);

const Meme = mongoose.model('Meme', new mongoose.Schema({
        name: { type: String, required: true },
        creator: { type: String, required: true },
        visibility: { type: String, enum: ['private', 'unlisted', 'public'], default: 'public' },
        image: { type: Buffer, required: true },
        url: { type: String, required: true, unique: true },
        contentType: { type: String, default: 'image/png' },
        createdAt: { type: Date, default: Date.now }
    })
);

const Template = mongoose.model('Template', new mongoose.Schema({
        name: { type: String, required: true, unique: true  },
        creator: { type: String },
        visibility: { type: String, enum: ['private', 'unlisted', 'public'], default: 'public' },
        image: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    })
);

module.exports = {
    User,
    Meme,
    Template
}