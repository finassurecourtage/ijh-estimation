# Estimation de volume — IJH Transport

Application web mobile-first permettant aux clients d'IJH Transport (déménagement
France → Israël en conteneur) d'estimer eux-mêmes le volume de leur déménagement
à partir de photos de leurs pièces, analysées par l'IA Claude (Anthropic).

## Fonctionnement

1. Le client ajoute une pièce, puis prend une photo (ou en choisit dans sa galerie).
2. La photo est envoyée au serveur, qui l'analyse avec Claude (vision) et renvoie
   la liste des objets détectés avec leur quantité et leur volume unitaire en m³.
3. Le client peut corriger les quantités (+/−), supprimer un objet, une photo ou
   une pièce entière, et ajouter des objets à la main depuis une liste standard.
4. Un total en m³ s'affiche en permanence, avec une jauge de remplissage pour un
   conteneur 20 pieds (≈28 m³ utiles) et un 40 pieds (≈58 m³ utiles).
5. L'estimation est sauvegardée automatiquement dans le navigateur (localStorage) :
   si le client ferme l'onglet ou recharge la page, il retrouve son travail.
6. À la fin, un formulaire (nom, téléphone, email, ville de départ, date
   souhaitée) envoie l'estimation complète par email à IJH Transport, avec le
   détail par pièce et les photos en pièces jointes.

La mention **« Estimation indicative à ±20 %, volume confirmé lors du devis »**
est affichée en permanence dans l'application et rappelée dans l'email reçu.

## Stack technique

- **Next.js 16** (App Router) + **TypeScript**, déployable sur **Vercel**.
- **Tailwind CSS 4** pour le design (couleurs portuaires : bleu acier / jaune
  signalisation).
- **`@anthropic-ai/sdk`** pour l'analyse d'image, modèle `claude-sonnet-5`,
  avec sortie structurée (schéma Zod) pour garantir un JSON fiable.
- **Resend** pour l'envoi d'email avec pièces jointes.
- Compression d'image côté client (canvas, redimensionnement à 1600 px max,
  JPEG qualité 0,8) avant tout envoi au serveur.
- Limiteur de débit par IP (anti-abus) sur les deux routes API.

---

## 1. Installation locale

```bash
npm install
cp .env.example .env.local
```

Puis complétez `.env.local` (voir section suivante), et lancez :

```bash
npm run dev
```

L'application est disponible sur http://localhost:3000.

---

## 2. Obtenir la clé API Anthropic (Claude)

