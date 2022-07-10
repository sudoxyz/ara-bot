const WeebCommand = require('@base/WeebCommand.js');
const defaultError = require('@utils/defaultError');

module.exports = class ban extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'unban',
      description: `unbans a user from the server\n
                        Aliases: none\n
                        Available to Community Mods and Staff`,
      usage: `${client.config.prefix}unban userId`,
      aliases: [],
      permLevel: 'Community Mod',
    });
  }

  async run(message, args) {
    return args[0]?.length !== 18
      ? message.react('❌')
      : message.guild.members
          .unban(args[0])
          .then(() => message.react('✅'))
          .catch((error) =>
            message
              .react('❌')
              .finally(() => defaultError(error, message, this.client)),
          );
  }
};
