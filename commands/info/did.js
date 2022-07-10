const WeebCommand = require('@base/WeebCommand.js');
const defaultError = require('@utils/defaultError');
const { MessageEmbed } = require('discord.js');

module.exports = class did extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'did',
      description:
        'Gives detailed information about Dissociative Identity Disorder, Other Specified Dissociative Disorders, and the Alter-function bots.',
      usage: `${client.config.prefix}did [full | bot | explain | fictives | typing]`,
      aliases: ['osdd', 'didosdd'],
    });
  }

  async run(message, args) {
    return message.reply({
      embeds: [
        new MessageEmbed()
          .setAuthor(
            'Animal Rights Advocates Team',
            'https://64.media.tumblr.com/c16754a0bf72f2b8a1c0f36b7299a825/5180b22fc7b7c8ba-d1/s640x960/7d89d0e9cf9c9ca11d13b68b6e8d63ad598f5e80.png',
          )
          .setColor('RANDOM')
          .setDescription(
            [
              'extra',
              'x',
              'explain',
              'e',
              'ex',
              'did',
              'd',
              'osdd',
              'o',
              'did/osdd',
              'fictive',
              'fictives',
              'f',
              'fic',
              'typing',
              't',
              'quirk',
              'quirks',
              'q',
            ].some((argument) => argument === args[0])
              ? ''
              : `Some of you might have seen bots in chats and are wondering what that means and maybe even asking yourselves how or if someone can use them.\n\nPeople with [Dissociative Identity Disorder](https://en.wikipedia.org/wiki/Dissociative_identity_disorder) or [OSDD](https://en.wikipedia.org/wiki/Other_specified_dissociative_disorder) can use this bot to engage in conversations within the server. Because someone with [DID/OSDD](https://dissociation-station.carrd.co/#i) has [over one personality or unique identity](http://traumadissociation.com/alters), just using one account is not always possible, as the number of identities can vary from 2 to even thousands. On some days, they might not identify with their primary account. To make their life and activity on ARA easier, we have put these bots in place. Like any other person on ARA, such users are to be treated with dignity and respect.\n\nIf you want to know more about [DID/OSDD](https://www.isst-d.org/resources/dissociation-faqs/), we encourage [independent research](https://www.psychiatry.org/patients-families/dissociative-disorders/what-are-dissociative-disorders) or polite dialogue on the topic in a way that does not violate the medical privacy of other users.\n\nIf you are a system, please directly message <@575252669443211264> to get access to the alter tools.`,
          )
          .setFields(
            [
              [
                undefined,
                'explain',
                'e',
                'ex',
                'did',
                'd',
                'osdd',
                'o',
                'did/osdd',
                'full',
                'all',
                'a',
              ].some((argument) => argument === args[0])
                ? {
                    name: 'What is DID?',
                    value:
                      '[Dissociative Identity Disorder (DID)](https://icd.who.int/browse11/l-m/en#!/http%3A%2F%2Fid.who.int%2Ficd%2Fentity%2F988400777) previously known as [Multiple Personality Disorder](https://www.theravive.com/therapedia/dissociative-identity-disorder-(did%29-dsm--5-300.14-(f44.81%29), is a [dissociative disorder](https://skepticink.com/gps/2013/10/22/dissociative-identity-disorder-in-the-dsm-5/) that is characterized by over one sense of identity within a single body. We commonly refer to these alternate identities as [“alters”](https://did-research.org/did/alters/) or “parts”. We often refer to a person with DID as a “system”. The common causes of the disorder are [long-term traumatic events](https://www.tandfonline.com/doi/pdf/10.1080/20008198.2019.1705599), [and/or abuse occurring in childhood, usually before the age of 6-9](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2719457/).\n\nAlso, please remember that alters are just like any person on ARA. Alters or not, treat everyone with dignity and respect.',
                  }
                : undefined,
              [
                'extra',
                'x',
                'fictive',
                'fictives',
                'f',
                'fic',
                'full',
                'all',
                'a',
              ].some((argument) => argument === args[0])
                ? {
                    name: 'Fictive Alters',
                    value: `Individuals with DID can form alters based on [fictional characters or famous people](http://traumadissociation.com/alters#fictive). This kind of alter is also known as an [“introject”](http://traumadissociation.com/alters#introject). Introjects form when the brain sees qualities it needs in a fictional character and projects inwards. It's important to remember that introjects are not their sources nor can systems control where they are based on. Please do not compare an introject to their source or attack them because of their source. You also shouldn't treat them as your comfort character.\n\n${
                      ['extra', 'fictives'].some(
                        (argument) => argument === args[0],
                      )
                        ? 'A special reminder:\n\nNot all fictive alters and introjects are comfortable with discussing their sources, and not all of them have the same boundaries, even if they are from the same system. Thus, it is always the best to ask about their boundaries instead of assuming that every fictive has the same boundaries.'
                        : ''
                    }`,
                  }
                : undefined,
              [
                'extra',
                'x',
                'typing',
                't',
                'quirk',
                'quirks',
                'q',
                'full',
                'all',
                'a',
              ].some((argument) => argument === args[0])
                ? {
                    name: 'Typing Quirks',
                    value: `Having a typing quirk helps people to be more comfortable texting/speaking. Non-alters aka singlets, can also have a typing quirk, though it is more common among systems and neurodivergent people. You can ask for a translation from the alter themselves or from someone else that can help with translating if you cannot understand their sentence.\n\n${
                      ['extra', 'typing'].some(
                        (argument) => argument === args[0],
                      )
                        ? 'Example of typing quirks:\n\n```Thiis iis hoow ii typee```\n\n```7h15 1s h0w 1 7yp3```\n\n```⏁⊑⟟⌇ ⟟⌇ ⊑⍜⍙ ⟟ ⏁⊬⌿⟒```\n\nAll of these say “This is how I type”.'
                        : ''
                    }`,
                  }
                : undefined,
            ].filter((field) => field),
          )
          .setFooter(
            'Thank You To Vulcan For The Above Information - Run ?𝚍𝚒𝚍 𝚏𝚞𝚕𝚕 for more details',
            message.guild.iconURL(),
          )
          .setThumbnail(
            'https://www.nami.org/NAMI/media/NAMI-Media/BlogImageArchive/2021/DID-blog.jpg',
          )
          .setTitle('Dissociative Identity Disorder/OSDD in ARA')
          .setURL(
            'https://www.nami.org/About-Mental-Illness/Mental-Health-Conditions/Dissociative-Disorders',
          ),
      ],
    });
  }
};
