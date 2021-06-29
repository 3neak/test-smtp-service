const Settings = require('../models/Settings')
const BaseController = require("./BaseController");
const startServer = require("../smtp/server");
const {sendTestEmail} = require("../smtp/Client");

class SettingsController extends BaseController {
    async get(request, response) {
        try {
            const data = await Settings.find({})

            super.responseSuccess(response, data)
        } catch (error) {
            super.responseError(response, error)
        }
    }

    async set(request, response) {
        try {
            const {id, server, port, auth, username, password} = request.body

            if (!super.validateRequestParams(server, port, auth)) {
                super.responseWarning(response, 'Some of required params are undefined !')
                return
            }

            let settings = await Settings.findById(id)

            if (settings !== null) {
                settings.server = server
                settings.port = port
                settings.auth = auth
                settings.username = username
                settings.password = password
            } else {
                settings = new Settings({
                    server,
                    port,
                    auth,
                    username,
                    password,
                })
            }

            const result = await settings.save()

            // await startServer()

            super.responseSuccess(response, result)
        } catch (error) {
            super.responseError(response, error)
        }
    }

    async checkSettings(request, response) {
        try {
            const {server, port, auth, username, password} = request.body

            const result = await sendTestEmail(server, port, auth, username, password)

            console.log(result)
            super.responseSuccess(response, result)
        } catch (error) {
            super.responseError(response, error)
        }
    }
}

module.exports = SettingsController