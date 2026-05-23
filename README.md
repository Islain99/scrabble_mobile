# Scrabble Mobile — Expo

Application mobile React Native connectée au même backend Railway que le frontend web.

## Installation

```bash
cd scrabble-mobile
npm install
```

## Lancer

```bash
# Dans Expo Go (iOS/Android) — le plus rapide
npx expo start

# Scan le QR code avec l'app Expo Go sur ton téléphone
```

## Build pour production

```bash
# Installer EAS CLI
npm install -g eas-cli
eas login

# Configurer
eas build:configure

# Build iOS (TestFlight)
eas build --platform ios

# Build Android (APK / Play Store)
eas build --platform android
```

## Structure

```
scrabble-mobile/
├── app/
│   ├── _layout.tsx        # Fonts + providers
│   └── index.tsx          # Routage Start / Game / End
├── src/
│   ├── api/
│   │   └── gameService.ts # Même API que le web (Railway)
│   ├── components/
│   │   ├── Board.tsx      # Plateau 15x15 tactile
│   │   ├── Tile.tsx       # Tuile individuelle
│   │   ├── TileRack.tsx   # Rack scrollable
│   │   ├── ScorePanel.tsx # Scores
│   │   └── ActionBar.tsx  # Boutons d'action
│   ├── screens/
│   │   ├── StartScreen.tsx
│   │   ├── GameScreen.tsx
│   │   └── EndScreen.tsx
│   ├── hooks/
│   │   └── useGameLogic.ts # Toute la logique de jeu
│   ├── constants/
│   │   └── index.ts       # Couleurs, fonts, points lettres
│   └── types.ts           # Types TypeScript
└── assets/
```

## Flow tactile (pas de drag-and-drop)

Le drag HTML5 ne fonctionne pas sur mobile natif.
Le flow choisi est **tap-to-place** :

1. **Tap** sur une lettre du rack → elle se surligne (sélectionnée)
2. **Tap** sur une case vide du plateau → la lettre s'y pose
3. **Tap** sur une tuile verte (temporaire) → elle revient dans le rack
4. **Tap** à nouveau sur la même lettre du rack → désélectionne

## Variables d'environnement

Le backend est hardcodé dans `src/api/gameService.ts` :
```
https://scrabblefull-stack-production.up.railway.app/game
```
Change cette URL si tu déploies un nouveau backend.