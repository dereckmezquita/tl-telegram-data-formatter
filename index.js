#!/usr/bin/env node
const fs = require('fs');

// Parse command-line arguments
function parseArgs() {
    const args = {};
    for (let i = 2; i < process.argv.length; i += 2) {
        const key = process.argv[i].replace('--', '');
        const value = process.argv[i + 1];
        args[key] = value;
    }
    return args;
}

const args = parseArgs();

// Validate required --input argument
if (!args.input) {
    console.error('Error: --input is required');
    console.log('Usage: node main.js --input <input.json> [--users <users.json>] [--output <output.txt>]');
    process.exit(1);
}

// Read Telegram JSON file
let input_data;
try {
    input_data = JSON.parse(fs.readFileSync(args.input, 'utf8'));
} catch (error) {
    console.error('Error reading input file:', error.message);
    process.exit(1);
}

if (!input_data.messages) {
    console.error('Error: Input file does not contain "messages"');
    process.exit(1);
}

const messages = input_data.messages;

if (!messages || !Array.isArray(messages) || messages.length === 0) {
    console.error('Error: No messages found in input file\nData should have a property "messages" containing an array of telegram messages');
    process.exit(1);
}

// Read users map if provided
let users_map = {};
if (args.users) {
    try {
        users_map = JSON.parse(fs.readFileSync(args.users, 'utf8'));
    } catch (error) {
        console.error('Error reading users map:', error.message);
        process.exit(1);
    }
}

// Convert messages to WhatsApp format
const whatsapp_data = convert_telegram_to_whatsapp(messages, users_map);

// Handle output
if (args.output) {
    try {
        fs.writeFileSync(args.output, whatsapp_data, 'utf8')
        console.log(`Output written to ${args.output}`);
    } catch (error) {
        console.error('Error writing output:', error.message);
        process.exit(1);
    }
} else {
    console.log(whatsapp_data);
}

function parse_tg_datetime(tg_dt) {
    const date = {};
    const date_parsed = tg_dt.split('T'); // "date": "2020-01-24T18:22:26"
    date.date = date_parsed[0];
    date.time = date_parsed[1];

    const date_parts = date.date.split('-'); // WhatsApp: [10/6/20, 11:45:04]; months and days no 0s, last two of year
    date.year = date_parts[0].slice(-2);
    date.month = date_parts[1].replace(/^0+/, '');
    date.day = date_parts[2].replace(/^0+/, '');

    return date;
}

function convert_telegram_to_whatsapp(messages, users_map) {
    let result = '';

    for (let msg of messages) {
        // const edited_date = {};
        // let edited = true;
        const from_id = msg['from_id'];
        let from_name = msg['from'];

        if (from_id in users_map) {
            from_name = users_map[from_id];
        }

        const media_type = msg['media_type'];
        const duration = msg['duration_seconds'];
        const text = msg['text'];

        const date = parse_tg_datetime(msg['date']);

        if (media_type == 'voice_message') {
            // result += `${date.date} ${date.time}, voice, ${duration}, ${users[from_id]}, NA, NA\n`;
            result += `[${date.month}/${date.day}/${date.year}, ${date.time}] ${users_map[from_id]}:\n`;
            continue;
        }

        if (text !== '' && typeof text == 'string') {
            // result += `${date.date} ${date.time}, text, NA, ${users_map[from_id]}, ${(edited ? `${edited_date.date} ${edited_date.time}` : "NA")}, ${text.replace(/\n/gi, "\\n")}\n`;
            result += `[${date.month}/${date.day}/${date.year}, ${date.time}] ${users_map[from_id]}: ${text.replace(/\n/gi, '\\n')}\n`;
        }
    }

    return result;
    // [YYYY-MM-DD HH:MM:SS] SENDER: MESSAGE
    // [2020-04-07 14:14:37] user:   This is a first message
}
