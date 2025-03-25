const fs = require('fs');

// Code for getting time stamp
Object.defineProperty(Date.prototype, 'YYYYMMDDHHMMSS', {
    value: function () {
        function pad2(n) {
            // always returns a string
            return (n < 10 ? '0' : '') + n;
        }

        return (
            this.getFullYear() +
            pad2(this.getMonth() + 1) +
            pad2(this.getDate()) +
            '-' +
            pad2(this.getHours()) +
            pad2(this.getMinutes()) +
            pad2(this.getSeconds())
        );
    }
});

const ymdt = new Date().YYYYMMDDHHMMSS();

// console.log(ymdt);

const users = {
    5210555339: 'Liza', // set unique ID number and name
    4656883065: 'Dereck'
};

const messages = JSON.parse(fs.readFileSync('./data/result.json').toString())[
    'messages'
];

let result = '';

for (let msg of messages) {
    const date = {};
    // const edited_date = {};
    // let edited = true;
    const from_id = msg['from_id'];
    const media_type = msg['media_type'];
    const duration = msg['duration_seconds'];
    const text = msg['text'];

    const date_parsed = msg['date'].split('T'); // "date": "2020-01-24T18:22:26"
    date.date = date_parsed[0];
    date.time = date_parsed[1];

    const date_parts = date.date.split('-'); // WhatsApp: [10/6/20, 11:45:04]; months and days no 0s, last two of year
    date.year = date_parts[0].slice(-2);
    date.month = date_parts[1].replace(/^0+/, '');
    date.day = date_parts[2].replace(/^0+/, '');

    // const edited_date_parsed = msg['edited'].split('T');
    // edited_date.date = edited_date_parsed[0];
    // edited_date.time = edited_date_parsed[1];

    // console.log(edited_date_parsed);
    // console.log(edited_date_parsed.length);

    // if(edited_date.date.substr(0, 4) == "1969") {
    //     edited = false;
    // }

    if (media_type == 'voice_message') {
        // result += `${date.date} ${date.time}, voice, ${duration}, ${users[from_id]}, NA, NA\n`;
        result += `[${date.month}/${date.day}/${date.year}, ${date.time}] ${users[from_id]}:\n`;
        continue;
    }

    if (text !== '' && typeof text == 'string') {
        // result += `${date.date} ${date.time}, text, NA, ${users[from_id]}, ${(edited ? `${edited_date.date} ${edited_date.time}` : "NA")}, ${text.replace(/\n/gi, "\\n")}\n`;
        result += `[${date.month}/${date.day}/${date.year}, ${date.time}] ${users[from_id]}: ${text.replace(/\n/gi, '\\n')}\n`;
    }
}

fs.writeFileSync(`./outputs/${ymdt}_output.txt`, result);

// [YYYY-MM-DD HH:MM:SS] SENDER: MESSAGE
// [2020-04-07 14:14:37] user:   This is a first message
