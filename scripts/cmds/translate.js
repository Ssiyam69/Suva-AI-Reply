const axios = require('axios');

module.exports = {
    config: {
        name: "translate",
        aliases: ["trans"],
        version: "1.4",
        author: "NTKhang",
        countDown: 5,
        role: 0,
        shortDescription: {
            vi: "Dịch văn bản",
            en: "Translate text"
        },
        longDescription: {
            vi: "Dịch văn bản sang ngôn ngữ mong muốn",
            en: "Translate text to the desired language"
        },
        category: "utility",
        guide: {
            vi: "{pn} <văn bản>: Dịch văn bản sang ngôn ngữ của box chat bạn hoặc ngôn ngữ mặc định của bot\n{pn} <văn bản> -> <ISO 639-1>: Dịch văn bản sang ngôn ngữ mong muốn",
            en: "{pn} <text>: Translate text to the language of your chat box or the default language of the bot\n{pn} <text> -> <ISO 639-1>: Translate text to the desired language"
        }
    },

    onStart: async function ({ message, event, args, threadsData, getLang, commandName }) {
        const content = args.join(' ');
        const langCodeTrans = 'bn'; // Default translation language code

        if (!content) return message.SyntaxError();

        translateAndSendMessage(content, langCodeTrans, message, getLang);
    }
};

async function translate(text, langCode) {
    const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${langCode}&dt=t&q=${encodeURIComponent(text)}`);
    return {
        text: res.data[0].map(item => item[0]).join(''),
        lang: res.data[2]
    };
}

async function translateAndSendMessage(content, langCodeTrans, message, getLang) {
    try {
        const { text, lang } = await translate(content.trim(), langCodeTrans.trim());
        return message.reply(`${text}\n\nTranslated from ${lang} to ${langCodeTrans}`);
    } catch (error) {
        console.error('Error translating text:', error);
        return message.reply('An error occurred while translating the text. Please try again later.');
    }
}
