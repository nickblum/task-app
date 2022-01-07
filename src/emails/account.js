const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = ''

//sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    // sgMail.send({
    //     to: email,
    //     from: 'nick.blum@protonmail.com',
    //     subject: `Welcome to our testing app!`,
    //     text: `I sent a test email, ${name}. I hope that I didn't get caught in a spam filter!`
    // })
    console.log('Sent account creation email:')
    console.log(email,name)
}

const sendCancelationEmail = (email, name) => {
    // sgMail.send({
    //     to: email,
    //     from: 'nick.blum@protonmail.com',
    //     subject: `You've been unsubscribed`,
    //     text: `I sent a test email, ${name}. I hope that I didn't get caught in a spam filter!`
    // })
    console.log('Sent cancellation email:')
    console.log(email,name)
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}