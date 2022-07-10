const WeebCommand = require('@base/WeebCommand.js');
const { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class privateDelete extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'privateDelete',
      description: `Removes the vegan from their restricted channel, gives them the vegan role and cleans up the role and channels\n
                    Available only to Staff`,
      usage: `${client.config.prefix}privateDelete @mention/id`,
      aliases: ['pd'],
      permLevel: 'Vegan',
    });
  }

  async run(message, args) {
    try {
      let userRun = message.member.roles.cache;
      let userRole;
      if (userRun.has(IDs.role.communityMod)) {
        userRole = "cm";
      } else if (userRun.has(IDs.role.modCoordinator)) {
        userRole = "mc";
      } else if (userRun.has(IDs.role.verifierCoordinator)) {
        userRole = "vc";
      } else if (userRun.has(IDs.role.diversityCoordinator)) {
        userRole = "dc";
      } else if (userRun.has(IDs.role.vegCoordinator)) {
        userRole = "vegc";
      } else if (userRun.has(IDs.role.eventCoordinator)) {
        userRole = "ec";
      } else {
        message.react('❌');
        return;
      }

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

      const roleName = `private-${userRole} ${id}`;
      const privateRole = await message.guild.roles.cache.find(
        (role) => role.name === roleName,
      );
      const channelName = `🍂┃private-${id}-${userRole}`;
      const textChannel = await message.guild.channels.cache.find(
        (channel) => channel.name === channelName,
      );
      const voiceName = `Private ${id} ${userRole}`;
      const voiceChannel = await message.guild.channels.cache.find(
          (channel) => channel.name === voiceName,
      );

      console.log(roleName);
      console.log(channelName);

      user = message.guild.members.cache.get(id);
      if (!user) {
        if (
            voiceChannel &&
            voiceChannel.parentId === IDs.chat.privateCategory
        ) {
          await voiceChannel.delete();
        }
        if (
          textChannel &&
          textChannel.parentId === IDs.chat.privateCategory
        ) {
          await textChannel.delete();
        }
        if (privateRole) {
          await privateRole.delete();
        }
        return;
      }

      if (
          voiceChannel &&
          voiceChannel.parentId === IDs.chat.privateCategory
      ) {
        await voiceChannel.delete();
      }
      if (textChannel && textChannel.parentId === IDs.chat.privateCategory) {
        await textChannel.delete();
      }

      if (privateRole) {
        await privateRole.delete();
      }

      message.react("✅");
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};
