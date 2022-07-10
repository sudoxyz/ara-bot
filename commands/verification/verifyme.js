const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');

module.exports = class verifyme extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "verifyme",
      description: `Pings the verifier role`,
      usage: `${client.config.prefix}verifyme`,
      aliases: ["verifyme"],
      permLevel: "VerAsVeg"
    });
  } async run(message) {
    try {
      if(message.channel.id === IDs.chat.verification){
        let voiceChannel = await message.member.voice.channel;
        if (!voiceChannel) {   
            return message.reply('Please join a verification voice channel before using this command.');
        }
        message.channel.send("Please be patient while waiting for verification. The verifiers consists of people who volunteer their time for the server and might not be available at the moment. If the wait is too long, please try verifying later.\n<@&" + IDs.role.verifier + ">");
      }else{
        message.react("❌");
        return;
      }

    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};