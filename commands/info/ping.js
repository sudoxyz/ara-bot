const WeebCommand = require("@base/WeebCommand.js");
const defaultError = require('@utils/defaultError');
var { IDs } = require('@utils/ids.js');

module.exports = class ping extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'ping',
      description: 'This command spits a "pong!" back at you!',
      usage: `${client.config.prefix}ping`,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if(message.channel.id != IDs.chat.welcomeRules && message.channel.id !== IDs.chat.araExplanation){
        message.channel.send('Pong!');
      }
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};