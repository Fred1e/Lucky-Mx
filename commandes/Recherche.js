const { luckycmd, cmd } = require("../framework/luckycmd");
const gis = require("g-i-s");

luckycmd(
    {
        nom_cmd: "img",
        classe: "search",
        react: "🔍",
        desc: "Image search"
    },
    async (ms_org, lucky, cmd_options) => {
      const { arg } = cmd_options;
        const searchTerm = arg.join(" ");
        if (!searchTerm) {
            return lucky.sendMessage(ms_org, { text: "Please provide a search term, for example: img Luvky-Md" });
        }

        gis(searchTerm, async (error, results) => {
            if (error) {
                console.error("Error searching for images:", error);
                return lucky.sendMessage(ms_org, { text: "Error searching for images." });
            }

            const images = results.slice(0, 5);
            if (images.length === 0) {
                return lucky.sendMessage(ms_org, { text: "No images found for this search term." });
            }

            for (const image of images) {
                try {
                    await lucky.sendMessage(ms_org, {
                        image: { url: image.url },
                        caption: `\`\`\`Powered By LUVKY-MD\`\`\``
                    });
                } catch (err) {
                    console.error("Error sending image:", err);
                }
            }
        });
    }
);