1. Rendez-vous sur [console.anthropic.com](https://console.anthropic.com/).
2. Créez un compte ou connectez-vous, puis ajoutez un moyen de paiement
   (l'API est payante à l'usage — voir le coût estimé plus bas).
3. Allez dans **Settings → API Keys**, cliquez sur **Create Key**.
4. Copiez la clé (elle commence par `sk-ant-...`) dans `ANTHROPIC_API_KEY`
   (fichier `.env.local` en local, ou variable d'environnement Vercel en
   production). Cette clé ne doit **jamais** être exposée côté navigateur —
   elle n'est utilisée que dans les routes API serveur (`app/api/...`).

### Coût estimé par photo analysée

Avec le modèle `claude-sonnet-5` (2 $ / million de tokens en entrée,
10 $ / million de tokens en sortie) :

- Une photo compressée (≤1600 px, JPEG) représente environ 1 600 à 2 600
  tokens d'image (selon ses dimensions réelles — la règle Anthropic est
  environ `largeur × hauteur / 750`), plus le prompt système (~350 tokens)
  et la réponse JSON (~150-400 tokens selon le nombre d'objets détectés).
- **Coût réel constaté : environ 0,01 à 0,02 $ US par photo analysée**
  (soit entre 0,009 € et 0,02 € environ).
- Pour un déménagement moyen de 8 à 10 photos, le coût d'analyse IA total
  est donc de l'ordre de **0,10 à 0,20 $**.

Ces montants sont indicatifs et dépendent de la taille réelle des images et
du nombre d'objets visibles ; consultez votre tableau de bord Anthropic pour
le suivi exact de la consommation.

---

## 3. Obtenir la clé API Resend (envoi d'email)

1. Créez un compte sur [resend.com](https://resend.com/).
2. Dans **Domains**, ajoutez et vérifiez votre domaine (ex. `ijhtransport.com`)
   en suivant les instructions DNS (SPF/DKIM) — nécessaire pour envoyer depuis
   une adresse `@ijhtransport.com` et éviter les spams.
3. Dans **API Keys**, créez une clé et copiez-la dans `RESEND_API_KEY`.
4. Renseignez `EMAIL_DESTINATAIRE` (l'adresse qui reçoit chaque demande) et,
   si besoin, `EMAIL_EXPEDITEUR` (doit utiliser le domaine vérifié).

Resend offre un plan gratuit (100 emails/jour) largement suffisant pour
démarrer.

---

## 4. Déploiement sur Vercel

1. Poussez ce projet sur un dépôt GitHub (ou GitLab/Bitbucket).
2. Sur [vercel.com](https://vercel.com/), cliquez sur **Add New → Project**
   et importez le dépôt.
3. Dans **Environment Variables**, ajoutez :
   - `ANTHROPIC_API_KEY`
   - `RESEND_API_KEY`
   - `EMAIL_DESTINATAIRE`
   - `EMAIL_EXPEDITEUR` (optionnel)
4. Cliquez sur **Deploy**. Vercel détecte automatiquement Next.js.
5. Une fois déployé, vous obtenez une URL du type
   `https://ijh-estimation.vercel.app`.

### Nom de domaine personnalisé (recommandé)

Dans **Settings → Domains** du projet Vercel, ajoutez par exemple
`estimation.ijhtransport.com` et suivez les instructions pour créer
l'enregistrement DNS (CNAME) correspondant chez votre registrar.

---

## 5. Brancher l'application sur ijhtransport.com

Deux options :

### Option A — Lien direct ou sous-domaine (recommandé)

Ajoutez un bouton « Estimer mon volume » sur votre site vitrine, pointant
vers `https://estimation.ijhtransport.com`. C'est l'option la plus fiable :
pas de contrainte d'iframe, meilleure expérience sur mobile (plein écran,
accès direct à l'appareil photo).

### Option B — Intégration en iframe

Le projet autorise déjà l'affichage en iframe depuis `ijhtransport.com` et
`www.ijhtransport.com` (voir `next.config.ts`, en-tête
`Content-Security-Policy: frame-ancestors`). Pour intégrer la page dans le
site vitrine (ex. `site/index.html`) :

```html
<iframe
  src="https://estimation.ijhtransport.com"
  title="Estimation de volume de déménagement"
  style="width:100%; min-height:100vh; border:0;"
  allow="camera"
></iframe>
```

L'attribut `allow="camera"` est nécessaire pour que la prise de photo
fonctionne dans l'iframe sur certains navigateurs mobiles. Si vous changez
de nom de domaine pour le site vitrine, mettez à jour la liste
`FRAME_ANCESTORS` dans `next.config.ts`.

---

## 6. Anti-abus et limites

- **Limite de débit** : 30 photos analysées par heure et par adresse IP
  (route `/api/analyze-photo`), et 10 envois d'estimation par heure et par IP
  (route `/api/send-estimate`). Réglable dans `lib/constants.ts`
  (`MAX_PHOTOS_PER_HOUR_PER_IP`) et `app/api/send-estimate/route.ts`
  (`SEND_LIMIT_PER_HOUR`).
- **Taille maximale par image** : 8 Mo avant compression côté client (déjà
  réduite à ~200-400 Ko après compression dans la plupart des cas).
- **Validation du type de fichier** : seuls JPEG/PNG/WebP sont acceptés,
  les autres fichiers sont rejetés par l'API.
- **Important — limite de débit en mémoire** : le compteur anti-abus est
  stocké en mémoire du serveur. Sur Vercel (environnement serverless), chaque
  instance peut avoir son propre compteur, ce qui rend la limite moins stricte
  en cas de fort trafic simultané. Pour une limite garantie en production à
  fort trafic, remplacez `lib/rate-limit.ts` par une solution partagée
  (Upstash Redis, Vercel KV).

---

## 7. Structure du projet

```
app/
  page.tsx                  Page principale (toute la logique client)
  layout.tsx                Layout racine, métadonnées, police
  api/analyze-photo/route.ts   Analyse IA d'une photo
  api/send-estimate/route.ts   Envoi de l'email récapitulatif
lib/
  anthropic.ts               Appel à Claude (vision + sortie structurée)
  email.ts                   Construction du HTML de l'email
  validation.ts               Nettoyage/validation du JSON renvoyé par l'IA
  rate-limit.ts                Limiteur de débit par IP
  constants.ts                  Liste d'objets standards, volumes conteneurs
  compress-image.ts             Compression d'image côté client
  types.ts                     Types partagés
hooks/useEstimate.ts         État de l'estimation + persistance localStorage
components/                  Composants d'interface (jauge, pièce, objets...)
```

## 8. Limites connues / pistes d'amélioration

- Le limiteur de débit en mémoire ne garantit pas une limite stricte sur
  plusieurs instances serverless (voir section 6).
- Les photos sont jointes à l'email en pièce jointe ; au-delà d'environ 18 Mo
  cumulés, les photos excédentaires ne sont pas jointes (l'email part quand
  même avec le détail texte complet).
- Aucune authentification n'est requise pour utiliser l'outil : c'est voulu
  (usage public, simple, orienté conversion), mais cela signifie que
  n'importe qui disposant du lien peut l'utiliser.
