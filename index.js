const fs = require('fs');

const users = {
    369157691: "user",
    219927383: "user",
    043579247: "user",
    979128412: "user",
    230527393: "user"
}

const messages = JSON.parse(fs.readFileSync('./data/input.json').toString())['messages'];

let result = "";

for(let msg of messages) {
    const date = {};
    const edited_date = {};
    let edited = true;
    const from_id = msg['from_id'];
    const media_type = msg['media_type'];
    const duration = msg['duration_seconds'];
    const text = msg['text'];

    const date_parsed = msg['date'].split('T'); // "date": "2020-01-24T18:22:26"
    date.date = date_parsed[0];
    date.time = date_parsed[1];

    const date_parts = date.date.split("-") // WhatsApp: [7/19/16, 01:32:35]; months and days no 0s
    date.year = date_parts[0]
    date.month = date_parts[1].replace(/^0+/, '')
    date.day = date_parts[2].replace(/^0+/, '')

    const edited_date_parsed = msg['edited'].split('T');
    edited_date.date = edited_date_parsed[0];
    edited_date.time = edited_date_parsed[1];

    if(edited_date.date.substr(0, 4) == "1969") {
        edited = false;
    }

    if(media_type == "voice_message") {
        // result += `${date.date} ${date.time}, voice, ${duration}, ${users[from_id]}, NA, NA\n`;
        result += `[${date.month}/${date.day}/${date.year}, ${date.time}] ${users[from_id]}:\n`;
        continue;
    }

    if(text !== "" && typeof(text) == "string") {
        // result += `${date.date} ${date.time}, text, NA, ${users[from_id]}, ${(edited ? `${edited_date.date} ${edited_date.time}` : "NA")}, ${text.replace(/\n/gi, "\\n")}\n`;
        result += `[${date.month}/${date.day}/${date.year}, ${date.time}] ${users[from_id]}: ${text.replace(/\n/gi, "\\n")}\n`;
    }
}

fs.writeFileSync('./output.csv', result);

// [YYYY-MM-DD HH:MM:SS] SENDER: MESSAGE
// [2020-04-07 14:14:37] user:   This is a first message

