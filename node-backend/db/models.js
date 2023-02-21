const mongoose = require('mongoose');
const archiver = require('archiver');
const axios = require('axios');

const url = `http://localhost:3001/resources/images/`; // FIXME:

const User = mongoose.model('User', new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        displayName: { type: String, required: true },
        password: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    },
    {
        methods: {
            async getLikesCount() {
                return await Like.countDocuments({ username: this.username });
            },
            async getLikesReceivedCount() {
                const memes = await Meme.find({ creator: this.username });
                const memeIds = memes.map(meme => meme.publicId);
                return await Like.countDocuments({ memePublicId: { $in: memeIds } });
            },
            async getCommentsCount() {
                return await Comment.countDocuments({ username: this.username });
            },
            async getCommentsReceivedCount() {
                const memes = await Meme.find({ creator: this.username });
                const memeIds = memes.map(meme => meme.publicId);
                return await Comment.countDocuments({ memePublicId: { $in: memeIds } });
            },
            async getMemesCount() {
                return await Meme.countDocuments({ creator: this.username });
            }
        }
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
        //likes: {type: Number, default: 0 }
    }, 
    {
        id: false,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
        methods: {
            async getLikesCount() {
                return await Like.countDocuments({ memePublicId: this.publicId });
            },
            async getCommentsCount() {
                return await Comment.countDocuments({ memePublicId: this.publicId });
            }
        },
        statics: {
            async generatePublicId(publicIdSet) {
                return await generatePublicId(Meme, "m", publicIdSet);
            }
        }
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
    }, 
    {
        id: false,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
        statics: {
            async generatePublicId(publicIdSet) {
                return await generatePublicId(Template, "t", publicIdSet);
            }
        }
    })
);

Template.schema.virtual('url').get(function() {
    return `${url}${this.publicId}`;
});

const Comment = mongoose.model('Comment', new mongoose.Schema({
    content: { type: String, required: true },
    username: { type: String, required: true },
    memePublicId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    publicId: { type: String, required: true, unique: true },
    }, {
        statics: {
            async generatePublicId(publicIdSet) {
                return await generatePublicId(Comment, "c", publicIdSet);
            }
        }
    })
);

const Like = mongoose.model('Like', new mongoose.Schema({
    username: { type: String, required: true },
    memePublicId: { type: String, required: true } // Uses the publicId, because that requires less operations in this case
    })
);

const uniqueId = () => {
    return Date.now() + '' + Math.floor(Math.random() * 100000);
}

const generatePublicId = async (model, identifier="", publicIdSet) => {

    let publicId = identifier + uniqueId();
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
    Like,
    Comment
}