const { luckycmd } = require("../framework/luckycmd");
const { Catbox } = require('node-catbox');
const fs = require("fs");
const { Canvas, loadImage } = require("@napi-rs/canvas");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

const catbox = new Catbox();

async function uploadToCatbox(filePath) {
  try {
    const link = await catbox.uploadFile({ path: filePath });
    return link;
  } catch (error) {
    console.error("Erreur lors de l'upload sur Catbox:", error);
    throw new Error("Une erreur est survenue lors de l'upload du fichier.");
  }
}


 const alea = (ext) => `${Math.floor(Math.random() * 10000)}${ext}`;
 
const isSupportedFile = (path) => {
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".mp4", ".gif"];
    return validExtensions.some((ext) => path.endsWith(ext));
  };

luckycmd(
  {
    nom_cmd: "url",
    classe: "Conversion",
    react: "📤",
    desc: "Upload un fichier (image, vidéo, audio) sur Catbox et renvoie le lien"
  },
  async (ms_org, lucky, cmd_options) => {
    const { msg_Repondu } = cmd_options;

    if (!msg_Repondu) {
      return ovl.sendMessage(ms_org, { text: "Veuillez mentionner un fichier (image, vidéo, audio ou document)." });
    }

    const mediaMessage = msg_Repondu.imageMessage || msg_Repondu.videoMessage || msg_Repondu.documentMessage || msg_Repondu.audioMessage;
    if (!mediaMessage) {
      return ovl.sendMessage(ms_org, { text: "File type not supported. Please mention an image, video, audio or document." });
    }

    try {
      const media = await ovl.dl_save_media_ms(mediaMessage);
      const link = await uploadToCatbox(media);
      await ovl.sendMessage(ms_org, { text: link });
    } catch (error) {
      console.error("Error uploading to Catbox:", error);
      await ovl.sendMessage(ms_org, { text: "Error creating Catbox link." });
    }
  }
);
  // Commande Sticker
  luckycmd(
  {
    nom_cmd: "sticker",
    classe: "Conversion",
    react: "📄",
    desc: "Crée un sticker à partir d'une image, vidéo ou GIF",
    alias: ["s", "stick"]
  },
  async (ms_org, lucky, cmd_options) => {
    const { msg_Repondu, arg, ms } = cmd_options;
    
    if (!msg_Repondu) {
      return ovl.sendMessage(ms_org, {
        text: "Reply to an image, video or GIF to create a sticker.",
      });
    }

    let media;
    try {
      const mediaMessage =
        msg_Repondu.imageMessage ||
        msg_Repondu.videoMessage ||
        msg_Repondu.stickerMessage;

      if (!mediaMessage) {
        return ovl.sendMessage(ms_org, {
          text: "Please reply to a valid image, video or GIF.",
        });
      }

      media = await ovl.dl_save_media_ms(mediaMessage);

      if (!media) {
        throw new Error("Unable to download the file.");
      }

      const buffer = fs.readFileSync(media);

      const sticker = new Sticker(buffer, {
        pack: "wa-bot",
        author: "LUCKY-MD",
        type: StickerTypes.FULL,
        quality: 100,
      });

      const stickerFileName = `${Math.floor(Math.random() * 10000)}.webp`;
      await sticker.toFile(stickerFileName);

      await lucky.sendMessage(
        ms_org,
        { sticker: fs.readFileSync(stickerFileName) },
        { quoted: ms }
      );

      fs.unlinkSync(media);
      fs.unlinkSync(stickerFileName);
    } catch (error) {
      console.error("Error creating the sticker:", error);
      await ovl.sendMessage(ms_org, {
        text: `Error creating the sticker : ${error.message}`,
      });
    }
  }
);


  // Commande Take
  luckycmd(
    {
      nom_cmd: "take",
      classe: "Conversion",
      react: "✍️",
      desc: "Modifie le nom d'un sticker",
    },
    async (ms_org, lucky, cmd_options) => {
      const { msg_Repondu, arg, nom_Auteur_Message, ms } = cmd_options;
      if (!msg_Repondu || !msg_Repondu.stickerMessage) {
        return ovl.sendMessage(ms_org, { text: "Respond to a sticker." });
      }
      
      try {
        const stickerBuffer = await ovl.dl_save_media_ms(msg_Repondu.stickerMessage);
        const sticker = new Sticker(stickerBuffer, {
          pack: arg.join(' ') ? arg : nom_Auteur_Message,
          author: "LUCKY Bot",
          type: StickerTypes.FULL,
        });

        const stickerFileName = alea(".webp");
        await sticker.toFile(stickerFileName);
        await ovl.sendMessage(
          ms_org,
          { sticker: fs.readFileSync(stickerFileName) },
          { quoted: ms }
        );
        fs.unlinkSync(stickerFileName);
      } catch (error) {
        await ovl.sendMessage(ms_org, {
          text: `Error renaming the sticker : ${error.message}`,
        });
      }
    }
  );

  // Commande Write
