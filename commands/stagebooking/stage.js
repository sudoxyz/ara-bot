const WeebCommand = require('@base/WeebCommand.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const defaultError = require('../../utils/defaultError');
const getChannelFromMention = require('../../utils/getChannel');
const getRoleFromMention = require('../../utils/getRole');
const { ARA } = require('../../utils/ara');

/**
 * Announces a stage to the ARA Activity Channel so Stage Hosts don't need ping permissions.
 */
module.exports = class stage extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'stage',
      description: `${client.config.prefix}stage`,
      usage: `${client.config.prefix}stage <title>`,
      permLevel: 'Stage Host',
      aliases: ['stage'],
    });
  }

  async run(message, args) {
    try {
      const title = args.slice(0, args.length).join(' '); // Stage Title name

      const debatePing = getRoleFromMention(message, ARA.roles.pings.debate); // Debate role to ping
      const stagePing = getRoleFromMention(message, ARA.roles.pings.stage); // Stage role to ping

      const announceChannel = getChannelFromMention(
        message,
        ARA.text.info.ARAactivity,
      ); // Announcement channel for ping

      const stageChannel = getChannelFromMention(
        message,
        ARA.voice.discussion.stage,
      );
      const stageLink = await stageChannel.createInvite(); // Generated link for stage channel

      return message
        .reply({
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId('yes')
                .setStyle('SUCCESS')
                .setLabel('✓'),
              new MessageButton()
                .setCustomId('no')
                .setStyle('DANGER')
                .setLabel('X'),
            ),
          ],
          content: 'Would You Like To Send This Announcement?',
          embeds: [
            {
              author: {
                name: message.author.tag,
                url: message.url,
                iconURL: message.author.displayAvatarURL(),
              },
              color: 'RANDOM',
              description: `> ${title} - Join us now in ${stageLink}!\n\n This will also ping __**everyone**__ with ${debatePing} and ${stagePing} roles so be careful please.`,
            },
          ],
        })
        .then((approvalMessage) =>
          approvalMessage.awaitMessageComponent({
            filter: (interaction) =>
              interaction.member.id === message.member.id,
          }),
        )
        .then((approvalInteraction) =>
          approvalInteraction.customId === 'yes'
            ? approvalInteraction.message
                .delete()
                .then(() =>
                  announceChannel.send(
                    `**${title}** - Join us now in ${stageLink}!\n\n${debatePing} ${stagePing}`,
                  ),
                )
            : approvalInteraction.message.delete(),
        )
        .then(() => message.react('✅'));
    } catch (error) {
      return defaultError(error, message, this.client);
    }
  }
};
