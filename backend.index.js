const PORT = 8000;
const express = require('express');
const fs = require('fs');
const date = new Date();
const cors = require('cors');
// require('dotenv').config();
// const axios = require('axios');

const app = express();
app.use(express.urlencoded());
app.use(cors());

const padzero = (num , size) => {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
};
const formatHour = () => {
    let hours = date.getHours();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return {
        hours: hours,
        ampm: ampm,
    };
};

const reader = (filename, callback) => {
    fs.readFile(filename, (err, data) => {
        if (err) {
            return callback && callback(err);
        } else {
            try {
                const response = JSON.parse(data);
                return callback(null, response);
            } catch (e) {
                return callback && callback(e);
            }
        }
    });
};
const writer = (filename, filedata, callback) => {
    const jsonString = JSON.stringify(filedata);
    fs.writeFile(filename, jsonString, (err) => {
        if (err) {
            return callback && callback(err);
        }
        return callback(null, );
    });
};

app.post('/contact', function(req, res) {
    const query = req.body;
    const filename = "./configs/contact.json";

    if ( !query.name || query.name.length < 1 ) res.json({type: 'error', message: 'Please provide a name.'});
    if ( !query.email || query.email.length < 1 ) res.json({type: 'error', message: 'Please provide a email.'});
    if ( !query.message || query.message.length < 1 ) res.json({type: 'error', message: 'Please provide a short message.'});

    const message = {
        sender: query.name,
        email: query.email,
        message: query.message,
        post: {
            date: padzero(date.getDate(), 2),
            month: padzero(date.getMonth() + 1, 2),
            year: date.getFullYear(),
            hour: padzero(formatHour().hours, 2),
            minute: padzero(date.getMinutes(), 2),
            second: padzero(date.getSeconds(), 2),
            millisecond: padzero(date.getMilliseconds(), 3),
            ampm: formatHour().ampm,
        },
    };
    reader(filename, function(err, data) {
        if (err) {
            res.json({type: 'error', message: err});
        }
        data.push(message);
        writer(filename, data, function(err) {
            if (err) {
                res.json({type: 'error', message: err});
            }
            res.json({type: 'success', message: 'Message submitted successfully.'});
        });
    });
});

app.post('/startup', function(req, res) {
    const query = req.body;
    const filename = "./configs/startup.json";

    if ( !query.name || query.name.length < 1 ) res.json({type: 'error', message: 'Please provide a name.'});
    if ( !query.email || query.email.length < 1 ) res.json({type: 'error', message: 'Please provide a email.'});
    if ( !query.project || query.project.length < 1 ) res.json({type: 'error', message: 'Please provide a project type.'});
    if ( !query.interest || query.interest.length < 1 ) res.json({type: 'error', message: 'Please provide an interest.'});
    if ( !query.details || query.details.length < 1 ) res.json({type: 'error', message: 'Please provide a short summary.'});

    const message = {
        sender: query.name,
        email: query.email,
        project: query.project,
        interest: query.interest,
        details: query.details,
        post: {
            date: padzero(date.getDate(), 2),
            month: padzero(date.getMonth() + 1, 2),
            year: date.getFullYear(),
            hour: padzero(formatHour().hours, 2),
            minute: padzero(date.getMinutes(), 2),
            second: padzero(date.getSeconds(), 2),
            millisecond: padzero(date.getMilliseconds(), 3),
            ampm: formatHour().ampm,
        },
    };
    reader(filename, function(err, data) {
        if (err) {
            res.json({type: 'error', message: err});
        }
        data.push(message);
        writer(filename, data, function(err) {
            if (err) {
                res.json({type: 'error', message: err});
            }
            res.json({type: 'success', message: 'Startup details submitted successfully.'});
        });
    });
});

app.get('/', (req, res) => res.json("Nothing to see here."));
app.listen(PORT, () => console.log('listening on port ' + PORT));