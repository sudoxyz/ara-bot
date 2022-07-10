require('module-alias/register');
const { Client, Collection, version } = require("discord.js");
const Discord = require("discord.js");
require('dotenv').config();
const fs = require('fs');
const path = require("path");
const { reflect, setup } = require("@utils/database.js");
const { Users, sequelize } = require('@utils/dbObjects.js');
const mongodb = require('@utils/mongodb');
const reminders = require('@utils/reminders');
var { IDs } = require('@utils/ids.js');
const wait = require('util').promisify(setTimeout);
const defaultError = require('@utils/defaultError');

const express = require('express');
const PORT = process.env.PORT || 5000;
let invites = new Map();

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

//Database Setup
setup();
mongodb();

//CUSTOM CLIENT to allow for simp things...
class WokeWeebBot extends Client {
  constructor(options) {
    super(options);
    // Aliases and commands are put in collections where they can be read from,
    // catalogued, listed, etc.
    this.commands = new Collection();
    this.aliases = new Collection();
    //Database Storage units.
    this.dbusers = new Collection();
    this.dbstats = new Collection();

    this.config = require("./config.js");

    // client.config.token contains the bot's token
    // client.config.prefix contains the message prefix
  }

  permlevel(message) {
    let permlvl = 0;

    const permOrder = this.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }

  async reloadcommand(commandPath, commandName) {
    let unload = true; // True if failed to unload
    let load = true; // True if failed to load
    try { unload = await this.unloadCommand(commandPath, commandName); } catch (e) { console.log(e); }
    try { load = this.loadCommand(commandPath, commandName); } catch (e) { console.log(e); }
    if (!unload && load) {
      return console.log(`Failed to load: ${commandName}`);
    } else if (unload && load) {
      return console.log(`Failed to unload and load: ${commandName}`);
    }
    console.log("Reload Complete!");
    return false;
  }

  loadCommand(commandPath, commandName) {
    try {
      const TempCommand = new (require(`${commandPath}${path.sep}${commandName}`))(this);
      console.log(`Loading Command: ${TempCommand.help.name}. `);
      TempCommand.conf.location = commandPath;
      if (TempCommand.init) {
        TempCommand.init(this);
      }
      this.commands.set(TempCommand.help.name, TempCommand);
      TempCommand.conf.aliases.forEach(alias => {
        // if (this.aliases.keys().find(existingAlias => existingAlias === alias)) {
        //   continue
        // }
        this.aliases.set(alias, TempCommand.help.name);
      });
      return false;
    } catch (e) {
      return console.log(`Unable to load command ${commandName}: ${e}`);
    }
  }

  loadCommands(dir) {
    const files = fs.readdirSync(path.join(__dirname, dir));
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file));
      if (stat.isDirectory()) {
        this.loadCommands(path.join(dir, file));
      } else if (file.endsWith('.js')) {
        this.loadCommand(path.join(__dirname, dir), file);
      }
    }
  }

  loadEvents(dir) {
    const eventFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
      const event = require('' + dir + `/${file}`);
      console.log(`Loading Event: ${file}.`);
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    }
  }

  async unloadCommand(commandPath, commandName) {
    let command;
    if (this.commands.has(commandName)) {
      command = this.commands.get(commandName);
    } else if (this.aliases.has(commandName)) {
      command = this.commands.get(this.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(this);
    }
    delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
    return false;
  }
}

const myIntents = new Discord.Intents();
myIntents.add(Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILDS,
  Discord.Intents.FLAGS.GUILD_BANS, Discord.Intents.FLAGS.GUILD_INTEGRATIONS, Discord.Intents.FLAGS.GUILD_WEBHOOKS,
  Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS);
// create the client
const client = new WokeWeebBot({ intents: myIntents, allowedMentions: { parse: ['users', 'roles'] } });

const init = async () => {
  // Access DataBase via client.currency.{Value}
  await reflect(client, sequelize);

  client.loadCommands('./commands');
  client.loadEvents('./events');
  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  // Must be the last line of the file
  client.login(process.env.TOKEN);
};
init();

