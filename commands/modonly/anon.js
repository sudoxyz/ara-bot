const WeebCommand = require('@base/WeebCommand');
const defaultError = require('@utils/defaultError');

module.exports = class anon extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "anon",
      description: `Sends message to another channel\n
                         You can use #channel-name or channelId\n
                         Available to Mods only`,
      usage: `${client.config.prefix}anon [channelId/#channel]`,
      aliases: [],
      permLevel: 'Community Mod'
    });
  } async run(message, args) {
    try {
      let id = null;
      if (args.length >= 1) {
        id = message.mentions.channels.first();
        if (!id) {
          id = args[0];
        } else {
          id = id.id;
        }
      }
      args.shift();
      let channel = message.client.channels.cache.get(id);
      if(channel){
        channel.send(args.join(" "), { allowedMentions: {parse: ['roles', 'users', 'everyone'] } });
        message.react("✅");
        return;
      }
      message.react("❌");
      return;
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};
