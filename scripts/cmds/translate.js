const axios = require('axios');
const defaultEmojiTranslate = "🌐";

module.exports = {
    langs: {
        vi: {
            translateTo: "🌐 Dịch từ %1 sang %2",
            invalidArgument: "❌ Sai cú pháp, vui lòng chọn on hoặc off",
            turnOnTransWhenReaction: `✅ Đã bật tính năng dịch tin nhắn khi thả cảm xúc, thử thả cảm xúc \"${defaultEmojiTranslate}\" vào tin nhắn bắt kỳ để dịch nó (không hỗ trợ tin nhắn của bot)\n Chỉ có thể dịch được những tin nhắn sau khi bật tính năng này`,
            turnOffTransWhenReaction: "✅ Đã tắt tính năng dịch tin nhắn khi thả cảm xúc",
            inputEmoji: "🌀 Hãy thả cảm xúc vào tin nhắn này để đặt emoji đó làm emoji dịch tin nhắn",
            emojiSet: "✅ Đã đặt emoji dịch tin nhắn là %1"
        },
        en: {
            translateTo: "🌐 Translate from %1 to %2",
            invalidArgument: "❌ Invalid argument, please choose on or off",
            turnOnTransWhenReaction: `✅ Turn on translate message when reaction, try to react \"${defaultEmojiTranslate}\" to any message to translate it (not support bot message)\n Only translate message after turn on this feature`,
            turnOffTransWhenReaction: "✅ Turn off translate message when reaction",
            inputEmoji: "🌀 Please react to this message to set that emoji as emoji to translate message",
            emojiSet: "✅ Emoji to translate message is set to %1"
        }
    },

    onStart: async function ({ message, event, threadsData, getLang }) {
        const { body = "" } = event;
        let content;
        let langCodeTrans;
        const langOfThread = await threadsData.get(event.threadID, "data.lang") || global.GoatBot.config.language;

        if (event.messageReply) {
            content = event.messageReply.body;
            let lastIndexSeparator = body.lastIndexOf("->");
            if (lastIndexSeparator == -1)
                lastIndexSeparator = body.lastIndexOf("=>");

            if (lastIndexSeparator != -1 && (body.length - lastIndexSeparator == 4 || body.length - lastIndexSeparator == 5))
                langCodeTrans = body.slice(lastIndexSeparator + 2);
            else
                langCodeTrans = langOfThread;
        }
        else {
            content = event.body;
            let lastIndexSeparator = content.lastIndexOf("->");
            if (lastIndexSeparator == -1)
                lastIndexSeparator = content.lastIndexOf("=>");

            if (lastIndexSeparator != -1 && (content.length - lastIndexSeparator == 4 || content.length - lastIndexSeparator == 5)) {
                langCodeTrans = content.slice(lastIndexSeparator + 2);
                content = content.slice(content.indexOf(args[0]), lastIndexSeparator);
            }
            else
                langCodeTrans = langOfThread;
        }

        if (!content)
            return message.SyntaxError();
        translateAndSendMessage(content, langCodeTrans, message, getLang);
    },

    onChat: async ({ event, threadsData }) => {
        if (!await threadsData.get(event.threadID, "data.translate.autoTranslateWhenReaction"))
            return;
        global.GoatBot.onReaction.set(event.messageID, {
            commandName: 'translate',
            messageID: event.messageID,
            body: event.body,
            type: "translate"
        });
    },

    onReaction: async ({ message, Reaction, event, threadsData, getLang }) => {
        switch (Reaction.type) {
            case "translate": {
                const emojiTrans = await threadsData.get(event.threadID, "data.translate.emojiTranslate") || "🌐";
                if (event.reaction == emojiTrans) {
                    const langCodeTrans = await threadsData.get(event.threadID, "data.lang") || global.GoatBot.config.language;
                    const content = Reaction.body;
                    Reaction.delete();
                    translateAndSendMessage(content, langCodeTrans, message, getLang);
                }
            }
        }
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
    const { text, lang } = await translate(content.trim(), langCodeTrans.trim());
    return message.reply(`${text}\n\n${getLang("translateTo", lang, langCodeTrans)}`);
}
