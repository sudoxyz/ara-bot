const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const Questionnaire = require("@utils/questionnaire");

module.exports = class endgroup extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "endgroups",
      description: `Ends an outreach group and prompts user to enter stats\n
                    Available to Outreach Leaders`,
      usage: `${client.config.prefix}endgroups <prepare?>|<groupCount:number?>`,
      aliases: ["dg", "eg"],
      permLevel: "Outreach Leader"
    });
  } async run(message, args) {
    let listOfTypes = ["UNSCHEDULED", "SCHEDULED"];

    if (!args[1] || !listOfTypes.includes(args[1].toUpperCase())) {
      message.channel.send("Please run `?dg groupLetter type where type is one of these\n " + listOfTypes.join(" "));
      return;
    }
    let messagesToDelete = [];
    let questionnaireStarted = false;
    let questionnaire = new Questionnaire();
    async function askQuestion(questionnaire, message) {
      await deleteMessagesToDelete();
      let question = questionnaire.getCurrentQuestion();
      let answer = questionnaire.getCurrentAnswer();
      return message.channel
        .send(`\`${question}\` Current answer: \`${answer}\`. Answer with \`>number\``)
        .then((m) => {
          messagesToDelete.push(m);
          handleQuestionMessage(questionnaire, m, message.member);
        });
    }

    async function handleQuestionMessage(questionnaire, message, member) {
      try {
        if (!questionnaire.isFirst()) await message.react("⬅️");
        if (!questionnaire.isLast()) await message.react("➡️");
        const reactCollector = message.createReactionCollector(
          (reaction, user) => {
            if ((reaction.emoji.name === "⬅️" || reaction.emoji.name === "➡️") && user.id === member.id)
              return true;
            return false;
          },
          { time: 1000 * 60 * 5 }
        );

        reactCollector.on("collect", (reaction) => {
          if (reaction.emoji.name === "⬅️") {
            questionnaire.previous();
            askQuestion(questionnaire, message);
          }
          if (reaction.emoji.name === "➡️") {
            questionnaire.next();
            askQuestion(questionnaire, message);
          }
        });
      } catch (error) { console.error; }
    }

    async function deleteMessagesToDelete() {
      await messagesToDelete.forEach((m) => m.delete());
      messagesToDelete = [];
    }

    try {
      let statsChannel = message.guild.channels.cache.find(channel => channel.id === IDs.chat.successStats);

      if (!message.member.roles.cache.has(IDs.role.outreachLeader) && !message.member.roles.cache.has(IDs.role.developer)) {
        return message.reply("only a group leader can end a group session.");
      }
      if (!args[0]) return message.reply("you need to specify a group to end.");

      let vcToMove;
      let textToDelete;

      let vcDestination = message.guild.channels.cache.find(vc => vc.id === IDs.vc.meetingRoom);
      let map = { "A": "Group A", "B": "Group B", "C": "Group C", "D": "Group D", "E": "Group E", "F": "Group F", "G": "Group G" };
      let textMap = { "A": "group-a", "B": "group-b", "C": "group-c", "D": "group-d", "E": "group-e", "F": "group-f", "G": "group-g" };

      vcToMove = message.guild.channels.cache.find(channel => channel.name === map[args[0]]);
      textToDelete = message.guild.channels.cache.find(channel => channel.name === textMap[args[0]]);
      if (vcToMove === undefined) return message.reply("you need to specify a group to end.");
      await vcToMove.members.forEach(async (member) => {
        await member.voice.setChannel(vcDestination.id);
      });

      if (args[1] && args[1] === "no") return message.reply("the group has been ended.");

      message.reply(
        "the group has been ended. Would you like to take the end session questionnaire? Answer with `>yes` or `>no`."
      );

      const questionnaireCollector = message.channel.createMessageCollector(
        (message) => {
          if (message.author.id !== message.author.id) return false;
          if (!message.content.startsWith(">")) return false;
          return true;
        },
        { time: 1000 * 60 * 5 }
      );

      questionnaireCollector.on("collect", async (message) => {
        if (!questionnaireStarted && message.content.startsWith(">no")) {
          await questionnaireCollector.stop();
          vcToMove.delete();
          textToDelete.delete();
        }
        if (!questionnaireStarted && message.content.startsWith(">yes")) {
          questionnaireStarted = true;
          return askQuestion(questionnaire, message);
        }

        if (message.content === ">interrupt") {
          messagesToDelete.push(message);
          questionnaire.interrupt();
          await deleteMessagesToDelete();
          questionnaireCollector.stop();
        }

        const isValidAnswer = /^>[0-9]+/.test(message.content);

        if (questionnaireStarted && isValidAnswer) {
          messagesToDelete.push(message);
          const answer = Number(message.content.match(/[0-9]+/));
          questionnaire.answerCurrent(answer);
          const hasEnded = !questionnaire.next();

          if (!hasEnded) askQuestion(questionnaire, message);
          else {
            deleteMessagesToDelete();
            questionnaireCollector.stop();
          }
        }
      });

      questionnaireCollector.on("end", async () => {
        if (questionnaireStarted && !questionnaire.isInterrupted()) {
          let map = new Map();
          questionnaire.questions.forEach(q => {
            console.log(q.dbColumn, q.answer);
            map.set(q.dbColumn, q.answer);
          });
          let statsId = await this.client.dbstats.addStats(map, args[1].toUpperCase());
          message.channel.send(`Stats entry with id ${statsId} created`);

          statsChannel.send({ embeds: [questionnaire.toMessageEmbed(this.client, "GROUP " + args[0].toUpperCase(), message.member, statsId)] });
          message.author.send({ embeds: [questionnaire.toMessageEmbed(this.client, "GROUP " + args[0].toUpperCase(), message.member, statsId)] });
          if (vcToMove) {
            vcToMove.delete();
          }
          if (textToDelete) {
            textToDelete.delete();
          }
        }
      });

      await message.guild.roles.cache.forEach(role => {
        if (role.name === map[args[0]]) {
          role.delete();
        }
      });
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};
