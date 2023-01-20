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
        contentType: { type: String, default: 'image/png' }, // TODO: Make enum
        createdAt: { type: Date, default: Date.now }
    })
);

const Template = mongoose.model('Template', new mongoose.Schema({
        name: { type: String, required: true, unique: true  },
        creator: { type: String },
        visibility: { type: String, enum: ['private', 'unlisted', 'public'], default: 'public' },
        image: { type: String, required: true },
        url: { type: String, required: true, unique: true },
        contentType: { type: String, default: 'image/png' }, // TODO: Make enum
        createdAt: { type: Date, default: Date.now }
    })
);

const uniqueId = () => {
    return Date.now() + '' + Math.floor(Math.random() * 100000);
}

const generateUrl = async (model, urlSet) => {

    let url = uniqueId();
    let document = await model.findOne({ url });
    
    while(document || (urlSet ? urlSet.has(url) : false)) { // Ensure that the url is unique
        url = uniqueId();
        document = await model.findOne({ url });
    }
    urlSet.add(url);
    return url;
}

module.exports = {
    User,
    Meme,
    Template,
    generateUrl
}