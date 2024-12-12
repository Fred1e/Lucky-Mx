const { ovlcmd } = require("../framework/ovlcmd");

ovlcmd(
    {
        nom_cmd: "vv",
        classe: "Owner",
        react: "👀",
        desc: "Affiche un message envoyé en vue unique",
    },
    async (_ms_org, ovl, _cmd_options) => {
        const { ms, msg_Repondu, repondre } = _cmd_options;

        if (!msg_Repondu) {
            return repondre("Veuillez mentionner un message en vue unique.");
        }

        let _vue_Unique_Message = msg_Repondu.viewOnceMessage ?? msg_Repondu.viewOnceMessageV2 ?? msg_Repondu.viewOnceMessageV2Extension;

        if (!_vue_Unique_Message) {
            return repondre("Le message sélectionné n'est pas en mode vue unique.");
        }

        try {
            let _media;
            let options = { quoted: ms };

            if (_vue_Unique_Message.message.imageMessage) {
                _media = await ovl.dl_save_media_ms(_vue_Unique_Message.message.imageMessage);
                await ovl.sendMessage(_ms_org, { image: { url: _media }, caption: _vue_Unique_Message.message.imageMessage.caption }, options);

            } else if (_vue_Unique_Message.message.videoMessage) {
                _media = await ovl.dl_save_media_ms(_vue_Unique_Message.message.videoMessage);
                await ovl.sendMessage(_ms_org, { video: { url: _media }, caption: _vue_Unique_Message.message.videoMessage.caption }, options);

            } else if (_vue_Unique_Message.message.audioMessage) {
                _media = await ovl.dl_save_media_ms(_vue_Unique_Message.message.audioMessage);
                await ovl.sendMessage(_ms_org, { audio: { url: _media }, mimetype: "audio/mp4", ptt: false }, options);

            } else {
                return repondre("Ce type de message n'est pas pris en charge");
            }
        } catch (_error) {
            console.error("Erreur lors de l'envoi du message en vue unique :", _error.message || _error);
        }
    }
);
