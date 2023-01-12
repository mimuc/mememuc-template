const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
        userId: { type: String, required: true, unique: true },
        displayName: { type: String, required: true },
        password: { type: String, required: true }
    })
);

module.exports = {
    User
}