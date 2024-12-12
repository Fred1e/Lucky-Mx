const { luckycmd } = require("../framework/luckycmd");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { Antilink } = require("../DataBase/antilink");

luckycmd(
    {
        nom_cmd: "tagall",
        classe: "Groupe",
        react: "💬",
        desc: "Command to tag all members of a group"
    },
    async (dest, lucky, cmd_options) => {
        try {
            const { ms, repondre, arg, verif_Groupe, infos_Groupe, nom_Auteur_Message, verif_Admin } = cmd_options;

            if (!verif_Groupe) {
                return repondre("Cette commande ne fonctionne que dans les groupes");
            }

            const messageTexte = arg && arg.length > 0 ? arg.join(' ') : '';
            const membresGroupe = verif_Groupe ? await infos_Groupe.participants : [];
            
            let tagMessage = `╭───〔  TAG ALL 〕───⬣\n`;
            tagMessage += `│👤 Auteur : *${nom_Auteur_Message}*\n`;
            tagMessage += `│💬 Message : *${messageTexte}*\n│\n`;

            membresGroupe.forEach(membre => {
                tagMessage += `│◦❒ @${membre.id.split("@")[0]}\n`;
            });
            tagMessage += `╰═══════════════⬣\n`;

            if (verif_Admin) {
                await ovl.sendMessage(dest, { text: tagMessage, mentions: membresGroupe.map(m => m.id) }, { quoted: ms });
            } else {
                repondre('Only administrators can use this command');
            }
        } catch (error) {
            console.error("Error sending message with tagall :", error);
        }
    });

luckycmd(
    {
        nom_cmd: "tag",
        classe: "Groupe",
        react: "💬",
        desc: "Share a message to everyone in a group"

    },
    async (dest, lucky, cmd_options) => {
        const { repondre, msg_Repondu, verif_Groupe, arg, verif_Admin } = cmd_options;

        if (!verif_Groupe) {
            repondre("This command only works in groups");
            return;
        }

        if (verif_Admin) {
            let metadata_groupe = await lucky.groupMetadata(dest);
            let membres_Groupe = metadata_groupe.participants.map(participant => participant.id);
            let contenu_msg;

            if (msg_Repondu) {
                if (msg_Repondu.imageMessage) {
                    let media_image = await lucky.dl_save_media_ms(msg_Repondu.imageMessage);
                    contenu_msg = {
                        image: { url: media_image },
                        caption: msg_Repondu.imageMessage.caption,
                        mentions: membres_Groupe
                    };
                } else if (msg_Repondu.videoMessage) {
                    let media_video = await lucky.dl_save_media_ms(msg_Repondu.videoMessage);
                    contenu_msg = {
                        video: { url: media_video },
                        caption: msg_Repondu.videoMessage.caption,
                        mentions: membres_Groupe
                    };
                } else if (msg_Repondu.audioMessage) {
                    let media_audio = await lucky.dl_save_media_ms(msg_Repondu.audioMessage);
                    contenu_msg = {
                        audio: { url: media_audio },
                        mimetype: 'audio/mp4',
                        mentions: membres_Groupe
                    };
                } else if (msg_Repondu.stickerMessage) {
                    let media_sticker = await lucky.dl_save_media_ms(msg_Repondu.stickerMessage);
                    let sticker_msg = new Sticker(media_sticker, {
                        pack: 'LUCKY-MD Hidtag',
                        type: StickerTypes.CROPPED,
                        categories: ["🎊", "🎈"],
                        id: "tag_sticker",
                        quality: 80,
                        background: "transparent",
                    });
                    const sticker_buffer = await sticker_msg.toBuffer();
                    contenu_msg = { sticker: sticker_buffer, mentions: membres_Groupe };
                } else {
                    contenu_msg = {
                        text: msg_Repondu.conversation,
                        mentions: membres_Groupe
                    };
                }

                lucky.sendMessage(dest, contenu_msg);
            } else {
                if (!arg || !arg[0]) {
                    repondre("Please include or mention a message to share.");
                    return;
                }

                lucky.sendMessage(dest, {
                    text: arg.join(' '),
                    mentions: membres_Groupe
                });
            }
        } else {
            repondre("This command is reserved for group administrators");
        }
    }
);

luckycmd(
  {
    nom_cmd: "antilink",
    classe: "Groupe",
    react: "🔗",
    desc: "Enables or configures antilink for groups",
  },
  async (jid, lucky, cmd_options) => {
      const { ms, repondre, arg, verif_Groupe, verif_Admin } = cmd_options;
    try {
      
      if (!verif_Groupe) {
        return repondre("This Command only works in groups");
      }

      if (!verif_Admin) {
        return repondre("Only administrators can use this command");
      }

      const sousCommande = arg[0]?.toLowerCase();
      const validModes = ['on', 'off'];
      const validTypes = ['supp', 'warn', 'kick'];

      const [settings] = await Antilink.findOrCreate({
        where: { id: jid },
        defaults: { id: jid, mode: 'non', type: 'supp' },
      });

      if (validModes.includes(sousCommande)) {
        const newMode = sousCommande === 'on' ? 'oui' : 'non';
        if (settings.mode === newMode) {
          return repondre(`L'Antilink est déjà ${sousCommande}`);
        }
        settings.mode = newMode;
        await settings.save();
        return repondre(`L'Antilink ${sousCommande === 'on' ? 'activated' : 'Disabled'} successfully !`);
      }

      if (validTypes.includes(sousCommande)) {
        if (settings.mode !== 'oui') {
          return repondre("Please enable the antilink first using 'antilink on`");
        }
        if (settings.type === sousCommande) {
          return repondre(`The antilink action is already set to ${sousCommande}`);
        }
        settings.type = sousCommande;
        await settings.save();
        return repondre(`The Antilink Action set to ${sousCommande} successfully !`);
      }

      return repondre(
        "Usage:\n" +
        "'antilink on/off' - Enable or disable antilink\n" +
        "`antilink supp/warn/kick' - Configure the antilink action"
      );
    } catch (error) {
      console.error("Error configuring antilink :", error);
      repondre("An error occurred while running the command.");
    }
  }
);