// Logs that the bot is online
client.once('ready', async () => {
  console.log('WeebBot is online ');
  console.log(`Version: ${version} JS`);
  console.log(`ID: ${client.user.id}`);
  let filePath = '/app/media/';
  if (process.env.CONFIG === 'local') {
    filePath = './media/';
  }
  client.user.setAvatar(filePath + 'BotLogo.png')
    .catch(console.error);
  await wait(1000);
  // logged in username... to be changed later but good for seeing who is working on the bot currently
  client.user.setActivity(`${require("os").userInfo().username} is working on the bot`);
  const users = await Users.findAll();
  users.forEach(b => {
    client.dbusers.set(b.user_id, b);
  });

  // Cron for sending reminders
  reminders(client);
  try {
    let guild = await client.guilds.fetch(IDs.guild.mainServer).catch(console.error);
    let invs = await guild.invites.fetch().catch(console.error);
    invs.forEach(inv => {
      invites[inv.code] = inv.uses;
    });
    console.log(invites);
  } catch (error) {
    console.log(error);
  }
});

client.on('guildMemberAdd', async member => {
  if (client.dbusers.getRestricted(member.id)) {
    await member.roles.add(IDs.role.restricted);
  } else if (client.dbusers.getRestrictedTwo(member.id)) {
    await member.roles.add(IDs.role.restricted2);
  } else if (client.dbusers.getRestrictedThree(member.id)) {
    await member.roles.add(IDs.role.restricted3);
  } else if (client.dbusers.getRestrictedFour(member.id)) {
    await member.roles.add(IDs.role.restricted4);
  }

  try {
    let invs = await member.guild.invites.fetch().catch(console.error);

    let code;
    for (let i of invs) {
      if (i[1].uses > invites[i[1].code]) {
        code = i[1].code;
      }
    }
    let invitesToRefresh = await member.guild.invites.fetch().catch(console.error);
    if (invitesToRefresh) {
      await invitesToRefresh.forEach(inv => {
        invites[inv.code] = inv.uses;
      });
    }

    if (code === IDs.invites.curious) {
      await member.roles.add(IDs.role.vegCurious).catch(console.error);
      await member.roles.add(IDs.role.nonvegan).catch(console.error);
      let guild = await client.guilds.fetch(IDs.guild.mainServer).catch(console.error);
      let channel = await guild.channels.fetch(IDs.chat.helpMeChat);
      channel.send(`Hi ${member}! This channel is a part of the ‘Help Me Go Vegan’ section of the server. Feel free to ask any questions pertaining to veganism or a fully plant-based diet here. If someone misses your question, tag "’@VegSupport’" and someone will get back to you as soon as possible. Check the left sidebar for additional resources and a myriad of other places where animal rights related discussions take place!`);
    } else if (code === IDs.invites.expectations) {
      await member.roles.add(IDs.role.expectations).catch(console.error);
    }
  } catch (error) {
    console.log(error);
  }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  try {
    if ((oldState.channelId === null || typeof oldState.channelId === 'undefined') && oldState.member !== null && newState.member !== null) {
      console.log("joining");
      if (newState.member) {
        let muted = await client.dbusers.getMuted(newState.member.id);
        if (muted === true) {
          await newState.member.voice.setMute(true).catch(console.error);
        } else if (muted === false && !newState.channel.type === 'GUILD_STAGE_VOICE') {
          await newState.member.voice.setMute(null).catch(console.error);
        }
        await client.dbusers.setLastJoinedVC(newState.member.id, new Date());
        return;
      }
    }
    if (oldState.channelId === IDs.chat.afk) {
      return;
    }
  }catch(error){
    console.error;
  }
});

