const { luckycmd, cmd } = require("../framework/luckycmd");
const config = require("../set");
const prefixe = config.PREFIXE;
luckycmd(
    {
        nom_cmd: "test",
        classe: "Tools",
        react: "🌟",
        desc: "Test bot connectivity"
    },
    async (ms_org, lucky, cmd_options) => {
        try {
            const mess = `\`\`\`🌐 Welcome to *LUCKY-MD*, your multi-device WhatsApp bot. 🔍 Type *${prefix}menu* to see all available commands.\'\'\'\n> ©2024 LUCKY-MD By *FREDI*`;
            const img = 'https://files.catbox.moe/7irwqn.jpeg';
            await lucky.sendMessage(ms_org, { 
                image: { url: img }, 
                caption: mess 
            });
        } catch (error) {
            console.error("Error When sending the test message :", error.message || error);
        }
    }
);


luckycmd(
    {
        nom_cmd: "description",
        classe: "Tools",
        desc: "Displays the list of commands with their descriptions",
        alias: ["desc", "help"],
    },
    async (ms_org, lucky, cmd_options) => {
        try {
            const commandes = cmd; 
            let descriptionMsg = "📜 *List of available commands :*\n\n";
            commandes.forEach(cmd => {
                descriptionMsg += `nom commande: *${cmd.nom_cmd}*\nAlias: [${cmd.alias.join(", ")}]\ndescription: ${cmd.desc}\n\n`;
            }); 
            await lucky.sendMessage(ms_org, { text: descriptionMsg });
        } catch (error) {
            console.error("Error viewing descriptions :", error.message || error);
        }
    }
);

luckycmd(
    {
        nom_cmd: "menu",
        classe: "Tools",
        react: "🔅",
        desc: "Displays the bot's menu",
    },
    async (ms_org, lucky, cmd_options) => {
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
            let menu = `╭───❏ LUCKY MD ❏
│ ✿ Prefixe => ${config.PREFIXE}
│ ✿ Owner => ${config.NOM_OWNER}
│ ✿ Commandes => ${commandes.length}
│ ✿ Uptime => ${uptime.trim()}
│ ✿ Developer=> FREDI
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

            menu += "> ©2024 LUCKY-MD WA-BOT";
            await lucky.sendMessage(ms_org, { image: { url: lien }, caption: menu });
        } catch (error) {
            console.error("Error generating menu :", error);
        }
    }
);
