const fs = require('fs');
const pino = require("pino");
const path = require('path');
const axios = require("axios");
const { default: makeWASocket, useMultiFileAuthState, logger, delay, makeCacheableSignalKeyStore, jidDecode, getContentType, downloadContentFromMessage, makeInMemoryStore, fetchLatestBaileysVersion, DisconnectReason } = require("@whiskeysockets/baileys");
const boom = require("@hapi/boom");
const config = require("./set");
const session = config.SESSION_ID || "";
let evt = require(__dirname + "/framework/luckycmd");
const FileType = require('file-type')
const prefixe = config.PREFIXE;
const { Antilink, Antilink_warnings } = require("./DataBase/antilink");

 async function ovlAuth(session) {
    let sessionId;
    try {
        if (session.startsWith("Lucky-MD_") && session.endsWith("_SESSION-ID")) {
            sessionId = session.slice(7, -11);
        }
        const response = await axios.get('https://pastebin.com/raw/' + sessionId);
        const data = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        const filePath = path.join(__dirname, 'auth', 'creds.json');
        if (!fs.existsSync(filePath)) {
            console.log("Connexion au bot en cours");
            await fs.writeFileSync(filePath, data, 'utf8'); 
        } else if (fs.existsSync(filePath) && session !== "lucky") {
            await fs.writeFileSync(filePath, data, 'utf8');
        }
    } catch (e) {
        console.log("Session invalide: " + e.message || e);
    }
 }
ovlAuth(session);

async function main() {
    const { version, isLatest } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'auth'));
        try {
        const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store"
  })
});
         const ovl = makeWASocket({
            printQRInTerminal: true,
            logger: pino({ level: "silent" }),
            browser: [ "Ubuntu", "Chrome", "20.0.04" ],
            generateHighQualityLinkPreview: true,
            auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }).child({ level: "silent" }))
        },
           fireInitQueries: false,
           shouldSyncHistoryMessage: true,
           downloadHistory: true,
           syncFullHistory: true,
           markOnlineOnConnect: false,
           getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                    return msg.message || undefined;
                }
                return {
                    conversation: 'An Error Occurred, Repeat Command!'
                };
           }
        });
        store.bind(ovl.ev);
       //  setInterval(() => { store.writeToFile(__dirname + "/store.json");  }, 3000);
    //     await ovl.connect();
             
         ovl.ev.on("messages.upsert", async (m) => {
    const { messages } = m;
    const ms = messages[0];
    if (!ms.message) return;
    
    const decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return (decode.user && decode.server && `${decode.user}@${decode.server}`) || jid;
        }
        return jid;
    };

    var mtype = getContentType(ms.message);
    var texte = mtype === "conversation" ? ms.message.conversation :
        mtype === "imageMessage" ? ms.message.imageMessage?.caption :
        mtype === "videoMessage" ? ms.message.videoMessage?.caption :
        mtype === "extendedTextMessage" ? ms.message.extendedTextMessage?.text :
        mtype === "buttonsResponseMessage" ? ms.message.buttonsResponseMessage?.selectedButtonId :
        mtype === "listResponseMessage" ? ms.message.listResponseMessage?.singleSelectReply?.selectedRowId :
        mtype === "messageContextInfo" ? (ms.message.buttonsResponseMessage?.selectedButtonId || ms.message.listResponseMessage?.singleSelectReply?.selectedRowId || ms.text) : "";

    var ms_org = ms.key.remoteJid;
    var id_Bot = decodeJid(ovl.user.id);
    var id_Bot_N = id_Bot.split('@')[0];
    const verif_Groupe = ms_org?.endsWith("@g.us");
    var infos_Groupe = verif_Groupe ? await ovl.groupMetadata(ms_org) : "";
    var nom_Groupe = verif_Groupe ? infos_Groupe.subject : "";
    var msg_Repondu = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
    var auteur_Msg_Repondu = decodeJid(ms.message.extendedTextMessage?.contextInfo?.participant);
    var mr = ms.message.extendedTextMessage?.contextInfo?.mentionedJid;
    var user = mr || msg_Repondu ? auteur_Msg_Repondu : "";
    var auteur_Message = verif_Groupe ? ms.key.participant || ms.participant : ms_org;
    if (ms.key.fromMe) {
        auteur_Message = id_Bot;
    }

    var membre_Groupe = verif_Groupe ? ms.key.participant : '';
    const nom_Auteur_Message = ms.pushName;
    const arg = texte ? texte.trim().split(/ +/).slice(1) : null;
    const verif_Cmd = texte ? texte.startsWith(prefixe) : false;
    const cmds = verif_Cmd ? texte.slice(prefixe.length).trim().split(/ +/).shift().toLowerCase() : false;
    function groupe_Admin(membre_Groupe) {
        let admin = [];
        for (let m of membre_Groupe) {
            if (m.admin != null) admin.push(m.id);
        }
        return admin;
    }
    const mbre_membre = verif_Groupe ? await infos_Groupe.participants : '';
    let admins = verif_Groupe ? groupe_Admin(mbre_membre) : '';
    const verif_Admin = verif_Groupe ? admins.includes(auteur_Message) : false;
    const verif_Ovl_Admin = verif_Groupe ? admins.includes(id_Bot) : false;
   
    const Ainz = '255752593977'';
    const Ainzbot = '255752593977';
    const devNumbers = [ Ainz, Ainzbot ];
    const premium_Users_id = [Ainz, Ainzbot, id_Bot_N, config.NUMERO_OWNER].map((s) => s.replace(/[^0-9]/g) + "@s.whatsapp.net");
    const prenium_id = premium_Users_id.includes(auteur_Message);
    const dev_id = devNumbers.map((s) => s.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(auteur_Message);

    const cmd_options = {
        verif_Groupe,
        mbre_membre,
        membre_Groupe,
        verif_Admin,
        infos_Groupe,
        nom_Groupe,
        auteur_Message,
        nom_Auteur_Message,
        id_Bot,
        prenium_id,
        dev_id,
        id_Bot_N,
        verif_Ovl_Admin,
        prefixe,
        arg,
        repondre,
        groupe_Admin,
        msg_Repondu,
        auteur_Msg_Repondu,
        ms, 
        ms_org
   };

    console.log("{}=={} LUCKY-MD LOG-MESSAGES {}=={}");
    if (verif_Groupe) {
        console.log("Groupe: " + nom_Groupe);
    }
    console.log("Auteur message: " + `${nom_Auteur_Message}\nNumero: ${auteur_Message.split("@s.whatsapp.net")[0]}`);
    console.log("Type: " + mtype);
    console.log("Message:");
    console.log(texte);

    function repondre(message) {
        ovl.sendMessage(ms_org, { text: message }, { quoted: ms });
    }

          //antilink
          const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[^\s]+\.[^\s]+)/gi;