luckycmd(
  {
    nom_cmd: "ecrire",
    classe: "Conversion",
    react: "📝",
    desc: "Ajoute du texte à une image, vidéo ou sticker",
  },
  async (ms_org, lucky, cmd_options) => {
    const { msg_Repondu, arg, ms } = cmd_options;

    if (!msg_Repondu || !arg) {
      return ovl.sendMessage(ms_org, {
        text: "Please reply to a file and provide text.",
      });
    }

    const mediaMessage =
      msg_Repondu.imageMessage ||
      msg_Repondu.videoMessage ||
      msg_Repondu.stickerMessage;

    if (!mediaMessage) {
      return lucky.sendMessage(ms_org, {
        text: "File type not supported. Please mention an image, video or sticker.",
      });
    }

    try {
      const media = await lucky.dl_save_media_ms(mediaMessage);
      const image = await loadImage(fs.readFileSync(media)); // Chargement correct

      const canvas = Canvas.createCanvas(image.width, image.height);
      const context = canvas.getContext("2d");

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      context.font = "bold 36px Arial";
      context.fillStyle = "white";
      context.textAlign = "center";
      context.fillText(arg, canvas.width / 2, canvas.height - 50);

      const outputBuffer = canvas.toBuffer();
      const sticker = new Sticker(outputBuffer, {
        pack: "wa-bot",
        author: "LUCKY Bot",
        type: StickerTypes.FULL,
      });

      const fileName = `${Math.floor(Math.random() * 10000)}.webp`;

      await sticker.toFile(fileName);

      await ovl.sendMessage(
        ms_org,
        { sticker: fs.readFileSync(fileName) },
        { quoted: ms }
      );

      fs.unlinkSync(fileName);
      fs.unlinkSync(media);
    } catch (error) {
      console.error("Error adding text to image:", error);
      await ovl.sendMessage(ms_org, {
        text: `An error occurred while adding the text : ${error.message}`,
      });
    }
  }
);

  // Commande ToImage
  luckycmd(
  {
    nom_cmd: "toimage",
    classe: "Conversion",
    react: "🖼️",
    desc: "Convertit un sticker en image",
    alias: ["toimg"],
  },
  async (ms_org, lucky, cmd_options) => {
    const { msg_Repondu, ms } = cmd_options;

    if (!msg_Repondu || !msg_Repondu.stickerMessage) {
      return ovl.sendMessage(ms_org, { text: "Répondez à un sticker." });
    }

    try {
      const stickerBuffer = await ovl.dl_save_media_ms(msg_Repondu.stickerMessage);
      const image = await loadImage(stickerBuffer);

      const canvas = Canvas.createCanvas(image.width, image.height);
      const context = canvas.getContext("2d");

      context.drawImage(image, 0, 0);

      const outputBuffer = canvas.toBuffer("image/png");

      const fileName = alea(".png");
      fs.writeFileSync(fileName, outputBuffer);

      await ovl.sendMessage(
        ms_org,
        { image: fs.readFileSync(fileName) },
        { quoted: ms }
      );

      fs.unlinkSync(fileName);
    } catch (error) {
      console.error("Error converting sticker to image:", error);
      await ovl.sendMessage(ms_org, {
        text: `Error converting to image : ${error.message}`,
      });
    }
  }
);
