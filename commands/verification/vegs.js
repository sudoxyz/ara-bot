const WeebCommand = require('@base/WeebCommand.js');
const { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

const CANNOT_SEND_MESSAGES_TO_THIS_USER = 50007; // https://discord.com/developers/docs/topics/opcodes-and-status-codes
const ephemerality = 300_000; // Time until a message sent in the help chat will be deleted

module.exports = class vegs extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'vegs',
      description: `Gives a user the veg support role`,
      usage: `${client.config.prefix}vegs @mention/id`,
      aliases: ['vegsupport'],
      permLevel: 'Vegan',
    });
  }

  async run(message, args) {
    try {
      if (!message.member.roles.cache.has('947905630939807785')) {
        return message.react('❌');
      }
      const member = await this.getGuildMember(message, args);
      if (member.roles.cache.has('802752882831130624')) {
        return member.roles
          .remove('802752882831130624')
          .then(() => message.react('✅'));
      }
      const vegSupportChat =
        message.guild.channels.cache.get('834176649921560606');
      const helpMessage = `Hi ${member}! You have been given the ${
        message.guild.roles.cache.get('802752882831130624').name
      } role by ${
        message.member
      }, which gives you access to ${vegSupportChat}.`;
      return this.isInvalidTarget(member)
        ? this.errorFeedback(
            message,
            'That user either does not exist, or already has the role.',
          )
        : this.giveVegSupportRole(member)
            .then(() =>
              this.attemptToSendInfoDM(member, helpMessage).catch(
                this.handleClosedDMs(vegSupportChat, helpMessage),
              ),
            )
            .then(() => message.react('✅'));
    } catch (error) {
      return defaultError(error, message, this.client);
    }
  }

  handleClosedDMs(helpMeChat, helpMessage) {
    return (error) =>
      error.code !== CANNOT_SEND_MESSAGES_TO_THIS_USER
        ? Promise.reject(error)
        : helpMeChat.send(helpMessage).then((sendMessage) =>
            setTimeout(() => {
              sendMessage.delete();
            }, ephemerality),
          );
  }

  giveVegSupportRole(member) {
    return member.roles.add('802752882831130624');
  }

  attemptToSendInfoDM(member, helpMessage) {
    return member.send(helpMessage);
  }

  errorFeedback(message, feedbackString) {
    return message.reply(feedbackString).then(() => message.react('❌'));
  }

  isInvalidTarget(member) {
    return !member || member?.roles.cache.has('802752882831130624');
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
