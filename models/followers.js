const mongoose = require('mongoose')


// Followers Data Schema
const followersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    followed: {
        type: Boolean,
        required: true
    },
    followedDate: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Followers', followersSchema)