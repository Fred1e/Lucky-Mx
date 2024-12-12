const { exec } = require("child_process");
const { luckycmd } = require("../framework/luckycmd");

luckycmd(
  {
    nom_cmd: "exec",
    classe: "Owner",
    react: "⚙️",
    desc: "Executes a shell command on the server"
  },
  async (ms_org, lucky, cmd_options) => {
    const { arg, prenium_id } = cmd_options;

    if (!prenium_id) {
      return lucky.sendMessage(ms_org, { text: "You don't have permission to execute commands." });
    }

    if (!arg[0]) {
      return lucky.sendMessage(ms_org, { text: "Please provide a shell command to run." });
    }

    exec(arg.join(" "), (err, stdout, stderr) => {
      if (err) {
        return lucky.sendMessage(ms_org, { text: `Runtime error: ${err.message}` });
      }
      if (stderr) {
        return lucky.sendMessage(ms_org, { text: `Error: ${stderr}` });
      }
      lucky.sendMessage(ms_org, { text: `Result: \n${stdout}` });
    });
  }
);

luckycmd(
  {
    nom_cmd: "eval",
    classe: "Owner",
    react: "📝",
    desc: "Executes JavaScript code on the server"
  },
  async (ms_org, lucky, cmd_options) => {
    const { arg, prenium_id } = cmd_options;

    if (!prenium_id) {
      return;
    }

    if (!arg[0]) {
      return lucky.sendMessage(ms_org, { text: "Please provide JavaScript code to run." });
    }

    try {
      let result = await eval(arg.join(" "));
      if (typeof result === "object") {
        result = JSON.stringify(result);
      }
      lucky.sendMessage(ms_org, { text: `Result: \n${result}` });
    } catch (err) {
      return lucky.sendMessage(ms_org, { text: `Error executing JavaScript code: ${err.message}` });
    }
  }
);


