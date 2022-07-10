const WeebCommand = require('@base/WeebCommand.js');
const { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

const CANNOT_SEND_MESSAGES_TO_THIS_USER = 50007; // https://discord.com/developers/docs/topics/opcodes-and-status-codes
const ephemerality = 300_000; // Time until a message sent in the help chat will be deleted

module.exports = class trialmod extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'trialmod',
      description: `Gives a user the trialmod role`,
      usage: `${client.config.prefix}trialmod @mention/id`,
      aliases: ['tm'],
      permLevel: 'Vegan',
    });
  }

  async run(message, args) {
    try {
      if (!message.member.roles.cache.has('974144947613728818')) {
        return message.react('❌');
      }
      const member = await this.getGuildMember(message, args);
      if (member.roles.cache.has('982074555596152904')) {
        return member.roles
          .remove('982074555596152904')
          .then(() => message.react('✅'));
      }
      const b12chat =
        message.guild.channels.cache.get('880864978851221524');
      const helpMessage = `Hi ${member}! You have been given the ${
        message.guild.roles.cache.get('982074555596152904').name
      } role by ${
        message.member
      }, which gives you access to ${b12chat}.`;
      return this.isInvalidTarget(member)
        ? this.errorFeedback(
            message,
            'That user either does not exist, or already has the role.',
          )
        : this.giveModRole(member)
            .then(() =>
              this.attemptToSendInfoDM(member, helpMessage).catch(
                this.handleClosedDMs(b12chat, helpMessage),
              ),
            )
            .then(() => message.react('✅'));
    } catch (error) {
      return defaultError(error, message, this.client);
    }
  }

  handleClosedDMs(b12chat, helpMessage) {
    return (error) =>
      error.code !== CANNOT_SEND_MESSAGES_TO_THIS_USER
        ? Promise.reject(error)
        : b12chat.send(helpMessage).then((sendMessage) =>
            setTimeout(() => {
              sendMessage.delete();
            }, ephemerality),
          );
  }

  giveModRole(member) {
    return member.roles.add('982074555596152904');
  }

  attemptToSendInfoDM(member, helpMessage) {
    return member.send(helpMessage);
  }

  errorFeedback(message, feedbackString) {
    return message.reply(feedbackString).then(() => message.react('❌'));
  }

  isInvalidTarget(member) {
    return !member || member?.roles.cache.has('982074555596152904');
  }

  async getGuildMember(message, args) {
    return (
      (await getUserFromMention(message, args[0])) ??
      message.guild.members.cache.get(args[0])
    );
  }

  notRunByTeam(message) {
    return !message.member.roles.cache.some((role) =>
      [IDs.role.communityMod, IDs.role.moderator, IDs.role.organizer].includes(
        role.id,
      ),
    );
  }
};
