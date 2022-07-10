const WeebCommand = require("@base/WeebCommand.js");
const defaultError = require('@utils/defaultError');

module.exports = class faq extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "faq",
      description: `DMs you the faq`,
      usage: `${client.config.prefix}faq`,
      aliases: []
    });
  } async run(message) {
    try {
      await message.author.send(`***Am I going to get enough nutrients?***
Eating a range of whole foods is very important! Don't be afraid to try new things. Limiting what you eat is going to set you up for failure.

***Where do you get protein from?***
It's incredibly easy to get enough protein on a plant based diet.
Beans, legumes, tofu, tempeh, seitan, nuts, seeds, mock meats

***Do I need supplements?***
Yes, you should take supplements especially vitamin B12. Vegan vitamin D3 and Omega 3's shounold be considered. #help-me-go-vegan 

***What do I eat instead of eggs?***
Scrambled tofu https://www.noracooks.com/tofu-scramble/ or other vegan egg substitutes.
For baking, flax or chia eggs.

***Are there vegan snacks?***
https://www.peta.org/living/food/top-accidentally-vegan-foods/

***What do I need to look out for on ingredients lists?***
Full list 🌱︲how-to-go-vegan

***Are there other common mistakes to be aware of?***
12 Mistakes Most New Vegans Make
https://www.youtube.com/watch?v=hXsaQhVtHRM

***Resources:***
http://cronometer.com/
A web app for counting calories and tracking your diet and health metrics.

https://www.happycow.net/
Vegan restaurant locator

https://doublecheckvegan.com/
Copy and paste a whole list of ingredients at once from beauty, household, or food products to check for animal-derived ingredients.

https://www.barnivore.com/
Check if your alcohol is vegan

https://www.forksoverknives.com/recipes/
Huge recipes search, can make your grocery list for you. 14 day free trial on meal plans

https://nutritionfacts.org/
The latest in nutrition research delivered in easy to understand videos, blog posts​, and podcasts`);

    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};