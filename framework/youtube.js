const axios = require("axios");

async function youtubedl(link) {
  try {
    // Envoi de la première requête pour obtenir les informations de la vidéo
    const response = await axios.post("https://www.yt1s.com/api/ajaxSearch/index", new URLSearchParams({
      q: link,
      vt: "home"
    }), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Referer": "https://www.yt1s.com",
        "Origin": "https://www.yt1s.com"
      }
    });

    const data = response.data;
    if (data.status !== "ok" || !data.links) {
      console.error("No valid data received.");
      return { error: "Invalid data received." };
    }

    // Structure des informations de base de la vidéo
    const result = {
      title: data.title,
      duration: parseDuration(data.t),
      author: data.a,
      thumbnail: `https://i.ytimg.com/vi/${data.vid}/0.jpg`
    };

    // Téléchargement des formats disponibles (vidéo et audio)
    const resultUrl = {
      video: await downloadMedia(data, "mp4"),
      audio: await downloadMedia(data, "mp3")
    };

    return { result, resultUrl };

  } catch (error) {
    console.error(`Error: ${error.response ? error.response.status : error.message}`);
    return { error: `Error: ${error.response ? error.response.status : error.message}` };
  }
}

// Fonction pour gérer le téléchargement de vidéos ou d'audios en utilisant `downloadAsBuffer`
async function downloadMedia(data, type) {
  return (await Promise.all(Object.values(data.links[type] || []).map(async v => {
    const downloadBuffer = await downloadAsBuffer(data.vid, v.k);
    if (!downloadBuffer) return null;
    return {
      size: v.size,
      format: v.f,
      quality: v.q,
      download: downloadBuffer
    };
  }))).filter(Boolean);
}

// Fonction pour télécharger un fichier en buffer
async function downloadAsBuffer(id, k) {
  try {
    // Requête pour convertir le lien de téléchargement
    const response = await axios.post("https://www.yt1s.com/api/ajaxConvert/convert", new URLSearchParams({
      vid: id,
      k
    }), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Referer": "https://www.yt1s.com",
        "Origin": "https://www.yt1s.com",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "X-Requested-With": "XMLHttpRequest"
      }
    });

    const data = response.data;

    if (data.status === "ok" && data.c_status === "CONVERTED") {
      const fileResponse = await axios.get(data.dlink, { responseType: 'arraybuffer' });
      return Buffer.from(fileResponse.data);
    } else {
      console.error(`Error in download: ${data.mess}`);
      return null;
    }
  } catch (error) {
    console.error(`Error during download: ${error.message}`);
    return null;
  }
}

// Fonction pour convertir la durée en format hh:mm:ss
function parseDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

module.exports = { youtubedl };
