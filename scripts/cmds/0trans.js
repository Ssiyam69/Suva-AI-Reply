const axios = require('axios');
const defaultEmojiTranslate = "🌐";

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
			vi: "   {pn} <văn bản>: Dịch văn bản sang ngôn ngữ của box chat bạn hoặc ngôn ngữ mặc định của bot"
				+ "\n   {pn} <văn bản> -> <ISO 639-1>: Dịch văn bản sang ngôn ngữ mong muốn"
				+ "\n   hoặc có thể phản hồi 1 tin nhắn để dịch nội dung của tin nhắn đó"
				+ "\n   Ví dụ:"
				+ "\n    {pn} hello -> vi"
				+ "\n   {pn} -r [on | off]: Bật hoặc tắt chế độ tự động dịch tin nhắn khi có người thả cảm xúc vào tin nhắn"
				+ "\n   {pn} -r set <emoji>: Đặt emoji để dịch tin nhắn trong nhóm chat của bạn",
			en: "   {pn} <text>: Translate text to the language of your chat box or the default language of the bot"
				+ "\n   {pn} <text> -> <ISO 639-1>: Translate text to the desired language"
				+ "\n   or you can reply a message to translate the content of that message"
