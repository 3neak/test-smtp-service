const SMTPServer = require("smtp-server").SMTPServer
const Settings = require('../models/Settings')

const startServer = async (isTest = false, ...params) => {
    try {
        const settings = await Settings.find({})

        if (typeof settings[0] !== 'undefined') {
            let {server, port, auth, username, password} = settings[0]

            if (isTest) {
                server = params[0]
                port = params[1]
                auth = params[2]
                username = params[3]
                password = params[4]
            }

            const options = {
                onAuth: (authorize, session, callback) => {
                    if (auth) {
                        if (authorize.username !== username && authorize.password !== password) {
                            return callback(new Error(`Invalid username or password (Username: ${authorize.username} | Password: ${authorize.password})`))
                        }
                    }

                    callback(null, { user : 'user' });
                },
                onData: (stream, session, callback) => {
                    console.log('received');
                    // stream.pipe(process.stdout)
                },
            }

            const smtpServer = new SMTPServer(options)

            await smtpServer.listen(port, server)
            return true
            console.log(`SMTP server started on ${server}:${port}`)
        }
    } catch (error) {
        throw new Error(`SMTP server error: ${error}`)
        return error
    }
}

module.exports = startServer