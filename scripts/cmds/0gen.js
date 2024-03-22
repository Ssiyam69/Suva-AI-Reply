const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "gen",
    credits: "sadnan",
    category: "ai"
  },

  onStart: async function({ api, event, args }) {
    let { threadID, messageID } = event;
    let query = args.join(" ");
    if (!query) return api.sendMessage("Please provide a text/query", threadID, messageID);

    let path = __dirname + `/cache/imagination.png`;

    try {
      const response = await axios.get(`https://suva-gen.onrender.com/generate?key=sudiptoisgay&prompt=${query}`, {
        responseType: "arraybuffer",
      });

      fs.writeFileSync(path, Buffer.from(response.data, "binary"));

      api.sendMessage({
        body: "Here's your imagination",
        attachment: fs.createReadStream(path)
      }, threadID, () => fs.unlinkSync(path), messageID);
    } catch (error) {
      console.error("Error:", error);
      api.sendMessage("Sorry, couldn't generate the image. Please try again later.", threadID, messageID);
    }
  }
};
