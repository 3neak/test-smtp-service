const {Schema, model} = require('mongoose')

const schema = new Schema({
    template: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
    },
    totalEmails: {
        type: Number,
        default: 0
    },
    sendedEmails: {
        type: Number,
        default: 0
    },
    openedEmails: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true})

module.exports = model('Mailing', schema)