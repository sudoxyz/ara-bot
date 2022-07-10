const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let periodicMessages;

module.exports = {
    name: 'messageCreate', once: false, async execute(message) {
        // check if messages have been fetched, if not: download them and then handle the message
        if (!periodicMessages) {
            await fetchPeriodicMessagesFromGoogleSheetsNodeFetch(() => {
                this.execute(message)
            })
            return;
        }

        // check if current message is in a relevant channel
        if (Object.hasOwn(periodicMessages, message.channelId)) {
            periodicMessages[message.channelId].forEach(periodicMessage => {
                // will fix mutating by reference, once I understand how to properly do it (Object.assign) for now
                if (periodicMessage.counter++ >= periodicMessage.repeatsEveryXMessages) {
                    message.channel.send(periodicMessage.message)
                    periodicMessage.counter = 0;
                }
            })
        }
    },
};

async function fetchPeriodicMessagesFromGoogleSheetsNodeFetch(callback) {
    console.log("Fetching periodic messages from google sheets...")
    periodicMessages = {};
    // using opensheet.elk.sh until I can be bothered to use the actual Google Sheets v4 with an oauth token
    await fetch('https://opensheet.elk.sh/1_awZSFqUXHuNJwVFSXYC4wecjSj5NlKgQmyoKumx77o/1')
        .then(res => res.json())
        .then(json => json.forEach(row => { // input isn't sanitized, so I'm looking forward to dantas hacking the bot <3
            let periodicMessage = periodicMessages[row["Active in channel (id)"]];
            periodicMessage = (!periodicMessage) ? [] : periodicMessage;

            periodicMessage.push({
                repeatsEveryXMessages: row["repeats every x messages"], message: row["message"], counter: 0
            });

            periodicMessages[row["Active in channel (id)"]] = periodicMessage;
        }))
        .then(() => {
            callback();
            console.log(periodicMessages)
            console.log("Done fetching & parsing!");
        });
}
