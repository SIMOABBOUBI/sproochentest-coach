# Sproochentest A2 — Coach

Application web (PWA) d'entraînement au Sproochentest A2 (oral luxembourgeois) : révision espacée, sessions guidées, entraînement à l'oral et examens blancs. 100% front-end, aucune base de données ni serveur requis — tout tourne dans le navigateur (`localStorage`).

## 📁 Contenu du projet

```
sproochentest/
├── index.html              → l'application (déjà fournie)
├── manifest.webmanifest    → métadonnées PWA (nom, icônes, raccourcis)
├── sw.js                   → service worker (mode hors-ligne + mises à jour)
├── icons/
│   ├── favicon-64.png
│   ├── apple-touch-icon.png
│   ├── icon-64.png
│   ├── icon-192.png
│   ├── icon-512.png
│   └── icon-512-maskable.png
└── README.md
```

## 🚀 Mettre le projet sur GitHub et obtenir un lien fonctionnel

### 1. Créer le dépôt

1. Va sur [github.com/new](https://github.com/new)
2. Nom du dépôt, par ex. `sproochentest-coach`
3. Laisse-le **public** (nécessaire pour GitHub Pages gratuit), ne coche aucune case d'initialisation
4. Clique **Create repository**

### 2. Pousser les fichiers

Dans le dossier du projet (celui-ci), depuis un terminal :

```bash
git init
git add .
git commit -m "Première version — Sproochentest A2 Coach"
git branch -M main
git remote add origin https://github.com/<ton-utilisateur>/sproochentest-coach.git
git push -u origin main
```

*(Remplace `<ton-utilisateur>` par ton nom d'utilisateur GitHub.)*

Pas envie d'utiliser Git en ligne de commande ? Sur la page du dépôt vide, GitHub propose aussi **"uploading an existing file"** : glisse-dépose directement `index.html`, `manifest.webmanifest`, `sw.js`, `README.md` et le dossier `icons/`.

### 3. Activer GitHub Pages

1. Dans le dépôt → **Settings** → **Pages** (menu de gauche)
2. Sous **Build and deployment** → **Source** : choisis **Deploy from a branch**
3. **Branch** : `main`, dossier `/ (root)` → **Save**
4. Attends 1–2 minutes, GitHub affiche le lien en haut de la page :
   `https://<ton-utilisateur>.github.io/sproochentest-coach/`

C'est ton lien fonctionnel — ouvre-le, l'app tourne directement, installable sur mobile ("Ajouter à l'écran d'accueil") grâce au manifest et au service worker.

### 4. Mettre à jour l'app plus tard

À chaque modification que tu pousses sur `main` :
1. Ouvre `sw.js` et incrémente `CACHE_VERSION` (ex. `v1` → `v2`)
   *(sans ça, les visiteurs qui ont déjà installé l'app continueront de voir l'ancienne version tant que le cache n'expire pas)*
2. `git add . && git commit -m "..." && git push`
3. GitHub Pages republie automatiquement en ~1 minute

## 🔧 Notes techniques

- **Icônes** : générées automatiquement (dégradé rouge/bleu du thème + drapeau luxembourgeois stylisé + "A2"). Remplace les fichiers dans `icons/` si tu veux ton propre logo — garde les mêmes noms et tailles.
- **Service worker (`sw.js`)** : cache l'app pour un usage hors-ligne et affiche un bandeau "✨ Nouvelle version disponible" quand une mise à jour est déployée (l'app le gère déjà via l'écouteur `message` présent dans `index.html`).
- **Raccourcis d'app** (`?go=daily|srs|express|mock`) : déjà câblés dans `index.html`, et déclarés dans `manifest.webmanifest` → apparaissent en appui long sur l'icône de l'app (Android/desktop).
- **Domaine personnalisé** (optionnel) : si tu as un nom de domaine, ajoute un fichier `CNAME` à la racine contenant ton domaine, puis configure un enregistrement DNS CNAME pointant vers `<ton-utilisateur>.github.io`.
