# Deployment of LUCKY MD

### Step 1 : Create a fork of the project
- Click here [LUCKY-MD-FORK](https://github.com/Nignanfatao/OVL-Md/fork).

### Step 2: Get a SESSION-ID
- Click here [SESSION-ID](/).
- **Note**: Keep this SESSION-ID safe, as it is required to connect the bot to your WhatsApp account.

### Step 3: Create a database
- Click here to create: [DATA-BASE](https://supabase.com)
- If you already have one, it's no longer worth creating one
- Link to the Public Database:
```sh
postgresql://postgres.qnjvgxwyncnsbpfxwrbq:ovlmdmdpasse@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### Step 4: Deploy LUCKY-MD

### Deploy to Render
- **Create an account:** [account](https://dashboard.render.com/register).
- **Deploy:** [Deploy to Render](https://dashboard.render.com/web/new)

### Deploy To Koyeb
- **Create an account:** [koyeb-account](https://app.koyeb.com/auth/signup).
- **Deploy:** [Deploy to Koyeb](https://app.koyeb.com/deploy?name=Lucky-Mx&type=git&repository=Fred1e%2FLucky-Mx&branch=main&builder=dockerfile&env%5BSESSION-ID%5D=Lucky-SESSION-ID&env%5BMODE%5D=public&env%5BNOM_OWNER%5D=Ainz&env%5BNUMERO_OWNER%5D=255xxxxxxxx&env%5BPEFIXE%5D=%F0%9F%8E%90&env%5BMENU%5D=https%3A%2F%2Ffiles.catbox%2F.moe%2F7irwqn.jpeg&env%5BDATABASE%5D=postgresql%3A%2F%2Fpostgres.qnjvgxwyncnsbpfxwrbq%3Aluckymdmdpasse%40aws-0-eu-central-1.pooler.supabase.com%3A6543%2Fpostgres&ports=8000%3Bhttp%3B%2F)
### Deploy on panel
- **Create an account:** [panel account](https://bot-hosting.net) 
- **Deploy:**
- Step 1: Create a server
- Step 2: Create a '''index.js''' file on the server
- Step 3: Start the bot
- File to paste into the index:
```sh
const { spawnSync } = require('child_process');
const { existsSync } = require('fs');

function runCommand(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.error) {
    throw new Error('Failed to execute ${command} ${args.join(' ')} : ${result.error.message}`);
  }
  return result;
}

if (!existsSync('lucky')) {
  console.log('Cloning the repository...');
  runCommand('git', ['clone', 'https://github.com/Fred1e/Lucky-Mx', 'lucky']);

  console.log('Installing dependencies...');
  runCommand('npm', ['install'], { cwd: 'lucky' });
}

console.log('Starting the bot...');
runCommand('npm', ['run', 'Lucky'], { cwd: 'lucky' });
console.log('The bot is running...');
```
---

### 📄 License

This project is licensed under the MIT license. See the LICENSE file for more details.
