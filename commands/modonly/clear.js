const WeebCommand = require('@base/WeebCommand.js');
const defaultError = require('@utils/defaultError');

module.exports = class clear extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'clear',
      description: `Deletes the last n messages in the channel\n
                        Available to Mods only `,
      usage: `${client.config.prefix}clear n`,
      aliases: [],
      permLevel: 'Community Mod',
    });
  }

  async run(message, args) {
    try {
      const amount = args[0];
      if (!amount)
        return message.reply(
          'You have not given an amount of messages which should be deleted!',
        ); // Checks if the `amount` parameter is given
      if (Number.isNaN(amount))
        return message.reply('The amount parameter isn`t a number!'); // Checks if the `amount` parameter is a number. If not, the command throws an error
      if (amount > 100)
        return message.reply(
          'You can`t delete more than 100 messages at once!',
        ); // Checks if the `amount` integer is bigger than 100
      if (amount < 1)
        return message.reply('You have to delete at least 1 message!');
      if (args.length >= 0) {
        try {
          await message.channel.messages
            .fetch(message.id)
            .then((fetchedMessage) => fetchedMessage.delete())
            .catch(console.error); // it fetched the message - good
        } catch (error) {
          return defaultError(error, message, this.client);
          // the message no longer exists and will be ignored
        }
        await message.channel.messages
          .fetch({ limit: amount })
          .then(async (messages) => {
            const sortedMessages = await messages.sort();
            if (sortedMessages.size < amount) {
              const { id } = sortedMessages.first(1)[0];
              const allMessages = [];
              sortedMessages
                .filter((msg) => msg.id !== id)
                .forEach((m) => {
                  allMessages.push(m);
                });
              await message.channel
                .bulkDelete(allMessages)
                .catch(console.error);
            } else {
              await message.channel
                .bulkDelete(sortedMessages)
                .catch(console.error);
            }
          });

        const deletionMessage = await message.channel.send(
          `deleting ${amount} messages`,
        );
        setTimeout(async () => {
          try {
            await message.channel.messages
              .fetch(deletionMessage.id)
              .then((sentMessage) => sentMessage.delete())
              .catch(console.error); // it fetched the message - good
          } catch (error) {
            // the message no longer exists and will be ignored
          }
        }, 3000);
      }
    } catch (error) {
      return defaultError(error, message, this.client);
    }
  }
};
