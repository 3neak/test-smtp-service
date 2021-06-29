const Mailing = require('../models/Mailing')
const PlaceholderController = require('./PlaceholderController')
const {sendEmail, createConnection} = require('../smtp/Client')
const Email = require('../models/Email')
const Placeholder = require('../models/Placeholder')
const PxlForEmails = require('pxl-for-emails')
const pxl = require('../pxl')
const BaseController = require("./BaseController");

class MailingsController extends BaseController {
    async listMailings(request, response) {
        try {
            const data = await Mailing.find({}).sort({updatedAt: 'desc'})

            const filteredData = data.map(
                ({
                     _id,
                     template,
                     subject,
                     totalEmails,
                     sendedEmails,
                     openedEmails,
                     status
                 }) => ({
                    id: _id,
                    template,
                    subject,
                    totalEmails,
                    sendedEmails,
                    openedEmails,
                    status
                }))

            super.responseSuccess(response, filteredData)
        } catch (error) {
            super.responseError(response, error)
        }
    }

    async addMailing(request, response) {
        try {
            const {
                template,
                subject,
            } = request.body

            if (!super.validateRequestParams(template, subject)) {
                super.responseWarning(response, 'Some of required params are undefined !')
                return
            }

            const mailing = new Mailing({
                template,
                subject,
            })

            const data = await mailing.save()

            super.responseSuccess(response, data)
        } catch (error) {
            super.responseError(response, error)
        }
    }

    async editMailing(request, response) {
        try {
            const {id, template, subject} = request.body
            const mailing = await Mailing.findById(id)

            if (!super.validateRequestParams(id, template, subject)) {
                super.responseWarning(response, 'Some of required params are undefined !')
                return
            }

            mailing.template = template
            mailing.subject = subject

            const data = await mailing.save()

            super.responseSuccess(response, data)
        } catch (error) {
            super.responseError(response, error)
        }
    }

    async removeMailing(request, response) {
        try {
            const {id} = request.params
            const result = await Mailing.findByIdAndRemove(id)

            super.responseSuccess(response, result)
        } catch (error) {
            super.responseSuccess(response, error)
        }
    }

    async changeMailingStatus(request, response) {
        try {
            const {id, status} = request.body

            if (!super.validateRequestParams(id, status)) {
                super.responseWarning(response, 'Some of required params are undefined !')
                return
            }

            const mailing = await Mailing.findById(id)
            mailing.status = status
            const data = await mailing.save()

            const emails = await Email.find({})
            const placeholders = await Placeholder.find({})

            const transporter = createConnection()

            if (status) {
                let mailingObj = await Mailing.findById(mailing._id)
                mailingObj.totalEmails = emails.length
                await mailingObj.save()

                for (const email of emails) {
                    MailingsController.emailDistribution(transporter, email, mailing, placeholders[0])
                }

                mailingObj.sendedEmails = emails.length + mailingObj.totalEmails // )
                await mailingObj.save()
            }

            super.responseSuccess(response, data)

        } catch (error) {
            super.responseError(response, error)
        }
    }

    async getMailingById(request, response) {
        try {
            const {id} = request.params

            let data = {}

            const placeholders = await PlaceholderController.getPlaceholders()

            if (placeholders.status !== 0) {
                super.responseError(response, 'Something went wrong !')
                return
            }

            if (parseInt(id) !== 0) {
                data = await Mailing.findById(id)
            }

            super.responseSuccess(response, {
                placeholders: placeholders.data,
                    data
            })

        } catch (error) {
            super.responseError(response, error)
        }
    }

    static async emailDistribution(transporter, email, mailing, placeholders) {
        try {
            if (!email.isSend) {
                let pxlForEmails = new PxlForEmails({
                    pxl,
                    getFullShortenedLink() {
                        return `http://localhost:3001/`
                    }
                })

                let textToReplace = mailing.subject

                for (const key in placeholders.placeholders) {
                    let value = placeholders.placeholders[key]

                    let regex = new RegExp(value, 'g')

                    if (key in email) {
                        textToReplace = textToReplace.replace(regex, email[key])
                    } else if (key in email?.params) {
                        textToReplace = textToReplace.replace(regex, email?.params[key])
                    }
                }


                textToReplace = await pxlForEmails.addTracking(textToReplace, { recipient: email.email })
                await sendEmail(transporter, email.email, mailing.template, textToReplace)

                let emailObj = await Email.findById(email._id)
                emailObj.isSend = true
                await emailObj.save()
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = MailingsController