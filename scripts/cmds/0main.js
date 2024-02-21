const axios = require("axios");
const ytdl = require('ytdl-core');
const ytSearch = require("yt-search")
const fs = require('fs-extra');
const fetch = require('node-fetch');

const previousImages = new Set();
let voice = false;

module.exports = {
  config: {
    name: "suva",
    version: "1.0",
    author: "ntfsadnan",
    countDown: 5,
    role: 0,
    shortDescription: "Chat with suva",
    longDescription: {
      vi: "",
      en: "Chat with suva",
    },
    category: "legend",
    guide: {
      vi: "{pn} [on | off]: enable/disable suva chat\n{pn} <word>: chat with suva\nstart with a simple: hi",
      en: "{pn} [on | off]: enable/disable suva chat\n{pn} <word>: chat with suva\nstart with a simple: hi",
    },
  },

  langs: {
    vi: {
      turnedOn: "ok, I'm on",
      turnedOff: "ok, I'm off",
      chatting: "Already chatting with suva... :) ",
      error: "I'm sorry, there might be an error. Please try again.",
    },
    en: {
      turnedOn: "ok, I'm on",
      turnedOff: "ok, I'm off",
      turnedVoice: "I will now reply in voice!",
      turnedVoiceOff: "I will now reply in text!",
      chatting: "Already chatting with suva... :) ",
      error: "I'm sorry, there might be an error. Please try again.",
    },
  },

  onStart: async function ({ args, threadsData, message, event, getLang }) {
    if (args[0] === "on" || args[0] === "off") {
      await threadsData.set(event.threadID, args[0] === "on", "settings.suva");
      return message.reply(args[0] === "on" ? getLang("turnedOn") : getLang("turnedOff"));
    }

    if (args[0] === "voice" || args[0] === "voiceoff") {
        voice = args[0] === "voice";
        await threadsData.set(event.threadID, voice, "settings.voice");
        return message.reply(voice ? getLang("turnedVoice") : getLang("turnedVoiceOff"));
    }


  },

  onChat: async function ({ args, message, threadsData, event, isUserCallCommand, getLang, api }) {

    let userMSG;
    if (!isUserCallCommand && (await threadsData.get(event.threadID, "settings.suva"))) {

      if (event.attachments.length > 0) {
        const attached = event.attachments[0];
        if (attached.type === "audio"){
          const audioUrl = attached.url;
          console.log('Attachments found');
          console.log(audioUrl);
          const encodedUrl = encodeURIComponent(audioUrl);

          // Send the audioAttachmentUrl to the transcription endpoint
          const transcriptionUrl = `https://suva-vtt.onrender.com/transcribe?key=sudiptoisgay&url=${encodedUrl}`;

          try {
            // Fetch response using transcriptionUrl and set userMSG to the fetched content
            console.log('ping2');
            const response = await axios.get(transcriptionUrl);
            userMSG = response.data.text;
          } catch (error) {
            console.error('Error fetching transcription:', error);
            // Handle errors here if necessary
            return;
          }
        } else {
          return;
        }
      } else {
        if (event.type === "message_reply" && event.messageReply && event.messageReply.attachments.length > 0) {
          const replyAttachment = event.messageReply.attachments[0];
          
          // Check if the reply attachment type is "photo" (case-sensitive)
          if (replyAttachment.type === "photo") {
            // Handle the case where it's a message reply with a photo attachment
            console.log('Message reply with a photo attachment');
            console.log('Photo URL:', replyAttachment.url);
            // Add your logic for processing the photo here
            
            const uriatturl = encodeURIComponent(replyAttachment.url);
            const imgprompt = args.join(" ");
            console.log(imgprompt);
            const visionUrl = `https://suva-vision.onrender.com/vision?key=sudiptoisgay&prompt=${imgprompt}&url=${uriatturl}`;
            const response = await axios.get(visionUrl);
            api.sendMessage(response.data.result, event.threadID, event.messageID);

            
          }
          return;
        }
        userMSG = args.join(" ");
      }

      //const filtertxt = fs.readFileSync('filter.txt', 'utf8');
      const userMessage = `${userMSG}`;



      try {
        const response = await axios.get(`https://ntf-chat-filter.onrender.com/filter?key=sudiptoisgay&prompt=${encodeURIComponent(userMessage.replace(/\n/g, " "))}`);
        const responseData = JSON.parse(response.data.result);
        console.log(responseData);


        /*if (responseData.gk && responseData.gk !== "null"){
          const gk = responseData.gk;
          const ans = await axios.get(`https://chatgayfeyti.archashura.repl.co?gpt=${encodeURIComponent(gk.replace(/\n/g, " "))}`);
          api.sendMessage(ans.data.content, event.threadID);
        }*/

        if (responseData.see && responseData.see !== "null") {
                try {
                        // Replace with your Google API key and CSE ID
                  const name = responseData.see;

                  const googleApiKey = 'AIzaSyAsBSaIX1gEwwNaTRzB2VpTgigEveq4N-o';
                        const googleCseId = '138b2f6dab3ef4734';

                        // Modify the URL to use the Google Custom Search API
                        const response = await axios.get(
                                "https://www.googleapis.com/customsearch/v1",
                                {
                                        params: {
                                                key: googleApiKey,
                                                cx: googleCseId,
                                                q: `${name}`,
                                                searchType: "image",
                                        },
                                }
                        );

                        const data = response.data;

                        if (data.items && data.items.length > 0) {
                                const images = data.items;

                                // Find the first image that hasn't been sent before
                                let imageURL = null;
                                for (const image of images) {
                                        if (!previousImages.has(image.link)) {
                                                imageURL = image.link;
                                                previousImages.add(image.link);
                                                break;
                                        }
                                }

                                if (imageURL) {
                                        // Fetch the image as a readable stream
                                        const imageResponse = await axios.get(imageURL, {
                                                responseType: "stream",
                                        });
                                        const imageStream = imageResponse.data;

                                        // Send the image as an attachment
                                        const message = {
                                                body: "",
                                                attachment: imageStream,
                                        };

                                        api.sendMessage(message, event.threadID, event.messageID);
                                } else {
                                        api.sendMessage(
                                                `No new images found for "${name}"`,
                                                event.threadID,
                                                event.messageID
                                        );
                                }
                        } else {
                                api.sendMessage(`No images found for "${name}"`, event.threadID, event.messageID);
                        }
                } catch (error) {
                        console.error("Error:", error);
                        // Handle errors here if necessary
                }
        }






        if (responseData.sing && responseData.sing !== "null") {
          try {
            const searchResults = await ytSearch(responseData.sing);

            const video = searchResults.videos[0];
            const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
            const stream = ytdl(videoUrl, { filter: 'audioonly' });


            const fileName = 'music.mp3';
            const filePath = __dirname + `/cache/${fileName}`;

            stream.pipe(fs.createWriteStream(filePath));

            stream.on('end', () => {
                console.info('[DOWNLOADER] Downloaded');

               if (fs.statSync(filePath).size > 26214400) {
                fs.unlinkSync(filePath);
                api.sendMessage('[ERR] The file could not be sent because it is larger than 25MB.', event.threadID);
               }

              const message = {
                 body: ``,
                 attachment: fs.createReadStream(filePath)
               };

              api.sendMessage(message, event.threadID, () => {
                fs.unlinkSync(filePath);
               });
            });
          } catch (error) {
            console.error('[ERROR]', error);
            api.sendMessage('An error occurred while processing the command.', event.threadID);
          }
        }

        if (responseData.gen && responseData.gen !== "null"){
          const prompt = responseData.gen;
          const API = `https://suva-gen.onrender.com/generate?key=sudiptoisgay&prompt=${encodeURIComponent(prompt)}`;
          const imageStream = await global.utils.getStreamFromURL(API);
          api.sendMessage({ attachment: imageStream}, event.threadID);
          /*return message.reply({
            attachment: imageStream
          });*/
        }

        //console.log(responseData)




        if (responseData.complement && responseData.complement !== "null") {


          // Assuming 'data' contains the content from data.txt
          const chat = responseData.complement;
          const ans = await axios.get(`https://suva.onrender.com/gpt?key=sudiptoisgay&prompt=${encodeURIComponent(chat.replace(/\n/g, " "))}`);
          //isVoiceEnabled = await threadsData.get(event.threadID, "settings.voice");

          // Inside the onChat function
if (voice) {
  const prompt = ans.data.result;
  const API = `https://kind-underwear-ox.cyclic.app/generate?key=sudiptoisgay&prompt=${encodeURIComponent(prompt)}`;
  const VoiceStream = await global.utils.getStreamFromURL(API);
  api.sendMessage({ body: ans.data.result }, event.threadID, null, { messageReply: event.messageID }); // Using messageReply to directly reply to the original message
} else {
  api.sendMessage(ans.data.result, event.threadID, null, { messageReply: event.messageID }); // Using messageReply to directly reply to the original message
}


          /*const encodedComplement = encodeURIComponent(responseData.complement);
          const simSimiResponse = await axios.get(`https://api.simsimi.net/v2/?text=${encodedComplement}&lc=en&cf=false&name=Eri&key=CIQHPE1cSfZFev-EhpwRbndXxcD9YGdTlbGReM`);
          const simSimiData = simSimiResponse.data;

          if (simSimiData.success) {
            api.sendMessage(simSimiData.success, event.threadID);
          } else {
            return message.reply(getLang("chatting"));
          }*/
        }




        if (responseData.video && responseData.video !== "null") {
          const query = responseData.video;
          try {
            const apiKey = 'AIzaSyBCsuQ6EFUCR22TqRYAQWewMCCUyMxONQc';
            const searchApiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${query}&part=snippet&type=video`;

            fetch(searchApiUrl)
              .then(response => response.json())
              .then(data => {
                // Handle the response data (list of videos)
                const videos = data.items;

                // Check if there are any videos in the response
                if (videos.length > 0) {
                  // Grab the videoId of the first video
                  const firstVideoId = videos[0].id.videoId;
                  console.log('First Video ID:', firstVideoId);

                  // Use the videoId in the second part of the script
                  const youtubeLink = `https://www.youtube.com/watch?v=${firstVideoId}`;

                  const fs = require('fs');
                  const ytdl = require('ytdl-core');
                  const cacheDirectory = './cache'; // Change this to your cache directory

                  // Ensure the cache directory exists
                  if (!fs.existsSync(cacheDirectory)) {
                    fs.mkdirSync(cacheDirectory);
                  }

                  console.log('Downloading ..... ');

                  // Specify format options to include both video and audio with a specific quality (480p)
                  const options = {
                    quality: 'lowest', // Choose the lowest quality available (480p)
                    filter: 'audioandvideo', // Include both audio and video streams
                  };

                  const outputFilePath = `${cacheDirectory}/output.mp4`;

                  const videoStream = ytdl(youtubeLink, options);
                  const fileStream = fs.createWriteStream(outputFilePath);

                  videoStream.pipe(fileStream);

                  fileStream.on('finish', () => {
                    console.log('Download complete.');

                    // Now that the video is downloaded, send the message with the attached video stream
                    const videoReadStream = fs.createReadStream(outputFilePath);

                    // Check if the file exists before attempting to send
                    if (fs.existsSync(outputFilePath)) {
                      api.sendMessage({
                        body: '',
                        attachment: videoReadStream,
                      }, event.threadID);

                      // Optionally, you can delete the downloaded file after sending

                    } else {
                      console.error(`File not found: ${outputFilePath}`);
                    }
                  });

                  fileStream.on('error', (error) => {
                    console.error('Error:', error);
                  });
                } else {
                  console.log('No videos found for the query.');
                }
              })
              .catch(error => console.error('Error:', error));

          } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while fetching lyrics!", event.threadID, event.messageID);
          }
        }


      } catch (error) {
        console.error("Error fetching data from API:", error);
        return message.reply(getLang("error"));
      }
    }
  },
};
