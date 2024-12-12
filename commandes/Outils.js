const { ovlcmd, cmd } = require("../framework/ovlcmd");
const config = require("../set");
const prefixe = config.PREFIXE;
ovlcmd(
    {
        nom_cmd: "test",
        classe: "Outils",
        react: "🌟",
        desc: "Tester la connectivité du bot"
    },
    async (ms_org, ovl, cmd_options) => {
        try {
            const mess = `\`\`\`🌐 Bienvenue sur *OVL-MD*, votre bot WhatsApp multi-device.🔍 Tapez *${prefixe}menu* pour voir toutes les commandes disponibles.\`\`\`\n> ©2024 OVL-MD By *AINZ*`;
            const img = 'https://telegra.ph/file/8173c870f9de5570db8c3.jpg';
            await ovl.sendMessage(ms_org, { 
                image: { url: img }, 
                caption: mess 
            });
        } catch (error) {
            console.error("Erreur lors de l'envoi du message de test :", error.message || error);
        }
    }
);


ovlcmd(
    {
        nom_cmd: "description",
        classe: "Outils",
        desc: "Affiche la liste des commandes avec leurs descriptions",
        alias: ["desc", "help"],
    },
    async (ms_org, ovl, cmd_options) => {
        try {
            const commandes = cmd; 
            let descriptionMsg = "📜 *Liste des commandes disponibles :*\n\n";
            commandes.forEach(cmd => {
                descriptionMsg += `nom commande: *${cmd.nom_cmd}*\nAlias: [${cmd.alias.join(", ")}]\ndescription: ${cmd.desc}\n\n`;
            }); 
            await ovl.sendMessage(ms_org, { text: descriptionMsg });
        } catch (error) {
            console.error("Erreur lors de l'affichage des descriptions :", error.message || error);
        }
    }
);

ovlcmd(
    {
        nom_cmd: "menu",
        classe: "Outils",
        react: "🔅",
        desc: "affiche le menu du bot",
    },
    async (ms_org, ovl, cmd_options) => {
        try { 
            const seconds = process.uptime(); 
            var j = Math.floor(seconds / (60 * 60 * 24));
            var h = Math.floor(seconds / (60*60));
            var m = Math.floor(seconds % (60*60) / 60);
            var s = Math.floor(seconds % 60);
            let uptime = '';
            if (j > 0) uptime += `${j}J `;
            if (h > 0) uptime += `${h}H `;
            if (m > 0) uptime += `${m}M `;
            if (s > 0) uptime += `${s}S`;

            const lien = `${config.MENU}`;
            const commandes = cmd;
            let menu = `╭───❏ 🄾🅅🄻 🄼🄳 ❏
│ ✿ Prefixe => ${config.PREFIXE}
│ ✿ Owner => ${config.NOM_OWNER}
│ ✿ Commandes => ${commandes.length}
│ ✿ Uptime => ${uptime.trim()}
│ ✿ Développeur => AINZ
╰══════════════⊷\n\n`;

            const cmd_classe = {};
            commandes.forEach((cmd) => {
                if (!cmd_classe[cmd.classe]) {
                    cmd_classe[cmd.classe] = [];
                }
                cmd_classe[cmd.classe].push(cmd);
            });

            for (const [classe, cmds] of Object.entries(cmd_classe)) {
                menu += `╭───❏ ${classe} ❏\n`;
                cmds.forEach((cmd) => {
                    menu += `│☞ ${cmd.nom_cmd}\n`;
                });
                menu += `╰═══════════════⊷\n\n`;
            }

            menu += "> ©2024 OVL-MD WA-BOT";
            await ovl.sendMessage(ms_org, { image: { url: lien }, caption: menu });
        } catch (error) {
            console.error("Erreur lors de la génération du menu :", error);
        }
    }
);
