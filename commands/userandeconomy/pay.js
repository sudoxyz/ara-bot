const WeebCommand = require('@base/WeebCommand.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');
const CommandError = require('../../utils/commandError');
const { IDs } = require('../../utils/ids');
const responsiveError = require('../../utils/responsiveError');

const taxRatePercent = 2;

module.exports = class pay extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'pay',
      description: `Send ARA to another member.`,
      usage: `${client.config.prefix}pay <member> <amount> <reason>`,
      aliases: ['send', 'give', 'transfer', 'transact'],
      permLevel: 'Trusted',
    });
  }

  async run(message, args) {
    return this.getData(args, message)
      .then(([amount, taxedAmount, member]) =>
        this.verifyTransaction(member, args, message, amount, taxedAmount),
      )
      .then(([amount, taxedAmount, member]) =>
        this.logTransaction(message, taxedAmount, member, amount, args),
      )
      .catch((error) => this.handleTransactionError(error, message));
  }

  async getData(args, message) {
    return Promise.all([
      this.getTransactionAmount(args, message),
      this.getTaxedTransactionAmount(args, message),
      this.getGuildMember(message, args),
    ]);
  }

  async verifyTransaction(member, args, message, amount, taxedAmount) {
    return this.verifyTypes(member, args)
      ? this.improperUsageError()
      : this.isAnAltAccount(member)
      ? this.altAccountError()
      : this.verifySolvent(message)
      ? this.insolvencyError()
      : amount < 0
      ? this.negativeAmountError()
      : amount === 0
      ? this.noAmountError(args)
      : this.verifyReason(args)
      ? this.insufficientReasonError()
      : Promise.all([
          amount,
          taxedAmount,
          member,
          this.client.dbusers.addBalance(message.author.id, -taxedAmount),
          this.client.dbusers.addBalance(member.id, amount),
        ]);
  }

  async logTransaction(message, taxedAmount, member, amount, args) {
    return Promise.all([
      this.sendSuccessResponse(message, taxedAmount, member, amount),
      this.sendLogResponse(message, member, args, taxedAmount, amount),
    ]);
  }

  async handleTransactionError(error, message) {
    return error instanceof CommandError
      ? responsiveError(message, error)
      : defaultError(error, message, this.client);
  }

  async getTransactionAmount(args, message) {
    return Math.min(
      parseInt(args[1], 10),
      Math.floor(
        (1 - taxRatePercent / 100) *
          (await this.client.dbusers.getBalance(message.author.id)),
      ),
    );
  }

  async getTaxedTransactionAmount(args, message) {
    return Math.ceil(
      (1 + taxRatePercent / 100) *
        (await this.getTransactionAmount(args, message)),
    );
  }

  async getGuildMember(message, args) {
    return (
      (await getUserFromMention(message, args[0])) ??
      message.guild.members.cache.get(args[0])
    );
  }

  isAnAltAccount(member) {
    return member.roles.cache.has(IDs.role.alt);
  }

  altAccountError() {
    return Promise.reject(
      new CommandError(
        'This command is not available for alt accounts, sorry.',
      ),
    );
  }

  verifyTypes(member, args) {
    return !member || !member.roles || Number.isNaN(Number(args[1]));
  }

  improperUsageError() {
    return Promise.reject(new CommandError(`Usage: ${this.help.usage}`));
  }

  verifySolvent(message) {
    return this.client.dbusers.getBalance(message.author.id) === 0;
  }

  insolvencyError() {
    return Promise.reject(new CommandError('You do not have any ARA!'));
  }

  async negativeAmountError() {
    return Promise.reject(
      new CommandError('Stealing is wrong! Please try again.'),
    );
  }

  async noAmountError(args) {
    return Promise.reject(
      new CommandError(
        `You cannot send 0 ARA. ${
          parseInt(args[1], 10) !== 0
            ? "(You didn't have enough ARA to pay the tax)"
            : ''
        }`,
      ),
    );
  }

  verifyReason(args) {
    return args.slice(2).join(' ').length < 1;
  }

  async insufficientReasonError() {
    return Promise.reject(
      new CommandError(
        `You need to provide a written reason for this payment. Poorly written reasons may result in being banned from the ARA system.`,
      ),
    );
  }

  async sendSuccessResponse(message, taxedAmount, member, amount) {
    return message.reply(
      this.generateResponseEmbed(message, taxedAmount, member, amount),
    );
  }

  generateResponseEmbed(message, taxedAmount, member, amount) {
    return {
      embeds: [
        {
          author: {
            name: 'ARA Payment',
            url: message.url,
            iconURL:
              'https://media.discordapp.net/attachments/894698271577108534/932071192322527252/payment.png',
          },
          color: 'GREEN',
          description: `${message.author} Has Given **\`${amount} ARA\`** To ${member}.`,
          footer: {
            text: `Taken as Tax: ${
              taxedAmount - amount
            } (${taxRatePercent}% - 1 Minimum)`,
          },
        },
      ],
    };
  }

  async sendLogResponse(message, member, args, taxedAmount, amount) {
    return message.guild.channels.cache
      .get(IDs.chat.araTransferLogs)
      .send(this.generateLogEmbed(message, member, args, taxedAmount, amount));
  }

  generateLogEmbed(message, member, args, taxedAmount, amount) {
    return {
      embeds: [
        {
          author: {
            name: message.author.username,
            url: message.url,
            iconURL: message.author.displayAvatarURL(),
          },
          color: 'GREEN',
          description: `[Link To Payment](${message.url})`,
          fields: [
            [
              {
                name: 'Sender',
                value: message.member.toString(),
                inline: true,
              },
              {
                name: 'Receiver',
                value: member.toString(),
                inline: true,
              },
            ],
            {
              name: 'Reason',
              value: args.slice(2).join(' '),
            },
            [
              {
                name: 'Amount',
                value: `${amount}`,
                inline: true,
              },
              {
                name: 'Tax',
                value: `${taxedAmount - amount} (${taxRatePercent}%)`,
                inline: true,
              },
            ],
          ],
          thumbnail: {
            url: 'https://media.discordapp.net/attachments/894698271577108534/932071192322527252/payment.png',
          },
          title: 'ARA Payment',
          url: message.url,
        },
      ],
    };
  }
};
