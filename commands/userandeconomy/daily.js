const WeebCommand = require('@base/WeebCommand.js');
const moment = require('moment');
const defaultError = require('@utils/defaultError');
const { ARA } = require('../../utils/ara');

module.exports = class daily extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'daily',
      description: `Earn Daily rewards\nAvailable for everyone`,
      usage: `${client.config.prefix}daily`,
      category: 'Economy',
      aliases: [],
      permLevel: 'Trusted',
    });
  }

  async run(message) {
    try {
      if (
        message.channel.id === ARA.text.main.all ||
        message.member.roles.cache.has(ARA.roles.miscellaneous.alt)
      )
        return Promise.resolve(); // If the user is an alt, don't do anything. If the user posts in all-chat don't do anything.
      const userStats = await this.client.dbusers.getUser(message.author.id);
      const today = new Date();
      const todayString = today.toLocaleString('en-US', {
        timeZone: 'America/New_York',
      });
      let difference = 0;
      if (userStats && userStats.last_daily) {
        difference =
          today -
          Date.parse(
            userStats.last_daily.toLocaleString('en-US', {
              timeZone: 'America/New_York',
            }),
          );
      }
      const diff = moment.duration(difference);
      if (diff.asDays() < 1)
        return message.reply(
          'You have already claimed your daily for today. Come back in a few hours',
        );
      userStats.last_daily = todayString;
      const xpBonus = this.client.config.daily.xp;
      const baseCurrency = this.client.config.daily.currency;
      const roleCache = message.member.roles.cache;
      const roleCurrency = Math.trunc(
        (roleCache.has(ARA.roles.team.communityMod)
          ? 15
          : roleCache.has(ARA.roles.team.b12)
          ? 10
          : 0) +
          (roleCache.has(ARA.roles.team.workshopPlanner) ? 1 : 0) +
          (roleCache.has(ARA.roles.team.mediaTeam) ? 1 : 0) +
          (roleCache.has(ARA.roles.access.void) ? 1 : 0) +
          (roleCache.has(ARA.roles.team.workshopLeader) ? 1 : 0) +
          (roleCache.has(ARA.roles.team.stageHost) ? 1 : 0) +
          (roleCache.has(ARA.roles.team.outreachLeader) ? 1 : 0) +
          (roleCache.has(ARA.roles.team.vegSupport) ? 2 : 0) +
          (roleCache.has(ARA.roles.team.developer) ? 2 : 0) +
          (roleCache.has(ARA.roles.team.verifier) ? 4 : 0) +
          (roleCache.has(ARA.roles.team.projectManager) ? 5 : 0),
      );
      const currencyBonus = Math.trunc(baseCurrency + roleCurrency);
      await this.client.dbusers.addXp(message.author.id, xpBonus);
      await this.client.dbusers.addBalance(message.author.id, currencyBonus);
      userStats.save();
      return message.reply({
        embeds: [
          {
            author: {
              name: 'ARA Daily',
              url: message.url,
              iconURL:
                'https://media.discordapp.net/attachments/894698271577108534/932071192322527252/payment.png',
            },
            color: 'GREEN',
            description: `You've been given **\`${baseCurrency}\`**${
              roleCurrency === 0
                ? ''
                : ` (plus a bonus **\`${roleCurrency}\`** for helping out the community!) **\`ARA\`**`
            }`,
            footer: {
              text: `New Total: ${this.client.dbusers.getBalance(
                message.author.id,
              )}`,
            },
          },
        ],
      });
    } catch (error) {
      return defaultError(error, message, this.client);
    }
  }
};
