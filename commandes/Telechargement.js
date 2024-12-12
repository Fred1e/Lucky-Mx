const { luckycmd } = require("../framework/luckycmd");
const axios = require("axios");
const ytsr = require('@distube/ytsr');

luckycmd(
    {
        nom_cmd: "song",
        classe: "Download",
        react: "🎵",
        desc: "Downloads a song from YouTube with a search term or YouTube link",
        alias: ["play"],
    },
    async (ms_org, lucky, cmd_options) => {
        const { repondre, arg, ms } = cmd_options;

        if (!arg.length) {
            return await lucky.sendMessage(ms_org, { text: "Please specify a song title or YouTube link." });
        }

        const query = arg.join(" ");
        const isYouTubeLink = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(arg[0]);

        try {
            let videoInfo;

            if (isYouTubeLink) {
                videoInfo = { url: query }; // Si c'est un lien, on prend directement l'URL
            } else {
                const searchResults = await ytsr(query, { limit: 1 });
                if (searchResults.items.length === 0) {
                    return await lucky.sendMessage(ms_org, { text: "No results found for this search." });
                }
                const song = searchResults.items[0];
                videoInfo = {
                    url: song.url,
                    title: song.name,
                    views: song.views,
                    duration: song.duration,
                    thumbnail: song.thumbnail
                };
            

            const caption = `╭─── 〔 LUCKY-MD SONG 〕 ──⬣
⬡ Titre: ${videoInfo.title}
⬡ URL: ${videoInfo.url}
⬡ Vues: ${videoInfo.views}
⬡ Durée: ${videoInfo.duration}
╰───────────────────⬣`;

            await lucky.sendMessage(ms_org, { image: { url: videoInfo.thumbnail }, caption: caption });
            }
            // Downloading Audio
            const audioResponse = await axios.get(`https://ironman.koyeb.app/ironman/dl/yta?url=${videoInfo.url}`, {
                responseType: 'arraybuffer'
            });

            await lucky.sendMessage(ms_org, {
                audio: Buffer.from(audioResponse.data),
                mimetype: 'audio/mp4',
                fileName: `${videoInfo.title}.mp3`
            }, { quoted: ms });

        } catch (error) {
            console.error("Error downloading song :", error.message || error);
            await lucky.sendMessage(ms_org, { text: "Error downloading song." });
        }
    }
);

luvky(
    {
        nom_cmd: "video",
        classe: "Download",
        react: "🎥",
        desc: "Downloads a video from YouTube with a YouTube search term or link"
    },
    async (ms_org, lucky, cmd_options) => {
        const { repondre, arg, ms } = cmd_options;

        if (!arg.length) {
            return await lucky.sendMessage(ms_org, { text: "Please specify a video title or YouTube link." });
        }

        const query = arg.join(" ");
        const isYouTubeLink = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(arg[0]);

        try {
            let videoInfo;

            if (isYouTubeLink) {
                videoInfo = { url: query }; // Si c'est un lien, on prend directement l'URL
            } else {
                const searchResults = await ytsr(query, { limit: 1 });
                if (searchResults.items.length === 0) {
                    return await lucky.sendMessage(ms_org, { text: "No results found for this search." });
                }
                const video = searchResults.items[0];
                videoInfo = {
                    url: video.url,
                    title: video.name,
                    views: video.views,
                    duration: video.duration,
                    thumbnail: video.thumbnail
                };
            

            const caption = `╭─── 〔 LUCKY-MD VIDEO 〕 ──⬣
⬡ Titre: ${videoInfo.title}
⬡ URL: ${videoInfo.url}
⬡ Vues: ${videoInfo.views}
⬡ Durée: ${videoInfo.duration}
╰───────────────────⬣`;

            await lucky.sendMessage(ms_org, { image: { url: videoInfo.thumbnail }, caption: caption });
            };
            // Downloading the video
            const videoResponse = await axios.get(`https://ironman.koyeb.app/ironman/dl/ytv?url=${videoInfo.url}`, {
                responseType: 'arraybuffer'
            });

            await lucky.sendMessage(ms_org, {
                video: Buffer.from(videoResponse.data),
                mimetype: 'video/mp4',
                fileName: `${videoInfo.title}.mp4`
            }, { quoted: ms });

        } catch (error) {
            console.error("Error downloading video :", error.message || error);
            await lucky.sendMessage(ms_org, { text: "Error downloading video." });
        }
    }
);
