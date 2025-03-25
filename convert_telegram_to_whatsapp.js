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

function generate_timestamp() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // +1 because months are 0-based
    const day = String(now.getDate()).padStart(2, '0');

    // Get time components
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}-${hours}${minutes}${seconds}`;
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

module.exports = {
    convert_telegram_to_whatsapp,
    generate_timestamp
}
