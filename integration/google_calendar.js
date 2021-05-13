const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const CALENDAR_ID = 'htgd4gq623fqen4gk8l5eub924@group.calendar.google.com';
const KEYFILE = '../todo-sample-313513-89d3b5218269.json'; // path to JSON with private key been downloaded from Google
const SCOPE_CALENDAR = 'https://www.googleapis.com/auth/calendar'; // authorization scopes
const SCOPE_EVENTS = 'https://www.googleapis.com/auth/calendar.events';

async function readPrivateKey() {
    const content = fs.readFileSync(path.resolve(__dirname, KEYFILE));
    return JSON.parse(content.toString());
}

async function authenticate(key) {
    const jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        [SCOPE_CALENDAR, SCOPE_EVENTS]
    );
    await jwtClient.authorize();
    return jwtClient;
}

async function createEvent(auth, data) {
    const event = {
        'summary': data.title,
        'description': data.description,
        'start': {
            'dateTime': data.date,
        },
        'end': {
            'dateTime': data.date,
        }
    };

    let calendar = google.calendar('v3');
    await calendar.events.insert({
        auth: auth,
        calendarId: CALENDAR_ID,
        resource: event,
    });
}

async function insertEvent(data) {
    console.log('===================================================================================');
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
    console.log('===================================================================================');
    console.log(data);
    const key = await readPrivateKey();
    const auth = await authenticate(key);
    await createEvent(auth, data);
};

module.exports = { insertEvent };