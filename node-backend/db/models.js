const mongoose = require('mongoose');

// TODO: Implement auth
// TODO: Change url to $id, map url in response to proper url, get rid of image buffer in responses
// TODO: Implement like/unlike on memes
// TODO: Implement comment GET/POST

const url = `http://localhost:3001/resources/images/`; // FIXME:

const User = mongoose.model('User', new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        displayName: { type: String, required: true },
        password: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        likes: { type: Array, default: [] } // Array with ids of memes
    })
);

const Meme = mongoose.model('Meme', new mongoose.Schema({
        name: { type: String, required: true },
        creator: { type: String, required: true },
        visibility: { type: String, enum: ['private', 'unlisted', 'public'], default: 'public' },
        image: { type: Buffer, required: true },
        publicId: { type: String, required: true, unique: true },
        contentType: { type: String, default: 'image/png' }, // TODO: Make enum
        createdAt: { type: Date, default: Date.now },
        likes: {type: Number, default: 0 }
    }, 
    {
        id: false,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    })
);

Meme.schema.virtual('url').get(function() {
    return `${url}${this.publicId}`;
});

const Template = mongoose.model('Template', new mongoose.Schema({
        name: { type: String, required: true, unique: true  },
        creator: { type: String },
        visibility: { type: String, enum: ['private', 'unlisted', 'public'], default: 'public' },
        image: { type: Buffer, required: true },
        publicId: { type: String, required: true, unique: true },
        contentType: { type: String, default: 'image/png' }, // TODO: Make enum
        createdAt: { type: Date, default: Date.now },
        texts: { type: Array }
    })
);

const Comment = mongoose.model('Comment', new mongoose.Schema({
    content: { type: String, required: true, unique: true  },
    creator: { type: String },
    createdAt: { type: Date, default: Date.now }
    })
);


const uniqueId = () => {
    return Date.now() + '' + Math.floor(Math.random() * 100000);
}

const generatePublicId = async (model, publicIdSet) => {

    let publicId = uniqueId();
    let document = await model.findOne({ publicId });
    
    while(document || (publicIdSet ? publicIdSet.has(publicId) : false)) { // Ensure that the publicId is unique
        publicId = uniqueId();
        document = await model.findOne({ publicId });
    }
    if(publicIdSet) publicIdSet.add(publicId);
    return publicId;
}

module.exports = {
    User,
    Meme,
    Template,
    generatePublicId
}