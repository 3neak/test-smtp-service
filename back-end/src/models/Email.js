const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    params: {
        gender: String
    },
    isSend: {
        type: Boolean,
        default: false
    }
})

module.exports = model('Email', schema)