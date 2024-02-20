module.exports = {
  config: {
    name: "ping",
    aliases: ["ms"],
    version: "1.0",
    author: "Sandu",
    role: 0,
    shortDescription: {
      en: "Displays the current ping of the bot's system."
    },
    longDescription: {
      en: "Displays the current ping of the bot's system."
    },
    category: "System",
    guide: {
      en: "Use {p}ping to check the current ping of the bot's system."
    }
  },
  onStart: async function ({ api, event }) {
    const startTime = Date.now();
    await api.sendMessage("Pinging...", event.threadID);
    
    api.listenMqtt(async (err, message) => {
      if (message.type === "message" && message.senderID === api.getCurrentUserID() && message.threadID === event.threadID) {
        const latency = Date.now() - startTime;
        await api.sendMessage(`Pong: ${latency}ms 🏓`, event.threadID);
      }
    });
  }
};
