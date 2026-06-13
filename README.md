# ඔමි - Omi Card Game

Sri Lankan traditional card game — Classic & Modern modes, Sinhala/English support.

## Game Rules

### Classic Omi
- 4 players, 2 teams (You + Partner vs 2 Opponents)
- 13 cards each, 8 tricks per round
- Opponent picks trump suit
- Kata Kola scoring: A, K, Q, J, 10 each = 1 point (20 total per round)

### Modern Omi — Baila (බේලා)
- Before opponent picks trumps, YOU declare Baila
- You pick the trump suit yourself
- Partner sits out — you play alone
- Must win 4+ of 8 tricks to succeed
- **Rule:** At least 1 card in your hand must NOT be the chosen trump suit

### Modern Omi — Kiya (කිය ගහනවා)
- After opponent picks trumps, declare Kiya
- Partner sits out — you play alone
- Must win ALL 8 tricks
- Win = +3 bonus Kata Kola cards added to your score
- Lose = -5 penalty

## Versions
| Version | Status | Features |
|---------|--------|---------|
| v1.0.0 | Current | Classic + Modern, AI, Sinhala/English |
| v1.1.0 | Planned | Online multiplayer |
| v2.0.0 | Planned | Play Store release |

## Setup
```bash
npm install
npx expo start          # Dev server
eas build -p android --profile preview   # Build APK (needs Expo account)
```

## Architecture
Expandable modular design:
- `src/engine/` — Pure game logic (no UI dependencies)
- `src/store/` — Zustand state management
- `src/components/` — Reusable UI components
- `src/i18n/` — Add new languages by adding a new translation file
- `app/` — Expo Router screens
