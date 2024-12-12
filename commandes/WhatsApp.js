const { luckycmd } = require("../framework/luckycmd");

luckycmd(
    {
        nom_cmd: "vv",
        classe: "Owner",
        react: "👀",
        desc: "Displays a message sent in single view",
    },
    async (_ms_org, lucky, _cmd_options) => {
        const { ms, msg_Repondu, repondre } = _cmd_options;

        if (!msg_Repondu) {
            return repondre("Please mention a single view message.");
        }

        let _vue_Unique_Message = msg_Repondu.viewOnceMessage ?? msg_Repondu.viewOnceMessageV2 ?? msg_Repondu.viewOnceMessageV2Extension;

        if (!_vue_Unique_Message) {
            return repondre("The selected message is not in single view mode.");
        }

        try {
            let _media;
            let options = { quoted: ms };

            if (_vue_Unique_Message.message.imageMessage) {
                _media = await lucky.dl_save_media_ms(_vue_Unique_Message.message.imageMessage);
                await lucky.sendMessage(_ms_org, { image: { url: _media }, caption: _vue_Unique_Message.message.imageMessage.caption }, options);

            } else if (_vue_Unique_Message.message.videoMessage) {
                _media = await lucky.dl_save_media_ms(_vue_Unique_Message.message.videoMessage);
                await lucky.sendMessage(_ms_org, { video: { url: _media }, caption: _vue_Unique_Message.message.videoMessage.caption }, options);

            } else if (_vue_Unique_Message.message.audioMessage) {
                _media = await lucky.dl_save_media_ms(_vue_Unique_Message.message.audioMessage);
                await lucky.sendMessage(_ms_org, { audio: { url: _media }, mimetype: "audio/mp4", ptt: false }, options);

            } else {
                return repondre("Ce Message type is not supported");
            }
        } catch (_error) {
            console.error("Error sending message in single view :", _error.message || _error);
        }
    }
);
