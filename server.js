const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../Frontend')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

console.log('Email User:', process.env.SMTP_USER);
console.log('Receiver Email:', process.env.RECEIVER_EMAIL);

app.post('/send', async (req, res) => {
    const { name, email, mobile, subject, message } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: email,
        to: process.env.RECEIVER_EMAIL,
        subject: subject,
        text: `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}\nMessage: ${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
