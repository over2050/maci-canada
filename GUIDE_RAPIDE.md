# 🚀 GUIDE RAPIDE - 3 Commandes Seulement

## Pour Mettre en Ligne

### 1️⃣ Ouvrir PowerShell dans le dossier

Clic droit dans le dossier → "Ouvrir dans le terminal"

### 2️⃣ Taper ces commandes

```powershell
git init
git add .
git commit -m "MACI Canada"
```

### 3️⃣ Créer le dépôt GitHub

1. Allez sur https://github.com/new
2. Nom : `maci-canada`
3. Cliquez "Create repository"
4. **COPIEZ** les commandes qui s'affichent (elles ressemblent à ça) :

```powershell
git remote add origin https://github.com/VOTRE_NOM/maci-canada.git
git branch -M main
git push -u origin main
```

### 4️⃣ Déployer sur Render

1. Allez sur https://render.com
2. Connectez-vous avec GitHub
3. Cliquez "New +" → "Web Service"
4. Sélectionnez `maci-canada`
5. Laissez tout par défaut
6. Cliquez "Create Web Service"

### ✅ Fini !

Render vous donne un lien type :
```
https://maci-canada.onrender.com
```

**Partagez ce lien avec votre client !** 🎉

---

**Total : 5 minutes** ⏱️

## ⚠️ Premier Chargement

Prévenez le client : "Le premier chargement prend 30 secondes car c'est gratuit"

## 🔄 Pour Mettre à Jour

Si vous changez le code :
```powershell
git add .
git commit -m "Mise à jour"
git push
```

Render met à jour automatiquement !
