const Discord = require('discord.js');

module.exports = class Questionnaire {
  questions = [];
  currentQuestionIdx = 0;
  interrupted = false;

  constructor() {
    this.questions = [
      {
        question: "How many said that they went vegan during outreach:",
        dbColumn: "saidTheyWentVegan",
        answer: 0
      },
      {
        question: "How many seriously considered being vegan:",
        dbColumn: "seriouslyConsidered",
        answer: 0
      },
      {
        question: "How many conceded an antivegan position:",
        dbColumn: "concededAntiVeganPosition",
        answer: 0
      },
      {
        question: "How many thanked you for conversation:",
        dbColumn: "thankedYou",
        answer: 0
      },
      {
        question: "How many people said they would watch a vegan documentary:",
        dbColumn: "wouldWatchDocumentary",
        answer: 0
      },
      {
        question: "How many got educated on veganism and or practices in the animal industry:",
        dbColumn: "changedPerspective",
        answer: 0
      }
    ];
  }

  getAllQuestions() {
    return this.questions;
  }

  getCurrentQuestion() {
    return this.questions[this.currentQuestionIdx].question;
  }

  getCurrentAnswer() {
    return this.questions[this.currentQuestionIdx].answer;
  }

  answerCurrent(value) {
    this.questions[this.currentQuestionIdx].answer = value;
  }

  next() {
    if (this.isLast()) return false;
    this.currentQuestionIdx++;
    return true;
  }

  previous() {
    if (this.isFirst()) return false;
    this.currentQuestionIdx--;
    return true;
  }

  isFirst() {
    return this.currentQuestionIdx === 0;
  }

  isLast() {
    return this.currentQuestionIdx === this.questions.length - 1;
  }

  isInterrupted() {
    return this.interrupted;
  }

  interrupt() {
    this.interrupted = true;
  }

  toMessageEmbed(client, group, leader, id) {
    const embed = new Discord.MessageEmbed();

    const avatarURL = client.user.avatarURL() || client.user.defaultAvatarURL;

    embed.setColor("#46d130");
    embed.setAuthor("Animal Rights Advocates", avatarURL);
    embed.setTitle("Group " + group + " statistics ID: " + id);
    embed.addField("Session leader", "\t" + leader.toString());

    let outcomes = "Survey Not Completed";
    if (this.questions[0].answer != 0)
      outcomes = `${this.questions[0].question} \`${this.questions[0].answer}\``;
    for (let i = 1; i < this.questions.length; i++) {
      if (this.questions[i].answer != 0)
        outcomes += `\n${this.questions[i].question} \`${this.questions[i].answer}\``;
    }

    embed.addField("Outcomes", outcomes);
    embed.setFooter("ARAbot", avatarURL);
    embed.setTimestamp();

    return embed;
  }

  toString() {
    return JSON.stringify(this.questions, null, 2);
  }
};