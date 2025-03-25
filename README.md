# telegram-data-formatter

This is a nodeJS application for converting exported Telegram JSON chat to a WhatsApp.txt/csv style outputs.

This project provides a simple command line tool to convert Telegram chat messages exported in JSON format into a WhatsApp like text format.

## What It Does

The script reads a Telegram JSON export file containing a `messages` array, optionally uses a user mapping file to replace user IDs with names, and converts the messages into a WhatsApp style text output.

## Usage

To use the tool, run it from the command line with Node.js. Here’s the basic syntax:

```bash
node index.js --input './data/result.json' --output './whatsapp.txt' --users './users.json'
```

- **`--input`** (Required): Path to the Telegram JSON export file containing your chat messages.
- **`--users`** (Optional): Path to a JSON file mapping Telegram user IDs to names. If not provided, the script uses the `from` field from the Telegram JSON.
- **`--output`** (Optional): Path to save the converted output as a text file. If omitted, the result is printed to the console.

Users should look like:

```json
{
    "5210555339": "Liza",
    "4656883065": "Dereck"
}
```

## Input and Output Examples

### Telegram JSON Input

The Telegram JSON file should contain a `messages` array. Below is an example with fake, anonymized messages:

```json
{
  "name": "General Discussion",
  "type": "group_chat",
  "id": 987654321,
  "messages": [
    {
      "id": 1001,
      "type": "message",
      "date": "2023-06-01T10:00:00",
      "from": "Alice",
      "from_id": 1000001,
      "text": "Hi everyone!"
    },
    {
      "id": 1002,
      "type": "message",
      "date": "2023-06-01T10:01:00",
      "from": "Bob",
      "from_id": 1000002,
      "text": "Hello Alice!"
    },
    {
      "id": 1003,
      "type": "message",
      "date": "2023-06-01T10:02:00",
      "from": "Charlie",
      "from_id": 1000003,
      "text": "Good morning!"
    },
    {
      "id": 1004,
      "type": "message",
      "date": "2023-06-01T10:03:00",
      "from": "Alice",
      "from_id": 1000001,
      "text": "How is everyone doing today?"
    }
  ]
}
```

### WhatsApp Output

After running the script, the output will look like this:

```txt
[6/1/23, 10:00:00] Alice: Hi everyone!
[6/1/23, 10:01:00] Bob: Hello Alice!
[6/1/23, 10:02:00] Charlie: Good morning!
[6/1/23, 10:03:00] Alice: How is everyone doing today?
```

The format follows WhatsApp’s style: `[MM/DD/YY, HH:MM:SS] Sender: Message`. Dates are simplified (e.g., no leading zeros for months or days), and newlines in messages are escaped as `\n`. In this example, the script uses the `"from"` field for sender names since no optional `users_map` is provided. All data is fictional and contains no personal or sensitive information.

## No Dependencies

This tool is lightweight and has **no external dependencies** beyond Node.js. As long as you have Node.js installed (version 12 or higher recommended), you can run it on any system without additional setup.

## How It Works

The script operates in a straightforward way:

1. **Argument Parsing**: It reads command-line arguments to determine the input file, optional users map, and output destination.
2. **File Reading**: It loads and validates the Telegram JSON file, ensuring it contains a `messages` array.
3. **User Mapping**: If a users map is provided, it replaces user IDs with corresponding names; otherwise, it uses the `from` field.
4. **Conversion**: Each message’s timestamp is parsed into WhatsApp’s format (e.g., `[MM/DD/YY, HH:MM:SS]`), and text content is appended with the sender’s name.
5. **Output**: The result is either written to a file or printed to the console.

The script currently focuses on text messages and skips unsupported types (e.g., stickers, media) without crashing, making it robust for basic use.

## Contributions

Contributions are welcome! If you’d like to add features (e.g., support for media messages), fix bugs, or improve the script, please open an issue or submit a pull request on the project’s repository.
