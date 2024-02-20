const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Function to convert bytes to megabytes (MB)
function byte2mb(bytes) {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(bytes, 10) || 0;
    while (n >= 1024 && ++l) n = n / 1024;
    return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}

// Function to download media from an Instagram post or reel
async function downloadMedia(postUrl, api, threadID) {
    try {
        // Fetch HTML content of the post page
        const response = await axios.get(postUrl);
        const html = response.data;
        const $ = cheerio.load(html);

        // Find image and video URLs
        const mediaUrls = [];
        $('body').find('meta').each(function () {
            const property = $(this).attr('property');
            if (property === 'og:image' || property === 'og:video') {
                mediaUrls.push($(this).attr('content'));
            }
        });

        // Create a directory to store downloaded media
        const downloadDir = path.join(__dirname, 'instagram_media');
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        // Download media
        mediaUrls.forEach(async (url, index) => {
            try {
                const ext = url.split('.').pop();
                const mediaFilename = `media_${index}.${ext}`;
                const mediaPath = path.join(downloadDir, mediaFilename);
                const writer = fs.createWriteStream(mediaPath);
                const response = await axios({
                    url: url,
                    method: 'GET',
                    responseType: 'stream'
                });
                response.data.pipe(writer);
                await new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });
                console.log('Media downloaded:', mediaFilename);
                // Send media to chat
                api.sendMessage({ body: 'Here is the media:', attachment: fs.createReadStream(mediaPath) }, threadID);
            } catch (error) {
                console.error('Error downloading media:', error);
            }
        });
    } catch (error) {
        console.error('Error fetching post page:', error);
    }
}

module.exports = {
    config: {
        name: "inst",
        version: "1.0",
        author: "sudipto",
        countDown: 1,
        role: 0,
        shortDescription: "Downloads images and videos from an Instagram post or reel.",
        longDescription: "This command downloads all images and videos from a public Instagram post or reel.",
        category: "harem kings",
        guide: "~ {{post_url}}",
        envConfig: {
            deltaNext: 5
        }
    },

    onStart: async function ({ api, event, args }) {
        const postUrl = args[0]; // Extract post URL from command arguments
        if (!postUrl || !postUrl.startsWith('https://www.instagram.com/')) {
            api.sendMessage("Please provide a valid Instagram post or reel URL.", event.threadID);
            return;
        }
        downloadMedia(postUrl, api, event.threadID);
    }
};
