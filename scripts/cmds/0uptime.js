// Modified Code
const os = require('os');

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up", "upt"],
    version: "1.0",
    author: "@move_the_simp",
    role: 0,
    shortDescription: {
      en: "Displays the uptime of the bot."
    },
    longDescription: {
      en: "Displays the amount of time that the bot has been running for, along with OS information and available RAM."
    },
    category: "System",
    guide: {
      en: "Use {p}uptime to display the uptime of the bot, along with OS information and available RAM."
    }
  },
  onStart: async function ({ api, event, args }) {
    // Calculate bot's uptime
    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));

    // Get OS information
    const osInfo = `OS: ${os.platform()} ${os.release()}`;
    
    // Get total memory and free memory
    const totalMemory = os.totalmem() / (1024 * 1024 * 1024); // Convert bytes to GB
    const freeMemory = os.freemem() / (1024 * 1024 * 1024); // Convert bytes to GB
    
    // Construct RAM information message
    const ramInfo = `Available RAM: ${freeMemory.toFixed(2)} GB out of ${totalMemory.toFixed(2)} GB`;

    // Construct uptime message
    const uptimeString = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;

    // Calculate ping
    const ping = Date.now() - event.timestamp;

    // Send message containing bot's uptime, OS information, RAM information, and ping with one line gap
    api.sendMessage(`Suva has been running for ${uptimeString} 🏃‍♀️\n\n${osInfo}\n\n${ramInfo}\n\n   🌸 Suva AI 🌸  `, event.threadID);
  }
};