if (linkRegex.test(texte)) {
  if (!verif_Groupe || !ms_org) return;

  const settings = await Antilink.findOne({ where: { id: ms_org } });
  if (!settings || settings.mode !== 'oui') return;

  if (verif_Admin) return;
 if(!verif_Ovl_Admin) return;

  switch (settings.type) {
    case 'supp': // Suppression du message
      await ovl.sendMessage(ms_org, { text: `@${auteur_Message.split("@")[0]}, Les liens ne sont pas autorisés ici.`, mentions: [auteur_Message] });
      await ovl.sendMessage(ms_org, { delete: ms.key });
      break;

    case 'kick': // Expulsion immédiate
      await ovl.sendMessage(ms_org, { text: `@${auteur_Message.split("@")[0]} a été retiré pour avoir envoyé un lien.` });
      await ovl.sendMessage(ms_org, { delete: ms.key });
      await ovl.groupParticipantsUpdate(ms_org, [auteur_Message], "remove");
      break;

    case 'warn': // Gestion des avertissements
      let warning = await Antilink_warnings.findOne({ where: { groupId: ms_org, userId: auteur_Message } });

      if (!warning) {
        // Premier avertissement
        await Antilink_warnings.create({ groupId: ms_org, userId: auteur_Message });
        await ovl.sendMessage(ms_org, { text: `@${auteur_Message.split("@")[0]}, avertissement 1/3 pour avoir envoyé un lien.`, mentions: [auteur_Message] });
      } else {
        // Augmenter le nombre d'avertissements
        warning.count += 1;
        await warning.save();

        if (warning.count >= 3) {
          // Expulsion après 3 avertissements
          await ovl.sendMessage(ms_org, { text: `@${auteur_Message.split("@")[0]} a été retiré après 3 avertissements.`, mentions: [auteur_Message] });
          await ovl.sendMessage(ms_org, { delete: ms.key });
          await ovl.groupParticipantsUpdate(ms_org, [auteur_Message], "remove");
          await warning.destroy(); // Réinitialiser après expulsion
        } else {
          // Message pour chaque avertissement
          await ovl.sendMessage(ms_org, { text: `@${auteur_Message.split("@")[0]}, avertissement ${warning.count}/3 pour avoir envoyé un lien.`, mentions: [auteur_Message] });
        }
      }
      break;

    default:
      console.error(`Action inconnue : ${settings.type}`);
  }
}         
          //fin antilink
    if (verif_Cmd) { 
        const cd = evt.cmd.find((ovlcmd) => ovlcmd.nom_cmd === cmds || (ovlcmd.alias && ovlcmd.alias.includes(cmds)));
        
        if (cd) {
             try {
                if (config.MODE !== 'public' && !prenium_id) {
                    return 
                }

                if (!dev_id && ms_org == "120363314687943170@g.us") {
                    return
                }
              
             if(cd.react) {
                await ovl.sendMessage(ms_org, { react: { text: cd.react, key: ms.key } });
             } else { await ovl.sendMessage(ms_org, { react: { text: "🎐", key: ms.key } });
                    }
              cd.fonction(ms_org, ovl, cmd_options);
            } catch (e) {
                console.log("Erreur: " + e);
                ovl.sendMessage(ms_org, { text: "Erreur: " + e }, { quoted: ms });
            }
        }
    }
}); //fin événement message 
 const Disconnection = (raisonDeconnexion) => {
    switch (raisonDeconnexion) {
        case DisconnectReason.badSession:
            console.log('Session ID incorrecte, veuillez obtenir une nouvelle session via QR-code/Pairing.');
            break;
        case DisconnectReason.connectionClosed:
            console.log('Connexion fermée, tentative de reconnexion...');
            main();
            break;
        case DisconnectReason.connectionLost:
            console.log('Connexion au serveur perdue. Reconnexion en cours...');
            main();
            break;
        case DisconnectReason.connectionReplaced:
            console.log('Connexion remplacée. Une autre session est déjà active.');
            break;
        case DisconnectReason.loggedOut:
            console.log('Déconnecté. Veuillez obtenir une nouvelle session via QR-code/Pairing.');
            break;
        case DisconnectReason.restartRequired:
            console.log('Redémarrage requis. Redémarrage du bot...');
            main();
            break;
        default:
            console.log('Erreur inconnue:', raisonDeconnexion);
            exec("pm2 restart all");
    }
};

