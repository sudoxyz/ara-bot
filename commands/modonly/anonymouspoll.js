const WeebCommand = require('@base/WeebCommand');
const defaultError = require('@utils/defaultError');
var { IDs } = require('@utils/ids.js');

const lockActionsToAuthor = false;

module.exports = class anonymouspoll extends WeebCommand {
    
    attachPaginationReaction = async (message, author, id) => {
        let countUp = 0;
        let countDown = 0;
        let countShrug = 0;
        let reactedUsers = [];
    
        const filter = (reaction, user) => {
          ['👍', '🤷‍♀️', '👎'].includes(reaction.emoji.name) && user.id !== IDs.user.bot && (!lockActionsToAuthor || user.id === author.id);
        };
    
        let collector;
        await message.react('👍');
        await message.react('🤷‍♀️');
        await message.react('👎').then(collector = message.createReactionCollector(filter, { time: 108000000 }));
        const userReactions = message.reactions.cache.filter(reaction => !reaction.users.cache.has(IDs.user.bot));
        console.log(userReactions);
        try {
          for (const reaction of userReactions.values()) {
            console.log(reaction);
            // await reaction.users.remove(reaction.user);
          }
        } catch (error) {
          console.error('Failed to remove reactions.');
        }
        collector.on('collect', async (reaction, user) => {
          if(reactedUsers.includes(user.id)){
            reaction.users.remove(user);
          }else if (reaction.emoji.name == '👍') {
            countUp +=1;
            reaction.users.remove(user);
          } else if (reaction.emoji.name == '🤷‍♀️') {
            countDown += 1;
            reaction.users.remove(user);
          } else if (reaction.emoji.name == '👎') {
            countShrug += 1;
            reaction.users.remove(user);
          }
          if (reaction.emoji.name == '✅'){
            collector.stop();
          }
        });
    
        collector.on('end', async () => {
            message.channel.send(`Poll Id: ${id}\n Upvotes: ${countUp}\nDownvotes: ${countDown}\nShrugVotes: ${countShrug}`);
            console.log([countUp, countDown, countShrug]);
            return [countUp, countDown, countShrug];
    });
  }
    
  constructor(client) {
    super(client, {
      name: "anonymouspoll",
      description: `Runs an anonymous poll\n
                    Only parameters are the poll id and the name of the poll you want
                         Available to Mods only`,
      usage: `${client.config.prefix}anonymouspoll pollId questionForPoll`,
      aliases: ["ap"],
      permLevel: 'Staff'
    });
  } async run(message, args) {
      let pollMessage;
      let id;
      if(args.length > 0){
          id = args[0];
          args.shift();
          pollMessage = await message.channel.send(`Poll ID: ${id}\n\`${args.join(" ")}\``);
      }else {
        message.react("❌");
        return;
      }
    }
};

