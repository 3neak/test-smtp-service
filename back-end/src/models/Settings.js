const {Schema, model} = require('mongoose')

const schema = new Schema({
    server: {
        type: String,
        required: true,
    },
    port: {
        type: Number,
        required: true,
    },
    auth: {
        type: Boolean,
        required: true
    },
    username: String,
    password: String
}, {timestamps: true})

module.exports = model('Settings', schema)