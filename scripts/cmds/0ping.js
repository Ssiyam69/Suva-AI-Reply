module.exports = {
    
    config: {
        name: "ping",
        version: "1.0",
        author: "Sudipto",
        role: 0,
        // Short description
        shortDescription: {
            en: "**Ping Command**"
        },
        // Long description
        longDescription: {
            en: "📶 Calculates the bot's response time."
        },
        // Category and usage guide
        category: "**System**",
        guide: {
            en: "Use `{p}ping` to check the bot's response time."
        }
    },
    
    onStart: async function ({ api, event, args }) {
        // Calculate ping
        const ping = Date.now() - event.timestamp;

        // Send message containing bot's ping
        api.sendMessage(`📶 Ping: ${ping}ms`, event.threadID);
    }
};

