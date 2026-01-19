# 🚀 ProtoMusic PWA - Instructions de déploiement GitHub Pages

## Étape 1 : Copier les fichiers desktop

```powershell
# Copier tous les fichiers JS
Copy-Item "C:\Users\sebet\Desktop\ProtoMusic\protomusic-desktop\src\js\*" "C:\Users\sebet\Desktop\ProtoMusic\protomusic-pwa\js\" -Recurse -Force

# Copier les styles
Copy-Item "C:\Users\sebet\Desktop\ProtoMusic\protomusic-desktop\src\styles\*" "C:\Users\sebet\Desktop\ProtoMusic\protomusic-pwa\styles\" -Recurse -Force

# Copier le HTML (ON MODIFIERA APRÈS)
Copy-Item "C:\Users\sebet\Desktop\ProtoMusic\protomusic-desktop\src\index.html" "C:\Users\sebet\Desktop\ProtoMusic\protomusic-pwa\"

# Copier assets si besoin
Copy-Item "C:\Users\sebet\Desktop\ProtoMusic\protomusic-desktop\src\assets\*" "C:\Users\sebet\Desktop\ProtoMusic\protomusic-pwa\assets\" -Recurse -Force -ErrorAction SilentlyContinue
```

## Étape 2 : Modifier index.html

Ouvrez `C:\Users\sebet\Desktop\ProtoMusic\protomusic-pwa\index.html`

**Dans le `<head>`, ajoutez APRÈS `<meta name="viewport"...>` :**

```html
<!-- PWA Meta Tags -->
<meta name="theme-color" content="#ff0040">
<meta name="description" content="Music streaming app powered by ProtogenV2">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="ProtoMusic">

<!-- PWA Manifest -->
<link rel="manifest" href="/manifest.json">

<!-- Icons -->
<link rel="apple-touch-icon" href="/assets/icon-192.png">
<link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/assets/icon-512.png">
```

**Avant `</body>`, ajoutez :**

```html
<!-- Service Worker Registration -->
<script>
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('[SW] Registered'))
            .catch(err => console.error('[SW] Failed:', err));
    });
}
</script>
```

## Étape 3 : Créer le repo GitHub

1. Allez sur https://github.com/new
2. Nom : `protomusic` (ou ce que vous voulez)
3. Public
4. **NE COCHEZ RIEN d'autre**
5. Create repository

## Étape 4 : Push le code

```powershell
cd C:\Users\sebet\Desktop\ProtoMusic\protomusic-pwa
git init
git add .
git commit -m "Initial PWA commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/protomusic.git
git push -u origin main
```

## Étape 5 : Activer GitHub Pages

1. Repo → **Settings**
2. **Pages** (menu gauche)
3. Source : **Deploy from a branch**
4. Branch : **main** → **/ (root)**
5. **Save**

## ✅ Résultat

Votre app sera accessible sur : `https://VOTRE_USERNAME.github.io/protomusic`

**Sur mobile :**
- Ouvrir l'URL dans Chrome
- Appuyer sur **"Ajouter à l'écran d'accueil"**
- L'app s'installe comme une vraie app !

**✅ Pas de CORS, ça marchera directement !**
