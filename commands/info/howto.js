const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');

module.exports = class howto extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "howto",
      description: `DMs you the howto`,
      usage: `${client.config.prefix}howto`,
      aliases: []
    });
  } async run(message) {
    try {
      await message.author.send(`­***How to go vegan­***

      ­***1) Our advice:­***
      Make it as easy as you can for yourself 🐮 🌱 
      Keep making all of your favorite dishes just veganize them!
      Being vegan extends further than diet - Things like leather, fur, aquariums & zoos, animal testing (buy cruelty free), etc. 

      ­­­­***2) Supplements: Caution as some supplements may contain gelatin (not vegan)­***

      B12   Necessary!!!
      - 2000 mcg weekly supplement
      - Fortified foods like plant milks or nutritional yeast. Just make sure you're getting enough!

      Vitamin D
      (D3 preferred) - Make sure it says VEGAN on it or it will be derived from sheeps wool.

      Omega 3s
      Keep these in fridge to keep from degrading. DO NOT HEAT OR OMEGA 3's WILL NOT SURVIVE

      Sources:
      -Walnuts, Chia seeds, Hemp seeds, Flax seeds, Algal (Algae) ALA / DHA supplement

      ­­***3) Read the ingredients ­***
      Common non-vegan food additives:

      Beeswax and Honey
      Milk powder
      Casein and Whey
      Gelatin
      Isinglass
      L. Cysteine
      Lanolin
      Carmine

      ­­***4) Documentaries­***

      Ethics / Industry standard:
      -Dominion 2018 https://invidious.namazso.eu/watch?v=LQRAfJyEsko&listen=0
      -Earthlings - https://invidious.namazso.eu/watch?v=8gqwpfEcBjI
      -Farm To Fridge - https://invidious.namazso.eu/watch?v=ju7-n7wygP0
      -Land of Hope and Glory - https://invidious.namazso.eu/watch?v=dvtVkNofcq8

      Environment:
      -Cowspiracy (Netflix)
      -Seaspiracy (Netflix)

      Health:
      -Game Changers (Netflix)
      -Forks over Knives (Amazon Prime)
      -What the health (Netflix) 
      `);

    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};