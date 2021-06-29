const Email = require('../models/Email')
const BaseController = require("./BaseController");

class EmailsController extends BaseController {
    async getEmails(request, response) {
        try {
            const result = await Email.find({})

            const data = result.map(({name, email, params}) => ({
                name,
                email,
                params,
            }))

            super.responseSuccess(response, data)
        } catch (error) {
            super.responseError(response, error)
        }
    }

    async setEmail(request, response) {
        try {
            const {name, email, params} = request.body

            if (!super.validateRequestParams(name, email, params)) {
                super.responseWarning(response, 'Some of required params are undefined !')
                return
            }

            let emailObj = await Email.findOne({email})

            if (emailObj !== null) {
                emailObj.name = name
                emailObj.params = params
            } else {
                emailObj = new Email({
                    name,
                    email,
                    params
                })
            }

            const data = await emailObj.save()

            super.responseSuccess(response, data)
        } catch (error) {
            super.responseError(response, error)
        }
    }
}

module.exports = EmailsController