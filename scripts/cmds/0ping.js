module.exports = {
    config: {
        name: "ping",
        version: "1.0",
        author: "@move_the_simp",
        countDown: 0,
        role: 0,
        shortDescription: {
            en: "Check latency"
        },
        longDescription: {
            en: "Check the latency of the bot"
        },
        category: "utility",
        guide: {
            en: "{pn}: Check the latency of the bot"
        }
    },

    onStart: async function ({ message }) {
        const sentMessage = await message.channel.send("🏓 Pong!");
        const latency = sentMessage.createdTimestamp - message.createdTimestamp;
        return sentMessage.edit(`🏓 Pong: ${latency}ms`);
    }
};
