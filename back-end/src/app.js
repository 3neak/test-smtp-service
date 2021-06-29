const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const startServer = require('./smtp/server')
const pxl = require('./pxl')

const emailsRouter = require('./routes/emailsRouter')
const settingsRouter = require('./routes/settingsRouter')
const mailingsRouter = require('./routes/mailingsRouter')
// const templateRouter = require('./routes/templateRouter.js.txt')

const app = express()
const port = process.env.PORT || 3001
const uri = process.env.MONGODB_URI || null

app.use(express.json())
app.use('*', cors({
    origin: '*',
    optionsSuccessStatus: 200
}))
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*")
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.use('/api', emailsRouter)
app.use(settingsRouter)
app.use(mailingsRouter)
app.use(pxl.trackPxl)
// app.use(templateRouter)

const start = async () => {
    try {
        if (!uri) {
            throw new Error('No uri specified in env file for MongoDB')
        }

        await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
        console.log('Connected to the Mongo DB');

        app.listen(port, () => {
            console.log(`Server has been started on port: ${port} ...`)
        })
    } catch (error) {
        console.error(error)
    }
}

start()