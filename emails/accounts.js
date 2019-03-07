const sgMail = require('@sendgrid/mail')

const sgAPIkey = "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"

sgMail.setApiKey(sgAPIkey)

const msg = {
  to: 'raghav.kaushik611@gmail.com',
  from: 'raghav.kaushik611@gmail.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail.send(msg);