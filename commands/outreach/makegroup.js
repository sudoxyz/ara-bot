const WeebCommand = require("@base/WeebCommand.js");
const Discord = require('discord.js');
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');

function extractRandom(members) {
  const member = members.random();
  if (member) members.delete(member.id);
  return member;
}
/**
 * Usage: !makegroups <prepare?>|<groupCount:number?>
 *
 * prepare: gives the chance to set-up groups before createing them,
 *  leaders and recorders can apply for their respective roles,
 *  if not present, group leaders and recorders will be chosen rand;
 *
 * groupCount: how many groups to make,
 *  if not present, as many groups as possible will be created trying to have at least 3 members in each group;
 *
 */
module.exports = class leaderboard extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "makegroup",
      description: `Makes n outreach groups including text-channel, vc and role\n
                    Available to Outreach Leaders`,
      usage: `${client.config.prefix}makegroups groupCount`,
      aliases: ["mg"],
      permLevel: "Outreach Leader"
    });
  } async run(message, args) {
    try {
      const membersToMove = message.guild.channels.cache.find(channel => channel.id === IDs.vc.meetingRoom).members;

      const leaderPool = membersToMove.filter((member) => member.roles.cache.has(IDs.role.outreachLeader));
      const recorderPool = membersToMove.filter((member) => member.roles.cache.has(IDs.role.archiver));

      let argGroupCount = Number(args[0]);
      let groupCount = argGroupCount;

      if (groupCount === 0 || groupCount === undefined) return message.reply("group count cannot be 0.");

      console.log(`groupCount: ${groupCount}`);

      groupCount = Math.min(leaderPool.size, groupCount);
      if (groupCount < argGroupCount) {
        return message.reply(`there are not enough leaders to make ${argGroupCount} groups.`);
      }

      // Calculates how many groups should be made, trying to have at least 3 members in each group
      if (!groupCount) return message.reply("Please specify the number of groups to create");

      let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      let groupList = [];
      let voiceList = [];
      let allGroups = [];

      for (let i = 0; i < args[0]; i++) {
        let roleName = 'Group ' + letters[i];
        await message.guild.roles.create({
          name: roleName,
          color: 'YELLOW',
          reason: 'Outreach roles needed'
        });
        let groupName = "group-" + letters[i].toLowerCase();
        let existingChannel = await message.guild.channels.cache.find(channel => channel.name === groupName);
        if (!existingChannel) {
          existingChannel = await message.guild.channels.create(groupName, {
            type: "GUILD_TEXT", permissionOverwrites: [{ id: IDs.role.activist, allow: ['VIEW_CHANNEL'] },
            { id: IDs.user.bot, allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'] },
            { id: message.guild.id, deny: ['VIEW_CHANNEL'] }]
          }).then(channel => channel.setParent(IDs.chat.activismCategory));
          groupList.push(existingChannel);
        }

        let voiceName = "Group " + letters[i];
        let voice = await message.guild.channels.cache.find(channel => channel.name === voiceName);
        if (!voice) {
          voice = await message.guild.channels.create(voiceName, {
            type: "GUILD_VOICE", permissionOverwrites: [{ id: IDs.role.activist, allow: ['VIEW_CHANNEL'] },
            { id: IDs.user.bot, allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'] },
            { id: message.guild.id, deny: ['VIEW_CHANNEL'] }]
          }).then(channel => channel.setParent(IDs.chat.activismCategory));
          voiceList.push(voice);
        }

        allGroups.push({ name: roleName, vc_id: voice.id, members: new Discord.Collection() });
      }

      const destGroups = allGroups.splice(0, groupCount);

      for (const destGroup of destGroups) {
        const randomLeader = extractRandom(leaderPool);
        const randomRecorder = extractRandom(recorderPool);
        if (randomLeader) {
          destGroup.members.set(randomLeader.id, randomLeader);
          destGroup.leader = randomLeader;
          membersToMove.delete(randomLeader.id);
        }
        if (randomRecorder) {
          destGroup.members.set(randomRecorder.id, randomRecorder);
          destGroup.recorder = randomRecorder;
          membersToMove.delete(randomRecorder.id);
        }
      }

      for (let i = 0; membersToMove.size > 0; i++) {
        let currentGroupIdx = i % destGroups.length;
        let member = extractRandom(membersToMove);
        destGroups[currentGroupIdx].members.set(member.id, member);
      }

      destGroups.forEach((group) => {
        const vc = message.guild.channels.cache.get(group.vc_id);
        const role = message.guild.roles.cache.find((role) => role.name === group.name);
        group.members.forEach(async (member) => {
          await member.voice.setChannel(vc);
          await member.roles.add(role);
        });
      });

      destGroups.forEach((group) => {
        message.channel.send(`${group.name} leader: ${group.leader.toString()}`);
      });

    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};
