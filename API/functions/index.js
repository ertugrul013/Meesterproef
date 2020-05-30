require('dotenv').config();
const functions = require('firebase-functions');
const express = require('express');
const nodemailer = require('nodemailer');

var app = express();


const subjectText = ["Het linkje naar de verslagen", "this user downloaded ur paper"];
const textBody = ["34", "12"];

app.get('/', function (req, res) {
    res.status(200);
    res.send('hello world');
})

app.get('/api/download', function (req, res) {
    console.log("User visited /api/download with a get request");
    res.send("Wrong request try it with a post request ")
})

app.post('/api/downlaod', function (req, res) {
    if (req.query.invite_code == 1337) {
        res.json({ "result": "error" });
    }

    console.log("sending email to user");


    console.log("Sending email to admin");


    res.status(200);
    res.send("Success");
})


app.listen(3000, function () {
    console.log("listing on port 3000");
})


function SendEmail(_to, _subject, _text) {
    const message = {
        from: process.env.admin, // Sender address
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

exports.app = functions.https.onRequest(app);