const WeebCommand = require("@base/WeebCommand.js");
const defaultError = require('@utils/defaultError');

module.exports = class vmute extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "vmute",
      description: `Persists VC mute for a user.\n To Mute: ${client.config.prefix}vmute @user\n To Undo: ${client.config.prefix}vmute undo @user`,
      usage: `${client.config.prefix}vmute @mention`,
      aliases: [],
      permLevel: "Stage Host"
    });
  } async run(message, args) {
    try {

    if (args.length === 0) return message.reply("you haven't specified anyone to mute.");

    const mute = args[0] !== "undo";
    console.log(mute);
    if (args[0] === "all" || args[1] === "all") {
      const vc = await message.member.voice.channel;
      if (!vc) return message.reply("you are not in a voice channel.");
      vc.members.forEach(async (member) => member.id !== message.member.id && await member.voice.setMute(mute).catch(console.error));
    } else {
      message.mentions.members.forEach(async (member) => {
        await this.client.dbusers.updateMuted(member.id, mute).catch(console.error);
        await member.voice.setMute(mute).catch(console.error);
      });

    }
    message.react("✅");
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};