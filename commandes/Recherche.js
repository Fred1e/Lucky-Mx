const { ovlcmd, cmd } = require("../framework/ovlcmd");
const gis = require("g-i-s");

ovlcmd(
    {
        nom_cmd: "img",
        classe: "search",
        react: "🔍",
        desc: "Recherche d'images"
    },
    async (ms_org, ovl, cmd_options) => {
      const { arg } = cmd_options;
        const searchTerm = arg.join(" ");
        if (!searchTerm) {
            return ovl.sendMessage(ms_org, { text: "Veuillez fournir un terme de recherche, par exemple : img ovl-Md" });
        }

        gis(searchTerm, async (error, results) => {
            if (error) {
                console.error("Erreur lors de la recherche d'images:", error);
                return ovl.sendMessage(ms_org, { text: "Erreur lors de la recherche d'images." });
            }

            const images = results.slice(0, 5);
            if (images.length === 0) {
                return ovl.sendMessage(ms_org, { text: "Aucune image trouvée pour ce terme de recherche." });
            }

            for (const image of images) {
                try {
                    await ovl.sendMessage(ms_org, {
                        image: { url: image.url },
                        caption: `\`\`\`Powered By OVL-MD\`\`\``
                    });
                } catch (err) {
                    console.error("Erreur lors de l'envoi de l'image:", err);
                }
            }
        });
    }
);
