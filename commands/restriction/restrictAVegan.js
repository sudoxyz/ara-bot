const WeebCommand = require('@base/WeebCommand.js');
const { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class restrictvegan extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'restrictvegan',
      description: `Restricts a vegan to a custom restricted channel`,
      usage: `${client.config.prefix}restrictvegan @mention/id`,
      aliases: ['rv'],
      permLevel: 'Community Mod',
    });
  }

  async run(message, args) {
    try {
      let user = await getUserFromMention(message, args[0]);
      if (args.slice(1).join(' ').length <= 0)
        return message
          .reply('You need to provide a reason for this restriction.')
          .then(() => message.react('❌'));
      if (!user && !args[0]) {
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

      if (user.roles.cache.has(IDs.role.vegan)) {
        const category = await message.guild.channels.cache.find(
          (channel) => channel.id === IDs.chat.restrictedCategory,
        );

        const roleName = `restricted ${name}`;
        const restrictedRole = await message.guild.roles.create({
          name: roleName,
          color: 'YELLOW',
        });

        const welcomeRules = await message.guild.channels.cache.find(
          (channel) => channel.id === IDs.chat.welcomeRules,
        );
        welcomeRules.permissionOverwrites.edit(restrictedRole.id, {
          VIEW_CHANNEL: false,
        });

        const explanation = await message.guild.channels.cache.find(
          (channel) => channel.id === IDs.chat.araExplanation,
        );
        explanation.permissionOverwrites.edit(restrictedRole.id, {
          VIEW_CHANNEL: false,
        });

        const verification = await message.guild.channels.cache.find(
          (channel) => channel.id === IDs.chat.verification,
        );
        verification.permissionOverwrites.edit(restrictedRole.id, {
          VIEW_CHANNEL: false,
        });

        const channelName = `restricted-${name}`;
        const textChannel = await message.guild.channels.create(channelName, {
          type: 'GUILD_TEXT',
          permissionOverwrites: [
            { id: restrictedRole.id, allow: ['VIEW_CHANNEL'] },
            { id: IDs.user.bot, allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'] },
            { id: message.guild.id, deny: ['VIEW_CHANNEL'] },
            {
              id: IDs.role.communityMod,
              allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
            },
          ],
        });
        const voiceName = `restricted ${name}`;
        const voiceChannel = await message.guild.channels.create(voiceName, {
          type: 'GUILD_VOICE',
          permissionOverwrites: [
            { id: restrictedRole.id, allow: ['VIEW_CHANNEL'] },
            { id: IDs.user.bot, allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'] },
            { id: message.guild.id, deny: ['VIEW_CHANNEL'] },
            {
              id: IDs.role.communityMod,
              allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'],
            },
          ],
        });

        textChannel.setParent(category.id, { lockPermissions: false });
        voiceChannel.setParent(category.id, { lockPermissions: false });

        await user.roles.remove(IDs.role.vegan).catch(console.error);
        await user.roles.remove(IDs.role.vegCurious).catch(console.error);
        await user.roles.remove(IDs.role.trusted).catch(console.error);
        await user.roles.remove(IDs.role.discussionAccess).catch(console.error);
        await user.roles.remove(IDs.role.activist).catch(console.error);
        await user.roles.remove(IDs.role.plus).catch(console.error);
        await user.roles.remove(IDs.role.venting).catch(console.error);
        await user.roles.remove(IDs.role.bookworm).catch(console.error);

        await user.roles.add(restrictedRole.id);
      } else {
        message.react('❌');
        return;
      }
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};