ovl.ev.on("connection.update", async (con) => {
    const { connection, lastDisconnect } = con;

    if (connection === "connecting") {
        console.log("🌐 Connexion à WhatsApp en cours...");
    } else if (connection === 'open') {
        console.log("✅ Connexion établie ; Le bot est en ligne 🌐\n\n");
        
        console.log("Chargement des commandes...\n");
        const commandes = fs.readdirSync(path.join(__dirname, "commandes")).filter(fichier => path.extname(fichier).toLowerCase() === ".js");
        
        for (const fichier of commandes) {
            try {
                require(path.join(__dirname, "commandes", fichier));
                console.log(`${fichier} installé avec succès`);
                await  delay(300); // Pause de 300 ms
            } catch (e) {
                console.log(`Erreur lors du chargement de ${fichier} :    ${e}`);
            }
        }
        delay(700);
      let start_msg = `╭────《 LUCKY-MD 》─────⊷
⫸  *Préfixe*       : ${prefixe}
⫸  *Mode*          : ${config.MODE}
⫸  *Commandes*     : ${evt.cmd.length}

             𝙈𝙖𝙙𝙚 𝙗𝙮 Fred`;
        await ovl.sendMessage(ovl.user.id, { text: start_msg });

        
    } else if (connection === "close") {
        const raisonDeconnexion = new boom.Boom(lastDisconnect?.error)?.output.statusCode;
        Disconnection(raisonDeconnexion);
        console.log("Statut de la connexion : " + connection);
    }
});

        
        // Gestion des mises à jour des identifiants
        ovl.ev.on("creds.update", saveCreds);

            //autre fonction de ovl
            ovl.dl_save_media_ms = async (message, filename = '', attachExtension = true, directory = './downloads') => {
    try {
        const quoted = message.msg || message;
        const mime = quoted.mimetype || '';
        const messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        
        console.log(`Téléchargement du message de type: ${messageType}`);
        
        if (!mime) {
            throw new Error("Type MIME non spécifié ou non pris en charge.");
        }

        const stream = await downloadContentFromMessage(quoted, messageType);
        const bufferChunks = [];
        for await (const chunk of stream) {
            bufferChunks.push(chunk);
        }
        
        const buffer = Buffer.concat(bufferChunks);
        const type = await FileType.fromBuffer(buffer);
        if (!type) {
            throw new Error("Type de fichier non reconnu");
        }

        // Création du chemin du répertoire
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        
        const trueFileName = attachExtension ? `${filename}.${type.ext}` : filename;
        const filePath = path.resolve(directory, trueFileName);

        // Écriture directe dans un fichier via un flux de création
        await fs.promises.writeFile(filePath, buffer);
        console.log(`Fichier sauvegardé à: ${filePath}`);
        
        return filePath;
    } catch (error) {
        console.error('Erreur lors du téléchargement et de la sauvegarde du fichier:', error);
        throw error;
    }
};
            //fin autre fonction ovl
    } catch (error) {
        console.error("Erreur principale:", error);
    }
}

main();


const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Assurez-vous d'ajouter cette ligne pour définir le port

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Page d'accueil pour LUCKY-MD Bot">
    <title>LUCKY-Bot Web Page</title>
    <style>
        /* Reset */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        /* Body styling */
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #121212;
            font-family: Arial, sans-serif;
            color: #ffffff;
            overflow: hidden;
        }

        /* Content box styling */
        .content {
            text-align: center;
            padding: 30px;
            background-color: #1e1e1e;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(255, 255, 255, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        /* Content hover effect */
        .content:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 30px rgba(255, 255, 255, 0.15);
        }

        /* Heading styling */
        h1 {
            font-size: 2em;
            color: #f0f0f0;
            margin-bottom: 15px;
            letter-spacing: 1px;
        }

        /* Text paragraph styling */
        p {
            font-size: 1.1em;
            color: #d3d3d3;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="content">
        <h1>Bienvenue sur LUCKY-MD</h1>
        <p>Votre assistant WhatsApp</p>
    </div>
</body>
</html>`);
});

app.listen(port, () => {
  console.log("Listening on port: " + port);
});
