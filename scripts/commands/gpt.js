
const fs = require("fs");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "gpt",
    version: "0.0.2",
    permission: 0,
    prefix: true,
    credits: "Nayan",
    description: "chat with gpt",
    category: "user",
    usages: "",
    cooldowns: 5,
  },

  start: async function ({ nayan, events, args, NAYAN }) {
    try {
      const prompt = args.join(" ");
      NAYAN.react("🔍")
      const apis = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json')
      const n = apis.data.gpt4
      const { data } = await axios.post(n+"/gpt4", { prompt });

      if (!data.data.response) {
        const imgUrl = data.data.imgUrl;
        const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
        const image = await jimp.read(response.data);
        const outputPath = "./dalle3.png";

        await image.writeAsync(outputPath);
        const attachment = fs.createReadStream(outputPath);
        NAYAN.react("✔️")

        await nayan.sendMessage(
          {
            body: `🖼️ Here is your generated image: "${prompt}"`,
              attachment,
          },
          events.threadID,
          events.messageID
        );

        
        fs.unlinkSync(outputPath);
      } else {
        NAYAN.react("✔️")
        nayan.reply(data.data.response, events.threadID, events.messageID);
      }
    } catch (error) {
      console.error("Error:", error);
      nayan.reply("An error occurred while processing your request.", events.threadID, events.messageID);
    }
  },
};
