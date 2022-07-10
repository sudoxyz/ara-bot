const WeebCommand = require('@base/WeebCommand.js');
const { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

const CANNOT_SEND_MESSAGES_TO_THIS_USER = 50007; // https://discord.com/developers/docs/topics/opcodes-and-status-codes
const ephemerality = 300_000; // Time until a message sent in the help chat will be deleted

module.exports = class convinced extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'convinced',
      description: `Gives a user the convinced role`,
      usage: `${client.config.prefix}convinced @mention/id`,
      aliases: ['conv'],
      permLevel: 'Verifier',
    });
  }

  async run(message, args) {
    try {
      const member = await this.getGuildMember(message, args);
      const convincedChat = message.guild.channels.cache.get(
        IDs.chat.convincedChat,
      );
      const helpMessage = `Hi ${member}! You have been given the ${
        message.guild.roles.cache.get(IDs.role.convinced).name
      } role by ${
        message.member
      }, which gives you access to our ${convincedChat} channel for discussion.\n\nYou can ask any questions pertaining to veganism there, or have a space to have more social interactions with our vegan community. If you'd like to have any questions answered please feel free to tag the \`@${
        message.guild.roles.cache.get(IDs.role.vegSupport).name
      }\` role. Please keep in mind that with this role we would like you to be more serious and productive with your discussion. Try and keep questions and concerns to channels you now have access to. We highly recommend that you start to advocate for the animals with us in ${message.guild.channels.cache.get(
        IDs.chat.chat,
      )}, regardless of your current behavior in your own life.\n\nYou also have access to the following new chats:\n🍃 ${message.guild.channels.cache.get(
        IDs.chat.helpMeChat,
      )}\n🍃 ${message.guild.channels.cache.get(
        IDs.chat.introduceYourself,
      )}\n🍃 ${message.guild.channels.cache.get(
        IDs.chat.bestOfVerification,
      )}\n🍃 ${message.guild.channels.cache.get(
        IDs.chat.veganNews,
      )}\n\n💚 ***Thank You For Committing To Respecting The Rights Of All Animals*** 💚`;
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
        : this.giveUserConvincedRole(member)
            .then(() =>
              this.attemptToSendInfoDM(member, helpMessage).catch(
                this.handleClosedDMs(convincedChat, helpMessage),
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

  giveUserConvincedRole(member) {
    return member.roles.add(IDs.role.convinced);
  }

  attemptToSendInfoDM(member, helpMessage) {
    return member.send(helpMessage);
  }

  errorFeedback(message, feedbackString) {
    return message.reply(feedbackString).then(() => message.react('❌'));
  }

  isInvalidTarget(member) {
    return !member || member?.roles.cache.has(IDs.role.convinced);
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

  isIllegalTarget(member, message) {
    return member.roles.cache.has(IDs.role.vegan) && this.notRunByTeam(message);
  }
};
