module.exports = {
  config: {
    name: "ping",
    aliases: ["ms"],
    version: "1.0",
    author: "@move_the_simp",
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
    await api.markThreadAsRead(event.threadID); // Marking thread as read to simulate activity
    const timeStart = Date.now();
    const ping = Date.now() - timeStart;
    api.sendMessage(`Pong: ${ping}ms 🏓`, event.threadID);
  }
};
