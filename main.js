#!/usr/bin/env node
const convert_telegram_to_whatsapp = require('./convert_telegram_to_whatsapp.js');
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
