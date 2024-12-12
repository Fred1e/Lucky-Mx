# Déploiement de OVL-MD

### Étape 1 : Créer un fork du projet
- Cliquez ici [OVL-MD-FORK](https://github.com/Nignanfatao/OVL-Md/fork).

### Étape 2 : Obtenir une SESSION-ID
- Cliquez ici [SESSION-ID](https://quickest-elise-ainz-oest-org-53269c8e.koyeb.app/).
- **Remarque** : Conservez cette SESSION-ID en sécurité, car elle est nécessaire pour connecter le bot à votre compte WhatsApp.

### Étape 3 : Créer une base de données
- Cliquez ici pour créer: [DATA-BASE](https://supabase.com)
- Si vous en avez déjà une c'est plus la peine d'en créer
- Lien de la Base de données public:
```sh
postgresql://postgres.qnjvgxwyncnsbpfxwrbq:ovlmdmdpasse@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### Étape 4 : Déployer OVL-MD

### Deployer sur Render
- **Creer une compte:** [compte-render](https://dashboard.render.com/register).
- **Deployer:** [Deployer sur Render](https://dashboard.render.com/web/new)

### Deployer sur Koyeb
- **Creer un compte:** [compte-koyeb](https://app.koyeb.com/auth/signup).
- **Deployer:** [Deployer sur Koyeb](https://app.koyeb.com/deploy?name=ovl-md&type=git&repository=Nignanfatao%2FOVL-Md&branch=main&builder=dockerfile&env%5BSESSION-ID%5D=Ovl-SESSION-ID&env%5BMODE%5D=public&env%5BNOM_OWNER%5D=Ainz&env%5BNUMERO_OWNER%5D=226xxxxxxxx&env%5BPEFIXE%5D=%F0%9F%8E%90&env%5BMENU%5D=https%3A%2F%2Fi.ibb.co%2Fynx9QcZ%2Fimage.jpg&env%5BDATABASE%5D=postgresql%3A%2F%2Fpostgres.qnjvgxwyncnsbpfxwrbq%3Aovlmdmdpasse%40aws-0-eu-central-1.pooler.supabase.com%3A6543%2Fpostgres&ports=8000%3Bhttp%3B%2F)
### Deployer sur panel
- **Créer un compte:** [compte-panel](https://bot-hosting.net) 
- **Deployer:**
- Étape 1: creer un serveur
- Étape 2: créé une fichier ```index.js``` sur le serveur
- Étape 3: Démarrer le bot
- Fichier a coller dans l'index:
```sh
const { spawnSync } = require('child_process');
const { existsSync } = require('fs');

function runCommand(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.error) {
    throw new Error(`Échec de l'exécution de ${command} ${args.join(' ')} : ${result.error.message}`);
  }
  return result;
}

if (!existsSync('ovl')) {
  console.log('Clonage du dépôt...');
  runCommand('git', ['clone', 'https://github.com/Nignanfatao/OVL-Md', 'ovl']);

  console.log('Installation des dépendances...');
  runCommand('npm', ['install'], { cwd: 'ovl' });
}

console.log('Démarrage du bot...');
runCommand('npm', ['run', 'Ovl'], { cwd: 'ovl' });
console.log('Le bot est en cours d\'exécution...');
```
---

### 📄 License

Ce projet est sous la licence MIT. Consultez le fichier LICENSE pour plus de détails.
