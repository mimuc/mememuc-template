import mongoose from 'mongoose'

// define a mongoose schema for item
const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    user_first_name: { type: String },
    user_last_name: { type: String },
    profile_picture: { type: String },
    creation_date: { type: Date, default: Date.now },
    user_description: { type: String },
    last_login: { type: Date, default: Date.now },
})

// construct an item model, using the item schema
const User = mongoose.model('User', userSchema)

export default User
