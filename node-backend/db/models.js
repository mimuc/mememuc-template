const mongoose = require('mongoose');
const URL = `http://${process.env.BE_DOMAIN}/resources/images/`;
const URL_FRONTEND = `http://${process.env.FE_DOMAIN}/`;

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
            async getDislikesCount() {
                return await Dislike.countDocuments({ username: this.username });
            },
            async getLikesReceivedCount() {
                const memes = await Meme.find({ creator: this.username });
                const memeIds = memes.map(meme => meme.publicId);
                return await Like.countDocuments({ memePublicId: { $in: memeIds } });
            },
            async getDislikesReceivedCount() {
                const memes = await Meme.find({ creator: this.username });
                const memeIds = memes.map(meme => meme.publicId);
                return await Dislike.countDocuments({ memePublicId: { $in: memeIds } });
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
        image: { type: Buffer, required: true, default: 'image/png' },
        publicId: { type: String, required: true, unique: true },
        contentType: { type: String, default: 'image/png', enum: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] },
        createdAt: { type: Date, default: Date.now },
        usedTemplate: { type: String }
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
            async getDislikesCount() {
                return await Dislike.countDocuments({ memePublicId: this.publicId });
            },
            async getCommentsCount() {
                return await Comment.countDocuments({ memePublicId: this.publicId });
            },
            async getImageUrl() {
                return `${URL}${this.publicId}`;
            },
            async getSingleViewUrl() {
                return `${URL_FRONTEND}memes/${this.publicId}`;
            },
            async getViewCount() {
                return await View.countDocuments({ memePublicId: this.publicId });
            },
            async getVote(username) {
                if(username == undefined) return 0;

                const like = await Like.findOne({ username, memePublicId: this.publicId });
                if(like) return 1;
                
                const dislike = await Dislike.findOne({ username, memePublicId: this.publicId });
                if(dislike) return -1;

                return 0;
            },
            async getCreatorDisplayName() {
                const user = await User.findOne({ username: this.creator });
                if(user) return user.displayName;
                else return "Unknown";
            }
        },
        statics: {
            async generatePublicId(publicIdSet) {
                return await generatePublicId(Meme, "m", publicIdSet);
            }
        }
    })
);

const ImageResource = mongoose.model('ImageResource', new mongoose.Schema({
        creator: { type: String },
        visibility: { type: String, enum: ['private', 'unlisted', 'public'], default: 'public' },
        image: { type: Buffer, required: true, default: 'image/png' },
        publicId: { type: String, required: true, unique: true },
        contentType: {
            type: String, 
            default: 'image/png',
            enum: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        }
    },
    {
        id: false,
        methods: {
            async getImageUrl() {
                return `${URL}${this.publicId}`;
            }
        },
        statics: {
            async generatePublicId(publicIdSet) {
                return await generatePublicId(ImageResource, "i", publicIdSet);
            }
        }
    })
);

const Template = mongoose.model('Template', new mongoose.Schema({
        name: { type: String, required: true, unique: true  },
        creator: { type: String },
        visibility: { type: String, enum: ['private', 'unlisted', 'public'], default: 'public' },
        images: [
            { 
                url: {
                    type: String,
                    required: true
                }, 
                x: {
                    type: Number,
                    default: 0
                },
                y: {
                    type: Number,
                    default: 0
                },
                contentType: {
                    type: String, 
                    default: 'image/png',
                    enum: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
                }
            }
        ],
        canvas: {
            width: {
                type: Number,
                default: 700
            },
            height: {
                type: Number,
                default: 700
            }
        },
        publicId: { type: String, required: true, unique: true },
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

const TemplateUsage = mongoose.model('TemplateUsage', new mongoose.Schema({
    template: { type: String, required: true },
    memePublicId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    })
);

const Comment = mongoose.model('Comment', new mongoose.Schema({
    content: { type: String, required: true },
    username: { type: String, required: true },
    memePublicId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    publicId: { type: String, required: true, unique: true },
    }, {
        methods: {
            async getCreatorDisplayName() {
                const user = await User.findOne({ username: this.username });
                if(user) return user.displayName;
                else return "Unknown";
            }
        },
        statics: {
            async generatePublicId(publicIdSet) {
                return await generatePublicId(Comment, "c", publicIdSet);
            }
        }
    })
);

const Like = mongoose.model('Like', new mongoose.Schema({
    username: { type: String, required: true },
    memePublicId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    })
);

const Dislike = mongoose.model('Dislike', new mongoose.Schema({
    username: { type: String, required: true },
    memePublicId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    })
);

const View = mongoose.model('View', new mongoose.Schema({
    username: { type: String, required: true },
    memePublicId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
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
    Dislike,
    Comment,
    View,
    ImageResource,
    TemplateUsage
}