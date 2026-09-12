const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'assistance.fiqrtaalim@gmail.com',
    pass: 'uovb axfr hieh vahz'.replace(/\s+/g, '')
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Failed:', error);
    process.exit(1);
  } else {
    console.log('SMTP Server is ready to send messages! Authentication Successful.');
  }
});
