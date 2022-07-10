const WeebCommand = require('@base/WeebCommand.js');
const { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class unrestavegan extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'unrestavegan',
      description: `Removes the vegan from their restricted channel, gives them the vegan role and cleans up the role and channels\n
                    Available only to Staff`,
      usage: `${client.config.prefix}unrestavegan @mention/id`,
      aliases: ['urv'],
      permLevel: 'Community Mod',
    });
  }

  async run(message, args) {
    try {
      let user = await getUserFromMention(message, args[0]);
      let id;
      if (!user && !args[0]) {
        message.react('❌');
        return;
      }
      if (!user && args[0]) {
        id = args[0];
      } else {
        id = user.user.id;
      }

      const roleName = `restricted ${id}`;
      const restrictedRole = await message.guild.roles.cache.find(
        (role) => role.name === roleName,
      );
      const channelName = `restricted-${id}`;
      const textChannel = await message.guild.channels.cache.find(
        (channel) => channel.name === channelName,
      );
      const voiceName = `restricted ${id}`;
      const voiceChannel = await message.guild.channels.cache.find(
        (channel) => channel.name === voiceName,
      );

      console.log(roleName);
      console.log(channelName);
      console.log(voiceName);

      user = message.guild.members.cache.get(id);
      if (!user) {
        if (
          voiceChannel &&
          voiceChannel.parentId === IDs.chat.restrictedCategory
        ) {
          await voiceChannel.delete();
        }
        if (
          textChannel &&
          textChannel.parentId === IDs.chat.restrictedCategory
        ) {
          await textChannel.delete();
        }
        if (restrictedRole) {
          await restrictedRole.delete();
        }
        return;
      }
      await user.roles.add(IDs.role.vegan);
      if (
        voiceChannel &&
        voiceChannel.parentId === IDs.chat.restrictedCategory
      ) {
        await voiceChannel.delete();
      }
      if (textChannel && textChannel.parentId === IDs.chat.restrictedCategory) {
        await textChannel.delete();
      }

      if (restrictedRole) {
        await restrictedRole.delete();
      }
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};
