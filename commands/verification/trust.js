const WeebCommand = require('@base/WeebCommand.js');
const { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

const CANNOT_SEND_MESSAGES_TO_THIS_USER = 50007; // https://discord.com/developers/docs/topics/opcodes-and-status-codes
const ephemerality = 30_000; // Time until a message sent in the help chat will be deleted

module.exports = class trust extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'trust',
      description: `Gives a user the trusted role allowing them to post links and images\n
                    Available to Staff, Verifier, Mod and Veg Support`,
      usage: `${client.config.prefix}trust @mention/id`,
      aliases: ['t', 'trusted'],
      permLevel: 'Verifier',
    });
  }

  async run(message, args) {
    try {
      const member = await this.getGuildMember(message, args);
      const allChat = message.guild.channels.cache.get(IDs.chat.chat);
      const helpMessage = `Hi ${member}! You have been given the ${
        message.guild.roles.cache.get(IDs.role.trusted).name
      } role by ${
        message.member
      }, which gives you access to posting media and to use ${message.guild.channels.cache.get(
        IDs.chat.botCommands,
      )}.\n\nAll media posted must:\n✅ __**Be Safe For Work (SFW)**__\n✅ __**Follow all ARA**__ ${message.guild.channels.cache.get(
        IDs.chat.rulesAndConduct,
      )}\n✅ __**Follow all Discord Terms of Service**__\n✅ __**Not objectify animals. This includes any humor, casual media, or serious media. This involves harm to animals (such as slaughtered animals) or treating them as food, services or other goods**__ \n\nFailing to follow this requirement will result in moderator action and indefinite removal of trust.\n\n💚 ***Thank You For Participating In ARA*** 💚`;
      return this.isInvalidTarget(member)
        ? this.errorFeedback(
            message,
            'That user either does not exist, or already has the role.',
          )
        : this.isIllegalTarget(member, message)
        ? this.errorFeedback(
            message,
            'You do not have the authority to do that. Try having a Community Moderator or Staff run this.',
          )
        : this.giveUserTrusted(member)
            .then(() =>
              this.attemptToSendInfoDM(member, helpMessage).catch(
                this.handleClosedDMs(allChat, helpMessage),
              ),
            )
            .then(() => message.react('✅'));
    } catch (error) {
      return defaultError(error, message, this.client);
    }
  }

  handleClosedDMs(allChat, helpMessage) {
    return (error) =>
      error.code !== CANNOT_SEND_MESSAGES_TO_THIS_USER
        ? Promise.reject(error)
        : allChat.send(helpMessage).then((sendMessage) =>
            setTimeout(() => {
              sendMessage.delete();
            }, ephemerality),
          );
  }

  giveUserTrusted(member) {
    return member.roles.add(IDs.role.trusted);
  }

  attemptToSendInfoDM(member, helpMessage) {
    return member.send(helpMessage);
  }

  errorFeedback(message, feedbackString) {
    return message.reply(feedbackString).then(() => message.react('❌'));
  }

  isInvalidTarget(member) {
    return !member || member?.roles.cache.has(IDs.role.trusted);
  }

  async getGuildMember(message, args) {
    return (
      (await getUserFromMention(message, args[0])) ??
      message.guild.members.cache.get(args[0])
    );
  }

  notRunByTeam(message) {
    return !message.member.roles.cache.some((role) =>
      [
        IDs.role.communityMod,
        IDs.role.moderator,
        IDs.role.organizer,
        IDs.role.minimod,
      ].includes(role.id),
    );
  }

  isIllegalTarget(member, message) {
    return (
      member.roles.cache.some((role) =>
        [IDs.role.vegan, IDs.role.untrustworthy, IDs.role.sus].includes(
          role.id,
        ),
      ) && this.notRunByTeam(message)
    );
  }
};
