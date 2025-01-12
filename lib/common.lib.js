const nodemailer = require("nodemailer")
const config = require("config")
const twilio = require("twilio")

const accountSid = config.get("twilio.sid")
const authToken = config.get("twilio.token")
const client = twilio(accountSid, authToken)

let admin = require("firebase-admin");
let serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function sendEmail({to, subject, text}) {
    // initialize nodemailer
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: config.get("email.emailUser"), // Your email
            pass: config.get("email.emailPass"), // Your email password
        },
    })

    // send email
    await transporter.sendMail({
        from: config.get("email.emailUser"),
        to,
        subject,
        text,
    })
}

async function sendSms({ to, message }) {
    // response has status but currently we only depend on if twilio api send 200 then we take as success other wise as failed
    let response = await client.messages.create({
        body: message,
        from: config.get("twilio.from"),
        to: to,
    })

    return response
}

async function sendPush({ devicePushToken, message }) {
    let response = await admin.messaging.send({
        token : devicePushToken,
        notification : {
            title : "testing-notification",
            body : message
        }
    })

    return response
}

module.exports = {
    sendEmail,
    sendSms,
    sendPush
}
