const WeebCommand = require('@base/WeebCommand.js');
const { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');
const wait = require('util').promisify(setTimeout);

const verificationReward = 10;

module.exports = class verify extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'verify',
      description: `${client.config.prefix}ver @mention\n
                        Available to Verifier and Mods`,
      usage: `${client.config.prefix}ver @mention`,
      permLevel: 'Verifier',
      aliases: ['ver'],
    });
  }

  async run(message, args) {
    try {
      if (!message.member.roles.cache.has(IDs.role.verifier)) {
        if (!message.member.roles.cache.has(IDs.role.moderator)) {
          return;
        }
      }
      const generalTextChannel = message.guild.channels.cache.get(
        IDs.chat.general,
      );
      const rulesAndConductTextChannel = message.guild.channels.cache.get(
        IDs.chat.rulesAndConduct,
      );
      const rolesTextChannel = message.guild.channels.cache.get(IDs.chat.roles);
      const chatTextChannel = message.guild.channels.cache.get(IDs.chat.chat);
      const veganRolesTextChannel = message.guild.channels.cache.get(
        IDs.chat.veganRoles,
      );
      const activistRolesTextChannel = message.guild.channels.cache.get(
        IDs.chat.activistRoles,
      );
      const weeklyScheduleTextChannel = message.guild.channels.cache.get(
        IDs.chat.weeklySchedule,
      );
      const outreachExplanationTextChannel = message.guild.channels.cache.get(
        IDs.chat.outreachExplanation,
      );
      const helpMeTextChannel = message.guild.channels.cache.get(
        IDs.chat.helpMeChat,
      );
      const susPeopleChannel = message.guild.channels.cache.get(
        IDs.chat.susPeopleNotes,
      );
      const veganOnServerTextChannel = message.guild.channels.cache.get(
        IDs.chat.veganOnServer,
      );
      let targetMember;
      for (const arg of args) {
        const user = await getUserFromMention(message, arg);
        if (user) {
          targetMember = user;
        }
      }
      if (!targetMember && !args[0]) {
        message.react('❌');
        return;
      }
      let id;
      for (const arg of args) {
        if (arg.length === 18) {
          id = arg;
        }
      }

      if (id) {
        targetMember = message.guild.members.cache.get(id);
        if (!targetMember) {
          message.react('❌');
          return;
        }
      }

      if (!targetMember || !targetMember.roles) {
        message.react('❌');
        return;
      }

      const verifications = {
        vegan: false,
        activist: false,
        nonvegan: false,
        trusted: false,
        alt: false,
        veg: false,
        sus: false,
        veganOnServer: false,
      };
      console.log(args);
      for (const arg of args) {
        if (arg === 'vegan' || arg === 'v') {
          if (!targetMember.roles.cache.has(IDs.role.vegan)) {
            await targetMember.roles
              .add(IDs.role.vegan)
              .then((m) =>
                console.log(`gave role 'vegan' to user ${m.user.username}`),
              );
            verifications.vegan = true;
          }
          if (!targetMember.roles.cache.has(IDs.role.discussionAccess)) {
            await targetMember.roles
              .add(IDs.role.discussionAccess)
              .then((m) =>
                console.log(
                  `gave role 'Discussion Access' to user ${m.user.username}`,
                ),
              );
            verifications.vegan = true;
          }
          if (targetMember.roles.cache.has(IDs.role.nonvegan)) {
            await targetMember.roles.remove(IDs.role.nonvegan);
          }
          if (targetMember.roles.cache.has(IDs.role.restricted)) {
            await targetMember.roles.remove(IDs.role.restricted);
          }
          if (targetMember.roles.cache.has(IDs.role.restricted2)) {
            await targetMember.roles.remove(IDs.role.restricted2);
          }
          if (targetMember.roles.cache.has(IDs.role.restricted3)) {
            await targetMember.roles.remove(IDs.role.restricted3);
          }
          if (targetMember.roles.cache.has(IDs.role.restricted4)) {
            await targetMember.roles.remove(IDs.role.restricted4);
          }
          if (targetMember.roles.cache.has(IDs.role.verifyAsVegan)) {
            await targetMember.roles.remove(IDs.role.verifyAsVegan);
          }
          if (targetMember.roles.cache.has(IDs.role.convinced)) {
            await targetMember.roles.remove(IDs.role.convinced);
          }
          if (targetMember.roles.cache.has(IDs.role.verifying)) {
            await targetMember.roles.remove(IDs.role.verifying);
          }
          if (targetMember.roles.cache.has(IDs.role.notVerified)) {
            await targetMember.roles.remove(IDs.role.notVerified);
          }
          if (targetMember.roles.cache.has(IDs.role.textVerifying)) {
            await targetMember.roles.remove(IDs.role.textVerifying);
          }
          if (targetMember.roles.cache.has(IDs.role.expectations)) {
            await targetMember.roles.remove(IDs.role.expectations);
          }
        } else if (arg == 'activist' || arg === 'a') {
          if (!targetMember.roles.cache.has(IDs.role.activist)) {
            await targetMember.roles
              .add(IDs.role.activist)
              .then((m) =>
                console.log(`gave role 'activist' to user ${m.user.username}`),
              );
            verifications.activist = true;
          }
          if (targetMember.roles.cache.has(IDs.role.restricted)) {
            await targetMember.roles.remove(IDs.role.restricted);
          }
          if (targetMember.roles.cache.has(IDs.role.restricted2)) {
            await targetMember.roles.remove(IDs.role.restricted2);
          }
          if (targetMember.roles.cache.has(IDs.role.restricted3)) {
            await targetMember.roles.remove(IDs.role.restricted3);
          }
          if (targetMember.roles.cache.has(IDs.role.restricted4)) {
            await targetMember.roles.remove(IDs.role.restricted4);
          }
          if (targetMember.roles.cache.has(IDs.role.verifyAsVegan)) {
            await targetMember.roles.remove(IDs.role.verifyAsVegan);
          }
          if (targetMember.roles.cache.has(IDs.role.expectations)) {
            await targetMember.roles.remove(IDs.role.expectations);
          }
        } else if (arg == 'nonvegan' || arg === 'nv') {
          if (targetMember.roles.cache.has(IDs.role.vegan)) {
            message.react('❌');
            continue;
          }
          if (!targetMember.roles.cache.has(IDs.role.nonvegan)) {
            await targetMember.roles
              .add(IDs.role.nonvegan)
              .then((m) =>
                console.log(`gave role 'nonvegan' to user ${m.user.username}`),
              );
            verifications.nonvegan = true;
          }
          if (targetMember.roles.cache.has(IDs.role.vegan)) {
            await targetMember.roles.remove(IDs.role.vegan);
          }
          if (targetMember.roles.cache.has(IDs.role.activist)) {
            await targetMember.roles.remove(IDs.role.activist);
          }
          if (targetMember.roles.cache.has(IDs.role.restricted)) {
            await targetMember.roles.remove(IDs.role.restricted);
          }
          if (targetMember.roles.cache.has(IDs.role.restricted2)) {
            await targetMember.roles.remove(IDs.role.restricted2);
          }
          if (targetMember.roles.cache.has(IDs.role.restricted3)) {
            await targetMember.roles.remove(IDs.role.restricted3);
          }
          if (targetMember.roles.cache.has(IDs.role.restricted4)) {
            await targetMember.roles.remove(IDs.role.restricted4);
          }
          if (targetMember.roles.cache.has(IDs.role.verifyAsVegan)) {
            await targetMember.roles.remove(IDs.role.verifyAsVegan);
          }
          if (targetMember.roles.cache.has(IDs.role.verifying)) {
            await targetMember.roles.remove(IDs.role.verifying);
          }
          if (targetMember.roles.cache.has(IDs.role.notVerified)) {
            await targetMember.roles.remove(IDs.role.notVerified);
          }
          if (targetMember.roles.cache.has(IDs.role.textVerifying)) {
            await targetMember.roles.remove(IDs.role.textVerifying);
          }
          if (targetMember.roles.cache.has(IDs.role.expectations)) {
            await targetMember.roles.remove(IDs.role.expectations);
          }
        } else if (arg == 'trusted' || arg === 't') {
          if (!targetMember.roles.cache.has(IDs.role.trusted)) {
            await targetMember.roles
              .add(IDs.role.trusted)
              .then((m) =>
                console.log(`gave role 'trusted' to user ${m.user.username}`),
              );
            verifications.trusted = true;
          }
          if (targetMember.roles.cache.has(IDs.role.restricted)) {
            await targetMember.roles.remove(IDs.role.restricted);
          }
          if (targetMember.roles.cache.has(IDs.role.restricted2)) {
            await targetMember.roles.remove(IDs.role.restricted2);
          }
          if (targetMember.roles.cache.has(IDs.role.restricted3)) {
            await targetMember.roles.remove(IDs.role.restricted3);
          }
          if (targetMember.roles.cache.has(IDs.role.restricted4)) {
            await targetMember.roles.remove(IDs.role.restricted4);
          }
          if (targetMember.roles.cache.has(IDs.role.verifyAsVegan)) {
            await targetMember.roles.remove(IDs.role.verifyAsVegan);
          }
          if (targetMember.roles.cache.has(IDs.role.expectations)) {
            await targetMember.roles.remove(IDs.role.expectations);
          }
        } else if (arg === 'alt') {
          if (!targetMember.roles.cache.has(IDs.role.alt)) {
            await targetMember.roles
              .add(IDs.role.alt)
              .then((m) =>
                console.log(`gave role 'alt' to user ${m.user.username}`),
              );
            verifications.alt = true;
          }
          if (targetMember.roles.cache.has(IDs.role.verifyAsVegan)) {
            await targetMember.roles.remove(IDs.role.verifyAsVegan);
          }
          if (targetMember.roles.cache.has(IDs.role.expectations)) {
            await targetMember.roles.remove(IDs.role.expectations);
          }
        } else if (arg === '!' || arg === 'sus') {
          if (!targetMember.roles.cache.has(IDs.role.sus)) {
            await targetMember.roles
              .add(IDs.role.sus)
              .then((m) =>
                console.log(`gave role 'sus' to user ${m.user.username}`),
              );
            verifications.sus = true;
          }
        } else if (arg === 'x') {
          verifications.veganOnServer = true;
        } else if (arg === 'veg') {
          if (!targetMember.roles.cache.has(IDs.role.vegCurious)) {
            await targetMember.roles
              .add(IDs.role.vegCurious)
              .then((m) =>
                console.log(
                  `gave role 'Veg Curious' to user ${m.user.username}`,
                ),
              );
            verifications.veg = true;
          }
        }
      }

      if (verifications.sus) {
        susPeopleChannel.send(`${targetMember.toString()} is very sus`);
        message.react('✅');
      }
      if (verifications.veganOnServer) {
        veganOnServerTextChannel.send(
          `${targetMember.toString()} went vegan on the server`,
        );
        message.react('✅');
      }
      if (verifications.veg) {
        const helpMeMessage = await helpMeTextChannel.send(
          `Hi ${targetMember.toString()}! You can ask any questions pertaining to veganism or a plant-based diet here, and tag the "Veg Support" role to get answers to your questions. Check the sidebar for additional resources.`,
        );
        targetMember.send(
          `Hi ${targetMember.toString()}! You can ask any questions pertaining to veganism or a plant-based in the ${helpMeTextChannel}, and tag the "Veg Support" role to get answers to your questions. Check the sidebar for additional resources.`,
        );
        await wait(15000);
        try {
          await helpMeTextChannel.messages
            .fetch(helpMeMessage.id)
            .then((helpMeMessage) => helpMeMessage.delete())
            .catch(console.error); // it fetched the message - good
        } catch (error) {
          console.log(error);
        }
        message.react('✅');
      }
      if (verifications.activist) {
        generalTextChannel.send(
          `${targetMember.toString()} you have been verified! Please check ${activistRolesTextChannel.toString()} More info about vegan outreach at ${outreachExplanationTextChannel.toString()} and our ${weeklyScheduleTextChannel.toString()}`,
        );
        message.react('✅');
      } else if (verifications.vegan) {
        generalTextChannel.send(
          `${targetMember.toString()}, you have been verified! Please check ${veganRolesTextChannel.toString()}`,
        );
        message.react('✅');
      } else if (verifications.nonvegan) {
        chatTextChannel.send(
          `${targetMember.toString()}, you have been verified! Please check ${rolesTextChannel.toString()} and remember to follow the ${rulesAndConductTextChannel.toString()} and to respect ongoing discussions and debates.`,
        );
        message.react('✅');
      }/*
      await this.client.dbusers.addBalance(
        message.author.id,
        verificationReward,
      );*/ 
      await this.sendLogResponse(message, targetMember);
       await message.reply(
        `You've successfully verified ${targetMember}!`,
      );
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }

  sendLogResponse(message, member) {
    return message.guild.channels.cache
      .get(IDs.chat.araRewardLogs)
      .send(this.generateLogEmbed(message, member));
  }

  
  generateLogEmbed(message, member) {
    return {
      embeds: [
        {
          author: {
            name: message.author.username,
            url: message.url,
            iconURL: message.author.displayAvatarURL(),
          },
          color: 'AQUA',
          description: `[Link To Verification](${message.url})`,
          fields: [
            {
              name: 'Verifier',
              value: message.member.toString(),
              inline: true,
            },
            {
              name: 'Verified',
              value: member.toString(),
              inline: true,
            },
            {
              name: 'Amount',
              value: `${verificationReward}`,
            },
            {
              name: 'Reason',
              value: `Verified in ${message.channel}`,
            },
          ],
          thumbnail: {
            url: 'https://media.discordapp.net/attachments/894698271577108534/934727194360553532/check.png',
          },
          title: `ARA Verification Reward`,
          url: message.url,
        },
      ],
    };
  }
};
