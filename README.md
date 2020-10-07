# telegram-data-formatter

This is a nodeJS application for converting exported Telegram JSON chat to a WhatsApp.txt or .csv style outputs.

## Usage

* Download and run `npm install --y`

* Set your data in the data folder, change variable names. Make sure it's a clean conversation no extra information.

* Set the user IDs and names.

* Run with `node .`

Outputs to the following format:

```{javascript}
// [YYYY-MM-DD HH:MM:SS] SENDER: MESSAGE
// [2020-04-07 14:14:37] user:   This is a first message
```
