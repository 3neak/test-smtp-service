const nodemailer = require("nodemailer")
const startServer = require("./server");

const createConnection = () => {
    try {
        return nodemailer.createTransport({
            host: process.env.SMTP_IP,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
            connectionTimeout: 5000,
            greetingTimeout: 5000,
            debug: true
        })
    } catch (error) {
        console.log(`Error creating transporter : ${error}`)
        return error
    }
}

const sendEmail = async (transporter, to, subject, html) => {
    try {
        let info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            html
        })

        console.log("Message sent: %s", info.messageId);
        return info
    } catch (error) {
        console.log(`Error on sending email: ${error}`)
        return error
    }
}

const sendTestEmail = async (...params) => {
    let response = {}

    const result = await startServer(true, ...params)
    response.startingServer = {
        message: `Server started on ${params[0]}:${params[1]}`,
        data: result
    }

    const transporter = await createConnection()
    response.creatingTransport = {
        message: `Transporter started on ${process.env.SMTP_IP}:${process.env.SMTP_PORT}`,
        data: transporter
    }

    const email = await sendEmail(transporter, 'test@gmail.com', 'test', 'test')
    response.creatingTransport = {
        message: `Email sended ${process.env.SMTP_IP}:${process.env.SMTP_PORT}`,
        data: email
    }

    return response
}

module.exports = {
    sendEmail,
    createConnection,
    sendTestEmail

}