const WeebCommand = require('@base/WeebCommand.js');
const { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class privateCreate extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'privateCreate',
      description: `Creates a custom private channel`,
      usage: `${client.config.prefix}private @mention/id`,
      aliases: ['pc'],
      permLevel: 'Vegan',
    });
  }

  async run(message, args) {
    try {
      let userRun = message.member.roles.cache;
      let userRole;
      let userRoleID;
      if (userRun.has(IDs.role.communityMod)) {
        userRole = "cm";
        userRoleID = IDs.role.communityMod;
      } else if (userRun.has(IDs.role.modCoordinator)) {
        userRole = "mc";
        userRoleID = IDs.role.modCoordinator;
      } else if (userRun.has(IDs.role.verifierCoordinator)) {
        userRole = "vc";
        userRoleID = IDs.role.verifierCoordinator;
      } else if (userRun.has(IDs.role.diversityCoordinator)) {
        userRole = "dc";
        userRoleID = IDs.role.diversityCoordinator;
      } else if (userRun.has(IDs.role.vegCoordinator)) {
        userRole = "vegc";
        userRoleID = IDs.role.vegCoordinator;
      } else if (userRun.has(IDs.role.eventCoordinator)) {
        userRole = "ec";
        userRoleID = IDs.role.eventCoordinator;
      } else {
        message.react('❌');
        return;
      }

      let user = await getUserFromMention(message, args[0]);
      if (!user) {
        message.react('❌');
        return;
      }
      if (args[0] && !user) {
        user = message.guild.members.cache.get(args[0]);
        if (!user) {
          message.react('❌');
          return;
        }
      }
      const name = user.user.id;

      const roleName = `private-${userRole} ${user.id}`;

      let checkRole = user.roles.cache.some(
          (role) => role.name === roleName,
      );
      console.log(checkRole);
      if (checkRole) {
        message.reply("User already has a private channel.")
        message.react('❌');
        return;
      }
        const category = await message.guild.channels.cache.find(
          (channel) => channel.id === IDs.chat.privateCategory,
        );

        const privateRole = await message.guild.roles.create({
          name: roleName,
          color: 'YELLOW',
        });

        const channelName = `🍂┃private-${name}-${userRole}`;
        const textChannel = await message.guild.channels.create(channelName, {
          type: 'GUILD_TEXT',
          permissionOverwrites: [
            { id: privateRole.id, allow: ['VIEW_CHANNEL'] },
            { id: IDs.user.bot, allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'] },
            { id: message.guild.id, deny: ['VIEW_CHANNEL'] },
            {
              id: userRoleID,
              allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
            },
            {
              id: IDs.role.communityMod,
              allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
            },
          ],
        });

        const voiceName = `Private ${name} ${userRole}`;
        const voiceChannel = await message.guild.channels.create(voiceName, {
          type: 'GUILD_VOICE',
          permissionOverwrites: [
            { id: privateRole.id, allow: ['VIEW_CHANNEL'] },
            { id: IDs.user.bot, allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'] },
            { id: message.guild.id, deny: ['VIEW_CHANNEL'] },
            {
              id: userRoleID,
              allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'],
            },
            {
              id: IDs.role.communityMod,
              allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'],
            },
          ],
        });

        textChannel.setParent(category.id, { lockPermissions: false });
        voiceChannel.setParent(category.id, { lockPermissions: false });

        await user.roles.add(privateRole.id);

      message.react("✅");
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};
