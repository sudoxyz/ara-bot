const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const Questionnaire = require("@utils/questionnaire");

module.exports = class addstats extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "addstats",
      description: `Adds Stats\n
                    Available for the stats team
                    Accepted types of stats currently:
                    "STAGE", "UNSCHEDULED", "VC", "SCHEDULED"`,
      usage: `${client.config.prefix}addstats type`,
      aliases: ["as"],
      permLevel: "Stats Team"
    });
  } async run(message, args) {
    let messagesToDelete = [];
    let statsChannel = message.guild.channels.cache.find(channel => channel.id === IDs.chat.successStats);
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
          handleQuestionMessage(questionnaire, m,message.member);
        });
    }

    async function handleQuestionMessage(questionnaire, message, member) {
      try {
        let filter = (reaction) => {
          (["⬅️", "➡️"].includes(reaction.emoji.name)) && (reaction.message.author.id == member.id) && (reaction.message.author.id !== IDs.user.bot);
        };
        if (!questionnaire.isFirst()) await message.react("⬅️");
        if (!questionnaire.isLast()) await message.react("➡️");
        const reactCollector = message.createReactionCollector({filter: filter,
          time: 1000 * 60 * 5 }
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
      } catch (error){console.error;}
    }

    async function deleteMessagesToDelete() {
      await messagesToDelete.forEach((m) => m.delete());
      messagesToDelete = [];
    }

    try {
      let listOfTypes = ["STAGE", "UNSCHEDULED", "VC", "SCHEDULED"];
      if (!args[0]) {
        message.channel.send(`Please specify a role to apply for.\n***Retry with one of these:***\n ${listOfTypes.join("\n")}`);
        return;
      }
      args.forEach(async arg => {
        if ((!listOfTypes.includes(arg.toUpperCase()))) {
          message.channel.send(arg + " is not a stat type you can add for.\n***Retry with one of these:***\n" + listOfTypes.join("\n"));
          return;
      }});
      message.reply(
        "Do you want to add stats? >yes or >no"
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
            map.set(q.dbColumn, q.answer);
          });
          let statsId = await this.client.dbstats.addStats(map, args[0].toUpperCase());
          message.channel.send(`Stats entry with id ${statsId} created`);
          if(!args[0]){
            args[0] = "Stats";
          }
          statsChannel.send({ embeds: [questionnaire.toMessageEmbed(this.client, args[0].toUpperCase(), message.member, statsId)] });
          message.author.send({ embeds: [questionnaire.toMessageEmbed(this.client, args[0].toUpperCase(), message.member, statsId)] });
        }
      });
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};