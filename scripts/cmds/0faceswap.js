module.exports = {
  config: {
    name: "faceswap",
    aliases: ["swap", "exchange"],
    version: "1.0",
    author: 'Samir Œ',
    shortDescription: "Swap faces in two images",
    longDescription: "Swap faces in two images provided as attachments.",
    category: "𝗙𝗨𝗡"
  },

  onStart: async function({ message, event, api }) {
    try {
      // Set the 🕜 clock emoji reaction to the message that triggered the ~faceswap command
      api.setMessageReaction("🕜", event.messageID, (err) => {
        if (err) {
          console.error("Error setting emoji reaction:", err);
        }
      }, true);

      if (event.type != "message_reply") {
        return message.reply("Please reply to a message with two images attached.");
      }

      let links = [];
      for (let attachment of event.messageReply.attachments) {
        links.push(attachment.url);
      }

      if (links.length < 2) {
        return message.reply("Please ensure there are exactly two images attached.");
      }

      const shortLink1 = await global.utils.uploadImgbb(links[0]);
      const Url1 = shortLink1.image.url;

      const shortLink2 = await global.utils.uploadImgbb(links[1]);
      const Url2 = shortLink2.image.url;

      let swapface = `https://apis-samir.onrender.com/faceswap?sourceUrl=${Url1}&targetUrl=${Url2}`;
      const stream = await global.utils.getStreamFromURL(swapface);

      // Set the ✅ green tick emoji reaction to the input message if the process is successful
      api.setMessageReaction("✅", event.messageID, async (err) => {
        if (err) {
          console.error("Error setting emoji reaction:", err);
        } else {
          // Once the green tick emoji reaction is set, send the message with the swapped image attachment
          await api.sendMessage({
            body: "✅ Here is your swapped image:",
            attachment: stream
          }, event.threadID);
        }
      }, true);
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while processing the face swap.");
    }
  }
};
