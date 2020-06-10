require('dotenv').config();
const functions = require('firebase-functions');
const express = require('express');
const nodemailer = require('nodemailer');

var app = express();
var transport = nodemailer.createTransport({
    host: "smtp.live.com",
    port: 587,
    pool: true,
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


const subjectText = ["Het linkje naar de verslagen voor ", "this user downloaded ur paper"];

const textBody = ["Hierbij het linkje voor het verslag https://docs.google.com/document/d/1NCMDHVdh4mDi0YC5eoS3HKsIjBLaPI9NXGcgnhWjyfU/edit?usp=sharing",
    "Hierbij het linkje voor het verslag https://drive.google.com/drive/folders/1M7jBvBcheGdQj4b8BaY5a7c70ePjTwEu?usp=sharing",
    "this user downloaded ur files"];

const HTMLBody = ["<h1><p>Hierbij het linkje voor het verslag</p><a href=https://docs.google.com/document/d/1NCMDHVdh4mDi0YC5eoS3HKsIjBLaPI9NXGcgnhWjyfU/edit?usp=sharing>linkje</a></h1>"
    , "<h1><p>Hierbij het linkje voor het verslag</p><a href=https://drive.google.com/drive/folders/1M7jBvBcheGdQj4b8BaY5a7c70ePjTwEu?usp=sharing>linkje</a></h1>",
    "<h1><p> this user downloaded ur files</p></h1><P>"]

app.get('/', function (req, res) {
    res.status(200);
    res.send('hello world');
})

app.get('/api/download', function (req, res) {
    let isTeacher = false;
    if (req.query.invite_code != 1337 && req.query.invite_code != 39687) {
        res.json({ "result": "error" });
        return;
    } else {
        if (req.query.invite_code == 39687) {
            console.log("teacher accessed API");
            isTeacher = true;
        } else {
            console.log("user accessed API");
            isTeacher = false;
        }
    }

    if (isTeacher == false) {
        SendEmail(
            req.query.email,
            subjectText[0] + req.query.name,
            textBody[0]),
            HTMLBody[0]
        console.log("Email has been sent to user");
    } else {
        SendEmail(
            req.query.email,
            subjectText[0] + req.query.name,
            textBody[1]),
            HTMLBody[1]
        console.log("Email has been sent to teacher");
    }

    console.log("Sending email to admin");

    SendEmail(
        process.env.user,
        subjectText[1],
        textBody[2] + " " + req.query.email + " " + req.query.name + "is teacher: " + isTeacher,
        HTMLBody[2] + " " + req.query.email + " " + req.query.name + "is teacher: " + isTeacher + "</p>"

    );
    res.status(200);
    res.json({ "result": "success" });
})

// Add headers
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(3000, function () {
    console.log("listing on port 3000");
})


function SendEmail(_to, _subject, _text, _html) {
    const message = {
        from: process.env.user, // Sender address
        to: _to,         // List of recipients
        subject: _subject, // Subject line
        text: _text,// Plain text body,
        html: _html
    };
    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });
}

exports.app = functions.https.onRequest(app);