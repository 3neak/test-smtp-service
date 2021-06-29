const {Schema, model} = require('mongoose')

const schema = new Schema({
    placeholders: {
        type: Object,
        required: true
    },
}, {timestamps: true})

module.exports = model('Placeholder', schema)