const WeebCommand = require('@base/WeebCommand.js');
const { MessageActionRow, MessageButton, Channel } = require('discord.js');
const defaultError = require('../../utils/defaultError');
const CommandError = require('../../utils/commandError');
const getUserFromMention = require('../../utils/getUser');
const getChannelFromMention = require('../../utils/getChannel');
const getRoleFromMention = require('../../utils/getRole');
const { ARA } = require('../../utils/ara');

module.exports = class debate extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'debate',
      description: `${client.config.prefix}debate`,
      usage: `${client.config.prefix}debate <start/finish/poll> <v/nv> <foruser> <againstuser> <prop>`,
      permLevel: 'Debate Host',
      aliases: ['debate'],
    });
  }

  async run(message, args) {
    try {
      const action = String(args[0]).toUpperCase();

      const debatePollChannel = getChannelFromMention(message, ARA.text.vegan.debatePolls);
      const debatePing = getRoleFromMention(message, ARA.roles.pings.debate);
      let prop;

      switch (action) {
        case "START":

          const forUser = getUserFromMention(message, args[2]);
          const againstUser = getUserFromMention(message, args[3]);
          prop = args.slice(4, args.length).join(' ');

          const audience = String(args[1]).toUpperCase();
          let stageChannel;
          let announceChannel;
          switch (audience) { 
            case "V":
              stageChannel = getChannelFromMention(message, ARA.voice.vegan.stage);
              announceChannel = getChannelFromMention(message, ARA.text.info.announcements);
              break;
            case "NV":
              stageChannel = getChannelFromMention(message, ARA.voice.discussion.stage);
              announceChannel = getChannelFromMention(message, ARA.text.info.ARAactivity);
              break;
            default:
              return this.incorrectUsage(message);
          }
          
          const stageLink = await stageChannel.createInvite();
          if (!(forUser) || !(againstUser)) { // check if users are valid
            this.incorrectUsage(message);
            return;
          }
          message.reply({
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
            content: 'Would you like to start this debate?',
            embeds: [
              {
                author: {
                  name: message.author.tag,
                  url: message.url,
                  iconURL: message.author.displayAvatarURL(),
                },
                color: 'RANDOM',
                description: `**${prop}**\n\n This will also ping __**everyone**__ with ${debatePing} and role so be careful please.`,
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
                    this.startDebate(debatePollChannel, prop, announceChannel, debatePing, forUser, againstUser, stageLink),
                  )
              : approvalInteraction.message.delete(),
          )
          .then(() => message.react('✅'));
          break;
        case "END":
          this.endDebate(debatePollChannel);
          break;
        case "POLL":
          prop = args.slice(1, args.length).join(' ');
          this.poll(debatePollChannel, "Post-debate Poll", prop);
          break;
        default:
          return this.incorrectUsage(message);
      }
      this.success(message);
    } catch (error) {
      return defaultError(error, message, this.client);
    }
  }
  
  startDebate(debatePollChannel, prop, announceChannel, debatePing, forUser, againstUser, stageLink) {
    // Move debate poll channel to vegan section
    debatePollChannel.setParent(ARA.categories.vegan);

    // Add the vegan role to the channel
    debatePollChannel.permissionOverwrites.edit(ARA.roles.vegan.vegan, {
        VIEW_CHANNEL: true,
        READ_MESSAGE_HISTORY: true,
    });

    // Post Pre-debate poll
    this.poll(debatePollChannel, "Pre-debate Poll", prop);

    // Send announcement to relevant channel
    announceChannel.send(`:potted_plant:**Vegan Debate starts now!** ${debatePing}
    > :pushpin:**Proposition**: *${prop}*.
    ${forUser} is defending the proposition against ${againstUser}.\n
    ${stageLink}`,);
  }

  poll(channel, pollPrefix, prop) {
    channel.send(`:bar_chart:**${pollPrefix}** - ${prop}`,).then(sentMsg => {
      sentMsg.react("👍")
      sentMsg.react("👎")
    });
  }

  endDebate(channel) {
    // Remove vegan role from channel
    channel.permissionOverwrites.edit(ARA.roles.vegan.vegan, { 
      VIEW_CHANNEL: false,
      READ_MESSAGE_HISTORY: false,
    });
  
    // Move debate poll channel to vegan section
    channel.setParent(ARA.categories.archive);
  }

  success(message) {
    message.react("✅");
  }

  incorrectUsage(message) {
    message.reply(
      `Usage: ?debate start <v/nv> <@foruser> <@againstuser> <prop>
              ?debate poll <prop>
              ?debate end`,
    ).then(() => message.react("❌"));
  }
};