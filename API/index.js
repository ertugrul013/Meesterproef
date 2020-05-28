require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

var app = express();
var transport = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    auth: {
        user: process.env.user,
        pass: process.env.pass
    }
});
transport.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

const subjectText = ["Het linkje naar de verslagen", "this user downloaded ur paper"];
const textBody = ["34", "12"];

app.get('/', function (req, res) {
    res.status(200);
    res.send('hello world');
})

app.post('/api/downlaod', function (req, res) {
    console.log("sending email to user");
    SendEmail(
        req.query.email,
        subjectText[0] + req.query.name,
        textBody[0]);

    console.log("Sending email to admin");

    SendEmail(
        process.env.admin,
        subjectText[1] + req.query.email + req.query.name,
        textBody[1],
    );
    res.status(200);
    res.send("Succes");
})


app.listen(3000, function () {
    console.log("listing on port 3000");
})


function SendEmail(_to, _subject, _text) {
    const message = {
        from: 'e.yesil@sintlucasedu.nl', // Sender address
        to: _to,         // List of recipients
        subject: _subject, // Subject line
        text: _text// Plain text body
    };
    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });
}