const WeebCommand = require('@base/WeebCommand.js');
const { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class vs extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'vs',
      description: `Gives Veg support role`,
      usage: `${client.config.prefix}vs @role/id`,
      permLevel: 'Veg Coordinator',
      aliases: ['support'],
    });
  }

  async run(message, args) {
    try {
      const member = await this.getGuildMember(message, args);

      return this.isInvalidTarget(member)
        ? this.errorFeedback(
            message,
            'That user does not exist!',
          )
          .then(() => message.react('❌'))
        : this.isIllegalTarget(member, message)
        ? this.errorFeedback(
            message,
            'This user does not have the Vegan role!',
          )
        : this.hasVegSupportRole(member)
        ? this.takeUserSupportRole(member)
          .then(() => this.roleRemoveFeedback(
            message,
            `${member} has had their Veg Support role removed!`
          )
          )
        : this.giveUserSupportRole(member)
          .then(() => this.roleAddFeedback(
            message,
            `${member} has been given the Veg Support role!`
          )
          )
    } catch (error) {
      return defaultError(error, message, this.client);
    }
  }

  giveUserSupportRole(member) {
    return member.roles.add(IDs.role.vegSupport);
  }
  
  takeUserSupportRole(member) {
    return member.roles.remove(IDs.role.vegSupport);
  }

  errorFeedback(message, feedbackString) {
    return message.reply(feedbackString).then(() => message.react('❌'));
  }

  roleRemoveFeedback(message, feedbackString) {
    return message.reply(feedbackString).then(() => message.react('✅'));
  }
  
  roleAddFeedback(message, feedbackString) {
    return message.reply(feedbackString).then(() => message.react('✅'));
  }

  isInvalidTarget(member) {
    return !member;
  }

  hasVegSupportRole(member) {
    return member?.roles.cache.has(IDs.role.vegSupport);
  }

  async getGuildMember(message, args) {
    return (
      (await getUserFromMention(message, args[0])) ??
      message.guild.members.cache.get(args[0])
    );
  }

  isIllegalTarget(member, message) {
    return !member.roles.cache.has(IDs.role.vegan);
  }
};
