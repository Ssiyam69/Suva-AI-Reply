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
  onStart: async function ({ api, event, args }) {
    const timeStart = Date.now();
    await api.sendMessage("🏓", event.threadID);
    const ping = Date.now() - timeStart;
    api.sendMessage(`Pong ${ping}ms 🏓`, event.threadID);
  }
};
