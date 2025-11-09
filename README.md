# 🍁 MACI Canada - Système de Gestion des Cartes Membership

## ✅ Nouveau Projet - Version Simplifiée et Fonctionnelle

Ce projet a été recréé de A à Z pour **garantir** que tout fonctionne.

### 🎯 Différences avec l'Ancien Projet

| Ancien | Nouveau |
|--------|---------|
| React + Vite (complexe) | HTML + JavaScript pur (simple) |
| 2 serveurs (backend + frontend) | 1 seul serveur |
| Port 3000 + 5173 | Port 3001 uniquement |
| Erreurs difficiles à déboguer | Tout dans la console |
| Build nécessaire | Aucun build |

## 🚀 Démarrage Rapide

### 1. Installation (UNE SEULE FOIS)

Double-cliquez sur **`install.bat`**

✅ **DÉJÀ FAIT !** Les dépendances sont installées.

### 2. Démarrage

Double-cliquez sur **`start.bat`**

Le serveur démarre sur : **http://localhost:3001**

### 3. Utilisation

Ouvrez votre navigateur sur : **http://localhost:3001**

## ✨ Fonctionnalités

### ✅ Ce Qui Fonctionne VRAIMENT

- ✅ **Ajout d'élèves** - Formulaire simple qui marche
- ✅ **QR Code automatique** - Généré et téléchargeable
- ✅ **Liste des élèves** - Affichage en temps réel
- ✅ **Filtrage par classe** - Automatique selon les élèves
- ✅ **Groupes personnalisés** - Créer vos propres groupes
- ✅ **Suppression d'élèves** - Avec confirmation
- ✅ **Photos** - Upload d'images

### 📚 Gestion des Groupes

Cliquez sur **"📚 Gérer les Groupes"** pour :
- Créer des groupes (ex: "6ème A", "Club Football", etc.)
- Supprimer des groupes
- Les groupes restent même après redémarrage

## 📁 Structure Simple

```
maci-students/
├── server.js           ← Serveur (tout en un)
├── public/
│   └── index.html      ← Interface (tout en un)
├── uploads/            ← Photos des élèves
├── maci.db             ← Base de données SQLite
├── install.bat         ← Installation
├── start.bat          ← Démarrage
└── README.md           ← Ce fichier
```

## 🧪 Test Rapide

1. **Démarrez** le serveur (`start.bat`)
2. **Ouvrez** http://localhost:3001
3. **Cliquez** sur "➕ Ajouter un Élève"
4. **Remplissez** :
   - Prénom : Test
   - Nom : Système
   - Classe : 6ème A
5. **Cliquez** "✅ Créer l'Élève"
6. **Le QR code s'affiche** automatiquement ! 🎉
7. **Téléchargez-le** ou cliquez "✅ Terminer"
8. **L'élève apparaît** dans la liste !

## 🔧 Si Un Problème Survient

### L'interface ne charge pas

1. Vérifiez que `start.bat` est lancé
2. Le terminal doit afficher :
   ```
   ✅ Serveur MACI Canada démarré sur http://localhost:3001
   ```
3. Ouvrez http://localhost:3001 (pas 3000 ou 5173)

### L'ajout d'élève ne fonctionne pas

1. Ouvrez la Console (F12)
2. Onglet "Console"
3. Les erreurs s'affichent en rouge
4. Partagez-moi l'erreur exacte

### Port déjà utilisé

Si le port 3001 est pris :
1. Fermez les autres applications
2. Ou modifiez `server.js` ligne 11 : `const PORT = 3002;`

## 📊 Base de Données

- **Type** : SQLite (fichier `maci.db`)
- **Tables** : 
  - `students` - Les élèves (29 colonnes)
  - `advantages` - Les avantages par élève
  - `groups` - Les groupes personnalisés
- **Sauvegarde** : Copiez `maci.db` pour sauvegarder

## 🎨 Personnalisation

### Changer les Couleurs

Modifiez `public/index.html` lignes 11-13 :
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Ajouter des Champs

Modifiez :
1. `server.js` - Table `students`
2. `public/index.html` - Formulaire

## 💡 Avantages de Cette Version

1. **Simple** - Un fichier HTML, un fichier JS serveur
2. **Rapide** - Pas de build, pas de compilation
3. **Debuggable** - Console du navigateur = erreurs claires
4. **Portable** - Copiez le dossier = ça marche ailleurs
5. **Léger** - Seulement 6 dépendances npm

## 📱 Utilisation Mobile

Le design est responsive ! Fonctionne sur :
- 📱 Téléphones
- 💻 Ordinateurs
- 🖥️ Tablettes

## 🆘 Support

En cas de problème :
1. Vérifiez que `start.bat` est lancé
2. Ouvrez F12 → Console
3. Partagez l'erreur exacte

---

**Version** : 1.0 - Simple et Fonctionnel
**Date** : 9 novembre 2024
**Dossier** : `C:\Users\OV3R\CascadeProjects\maci-students`

🍁 **MACI Canada Abidjan** 🇨🇮