// Bot do bot things
client.on('messageCreate', async (message) => {
  try {
    let msg = message;

    if ((message.channel.id == IDs.chat.welcomeRules || message.channel.id === IDs.chat.araExplanation)
      && !message.member.roles.cache.has(IDs.role.organizer)) {
      try {
        await message.channel.messages.fetch(message.id)
          .then(message => message.delete()).catch(console.error); //it fetched the message - good
      } catch (error) {
        console.log(error);
        //the message no longer exists and will be ignored
      }
    }

    //Stop bots leveling up in general.
    if (message.author.bot) return;

    // Cancel any attempt to execute commands if the bot cannot respond to the user.
    //Should never happen as WeebBot Should have Admin perms
    if (message.guild && !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")) return;

    //Allow Check for command but requires at least the length of the prefix
    if (message.content.length <= client.config.prefix.length);
    let isCommand = null;
    let args = null;
    let command = null;
    // Take away the prefix when reading messages and make command lower case
    if (message.content.startsWith(client.config.prefix)) {
      args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
      command = args.shift().toLowerCase();
      isCommand = (client.commands.get(command) || client.commands.get(client.aliases.get(command)));
    }
    //Loads Author from db
    let userStats = client.dbusers.getUser(message.author.id);
    //console.log(Date.now() - userStats.last_message > 60000 && !( client.commands.get(command) || client.commands.get(client.aliases.get(command))));
    if (Date.now() - userStats.last_message > 60000 && isCommand == null && !client.config.levelUp.disabledChannels.includes(Number(message.channel.id)) && !client.config.levelUp.disabledCategories.includes(Number(message.channel.parentID))) {
      var randNumMin = client.config.levelUp.xp.lower ? client.config.levelUp.xp.lower : 15;
      var randNumMax = client.config.levelUp.xp.upper ? client.config.levelUp.xp.upper : 25;
      userStats.xp += (Math.floor(Math.random() * (randNumMax - randNumMin + 1)) + randNumMin);
      userStats.last_message = Date.now().toString();

      //const xpToNextLevel = 5 * Math.pow(userStats.level, 2) * 50 * userStats.level + 100;
      const HighestLevel = client.dbusers.getHighestLevel(userStats.xp);
      if (userStats.level < HighestLevel) {
        userStats.level = HighestLevel;
      }

      console.log(client.dbusers.xpnextstage(userStats.level) + ' xp needed for next level.');
      console.log(message.author.username + ' now has ' + userStats.xp);
      userStats.save();
    }

    if (message.channel.id === IDs.chat.suggestions) {
      if (message.guild.id != IDs.guild.modServer) {
        let guild = await client.guilds.cache.get(IDs.guild.mainServer);
        const mirrorMsg = `${message.author} suggested:\n\n> ${message.content}`;
        let channel = await guild.channels.cache.find(channel => channel.id === '972364104838824116');
        await channel.send(mirrorMsg).then(async function (message) {
          await message.react("👍");
          await message.react("👎");
          await message.react('<:catshrug:917505035196313671>');
        });
        try {
          await message.channel.messages.fetch(message.id)
            .then(async message => await message.delete()).catch(console.error); //it fetched the message - good
          await message.reply("We've received your suggestion, thank you!");
        } catch (error) {
          console.log(error);
          //the message no longer exists and will be ignored
        }
        return;
      }
      return;
    }

    // Bot only does stuff when a command is given
    if (!msg.content.startsWith(client.config.prefix)) { return; }

    if (msg.guild && !msg.member) await msg.guild.fetchMember(msg.author);
    const level = client.permlevel(msg);

    // Check whether the command, or alias, exist in the collections defined
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd) { return client.debug ? console.log("Command not known") : null; }

    //GUILD VALIDATOR
    if (cmd && !msg.guild && cmd.conf.guildOnly) return await msg.channel.send("This command is unavailable via private message. Please run this command in a guild.");
    //LEVEL VALIDATOR
    if (level < client.levelCache[cmd.conf.permLevel]) {
      if (client.debug === true) {
        return msg.channel.send(`You do not have permission to use this command.
          Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
          This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
      } else {
        msg.react("❌");
        return;
      }
    }
    msg.author.permLevel = level;
    let channel = await msg.guild.channels.fetch(IDs.chat.arabotlogs);
    let messageChannel = await msg.guild.channels.fetch(msg.channel.id);
    if (channel && messageChannel && msg) {
      const mirrorMsg = `\`${msg.author.username}:\` \`${msg.content}\` in ${messageChannel} (${messageChannel.name})`;
      await channel.send(mirrorMsg);
    }
    await cmd.run(msg, args, level);
  } catch (error) {
    console.log(error);
    defaultError(error, message);
  }
});
