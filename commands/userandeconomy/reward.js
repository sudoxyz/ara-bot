const WeebCommand = require('@base/WeebCommand.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');
const CommandError = require('../../utils/commandError');
const { IDs } = require('../../utils/ids');
const responsiveError = require('../../utils/responsiveError');

module.exports = class reward extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'reward',
      description: 'Modify the balance of a user.',
      usage: `${client.config.prefix}reward @mention [amount] [reason]`,
      aliases: ['tax'],
      permLevel: 'Staff',
      category: 'Economy',
    });
  }

  async run(message, args) {
    const amount = this.parseRewardAmount(message, args);

    return this.getGuildMember(message, args)
      .then((member) =>
        this.verifyTypes(member, args)
          ? this.improperUsageError()
          : this.verifyReason(args)
          ? this.insufficientReasonError()
          : this.updateBalance(member, amount),
      )
      .then((member) => this.logReward(message, amount, member, args))
      .catch((error) => this.handleRewardError(error, message));
  }

  parseRewardAmount(message, args) {
    return (
      (message.content.split(' ').at(0).includes('tax') ? -1 : 1) *
      parseInt(args[1], 10)
    );
  }

  async getGuildMember(message, args) {
    return (
      (await getUserFromMention(message, args[0])) ??
      message.guild.members.cache.get(args[0])
    );
  }

  verifyTypes(member, args) {
    return !member || Number.isNaN(args[1]);
  }

  improperUsageError() {
    return Promise.reject(new CommandError(`Usage: ${this.help.usage}`));
  }

  verifyReason(args) {
    return args.slice(2).join(' ').length < 1;
  }

  insufficientReasonError() {
    return Promise.reject(new CommandError('Please provide a reason.'));
  }

  updateBalance(member, amount) {
    return this.client.dbusers.addBalance(member.id, amount).then(() => member);
  }

  logReward(message, amount, member, args) {
    return Promise.all([
      this.sendSuccessResponse(message, amount, member),
      this.sendLogResponse(message, amount, member, args),
    ]);
  }

  async handleRewardError(error, message) {
    return error instanceof CommandError
      ? responsiveError(message, error)
      : defaultError(error, message, this.client);
  }

  sendSuccessResponse(message, amount, member) {
    return message.reply(this.generateResponseEmbed(amount, message, member));
  }

  generateResponseEmbed(amount, message, member) {
    return {
      embeds: [
        {
          author: {
            name: `ARA ${amount < 0 ? 'Tax' : 'Reward'}`,
            url: message.url,
            iconURL:
              amount < 0
                ? 'https://media.discordapp.net/attachments/894698271577108534/932360508651212820/money.png'
                : 'https://media.discordapp.net/attachments/894698271577108534/932078766749020170/216445.png',
          },
          color: amount < 0 ? 'RED' : 'GOLD',
          description: `${message.author} Has ${
            amount < 0 ? 'Taken' : 'Given'
          } **\`${amount < 0 ? -amount : amount} ARA\`** ${
            amount < 0 ? 'From' : 'To'
          } ${member}`,
        },
      ],
    };
  }

  sendLogResponse(message, amount, member, args) {
    return message.guild.channels.cache
      .get(IDs.chat.araRewardLogs)
      .send(this.generateLogEmbed(message, amount, member, args));
  }

  generateLogEmbed(message, amount, member, args) {
    return {
      embeds: [
        {
          author: {
            name: message.author.username,
            url: message.url,
            iconURL: message.author.displayAvatarURL(),
          },
          color: amount < 0 ? 'RED' : 'GOLD',
          description: `[Link To ${amount < 0 ? 'Tax' : 'Reward'}](${
            message.url
          })`,
          fields: [
            {
              name: amount < 0 ? 'Taxer' : 'Rewarder',
              value: message.member.toString(),
              inline: true,
            },
            {
              name: amount < 0 ? 'Taxed' : 'Rewarded',
              value: member.toString(),
              inline: true,
            },
            {
              name: 'Amount',
              value: `${amount}`,
            },
            {
              name: 'Reason',
              value: args.slice(2).join(' '),
            },
          ],
          thumbnail: {
            url:
              amount < 0
                ? 'https://media.discordapp.net/attachments/894698271577108534/932360508651212820/money.png'
                : 'https://media.discordapp.net/attachments/894698271577108534/932078766749020170/216445.png',
          },
          title: `ARA ${amount < 0 ? 'Tax' : 'Reward'}`,
          url: message.url,
        },
      ],
    };
  }
};
