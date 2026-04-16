# MindTrade — Brief complet pour Claude Code

## Contexte projet
SaaS de psychologie du trading. Copilote mental du trader — intervient AVANT l'ouverture des charts, pas après. Entrepreneur solo, budget < 1000€.

---

## Ce qui existe déjà (fichiers de référence)

- `mindtrade_landing_final.html` — Landing page complète, production-ready
- `mindtrade_dashboard_final_v2.html` — Dashboard complet, 7 vues fonctionnelles

**Ces fichiers sont la référence visuelle exacte. Reproduis le design pixel par pixel.**

---

## Design System (DA)

```
Fonts:
  - Fraunces serif → titres, grands chiffres
  - Outfit → corps de texte
  - Montserrat 900 → brand/logo

Palette:
  --bg: #fafaf8
  --ink: #0c0c0a
  --navy: #0f2744
  --gold: #b8860b
  --g: #15803d (succès)
  --r: #991b1b (danger)
  --a: #92400e (warning)

Border radius: 14px cards, 7px boutons
Shadow: 0 1px 3px rgba(12,12,10,.05), 0 4px 16px rgba(12,12,10,.07)
```

---

## Stack technique cible

```
Framework:   Next.js 14 (App Router)
Database:    Supabase (PostgreSQL + Auth + Realtime)
Payments:    Stripe (3 plans)
Deployment:  Vercel
Language:    TypeScript
Styling:     Tailwind CSS + CSS variables (DA ci-dessus)
```

---

## Pricing

| Plan | Prix | Type |
|------|------|------|
| Mensuel | 39€/mois | Stripe recurring |
| Annuel | 349€/an | Stripe recurring |
| **Lifetime** | **197€** ~~397€~~ | Stripe one-time |

- Accès immédiat après paiement Stripe
- Remboursement 14 jours garanti
- Liens Stripe à créer : LIFETIME, MENSUEL, ANNUEL

---

## Features produit (7 vues dashboard)

### 1. Vue d'ensemble
- Hero score mental (sur 100) avec verdict go/no-go
- Biais du moment en temps réel (FOMO, revenge, overconfiance)
- Métriques : win rate, P&L net, nb trades, streak check-ins
- Graphique score mental 30 jours
- Grille check-ins 4 semaines
- Biais du mois (barres de progression)
- Objectifs mensuels
- Score de discipline (distinct du score mental)
- Confluences corrélées au win rate
- Derniers trades

### 2. Check-in mental
- 5 questions quotidiennes (sommeil, stress, focus, distractions, état émotionnel)
- Score calculé sur 100
- Verdict : Optimal (>75) / Attention requise (60-74) / Évite de trader (<60)
- Biais détecté automatiquement

### 3. Log de trades
- Champs : actif, direction (Long/Short), P&L, R/R, état émotionnel, score mental
- Filtres : tous, Long, Short, gagnants, perdants, FOMO/revenge
- Stats recalculées en temps réel : win rate, P&L total, score moyen
- Suppression de trades

### 4. Rapport hebdomadaire
- Résumé : win rate, P&L, score moyen
- Meilleur jour vs pire jour
- 3 insights détectés automatiquement
- 3 actions concrètes pour la semaine suivante
- Graphiques : score mental par jour, P&L par jour

### 5. Confluences
- Listes : obligatoires + bonus
- Check avant chaque trade
- Score de validité du setup (%)
- Impact automatique sur win rate
- CRUD confluences (ajouter/supprimer)

### 6. Journal
- 3 sections : bien passé / mal passé / ce que je change demain
- Sélecteur humeur (5 emojis)
- Note en étoiles (1-5)
- Tags : Discipliné, FOMO, Revenge, Profits tôt
- Streak d'écriture
- Historique des entrées

### 7. Guide
- Interprétation du score mental
- Score de discipline
- Biais du moment
- Confluences

---

## Structure base de données Supabase

```sql
-- Utilisateurs (géré par Supabase Auth)
users (id, email, created_at, plan, plan_expires_at)

-- Check-ins quotidiens
checkins (
  id, user_id, date,
  sommeil INT,        -- 1-10
  stress INT,         -- 1-10
  focus INT,          -- 1-10
  distractions INT,   -- 1-10
  etat_emotionnel INT,-- 1-10
  score INT,          -- calculé (moyenne * 10)
  verdict TEXT,       -- 'optimal' | 'attention' | 'eviter'
  created_at
)

-- Trades
trades (
  id, user_id, date,
  actif TEXT,         -- EUR/USD, SP500...
  direction TEXT,     -- Long | Short
  pnl DECIMAL,        -- en €
  rr DECIMAL,         -- ratio R/R
  emotion TEXT,       -- Calme, FOMO, Revenge...
  score_mental INT,   -- score du jour au moment du trade
  created_at
)

-- Confluences
confluences (
  id, user_id,
  titre TEXT,
  description TEXT,
  type TEXT,          -- 'required' | 'bonus'
  created_at
)

-- Checks de confluences par trade
trade_confluences (
  id, trade_id, confluence_id, checked BOOLEAN
)

-- Journal
journal_entries (
  id, user_id, date,
  bien_passe TEXT,
  mal_passe TEXT,
  changement_demain TEXT,
  mood TEXT,          -- emoji
  rating INT,         -- 1-5
  tags TEXT[],        -- array de tags
  created_at
)

-- Objectifs
objectives (
  id, user_id,
  titre TEXT,
  progress INT,       -- 0-100
  created_at
)
```

---

## Auth & Accès

- Auth Supabase (email + password)
- Après paiement Stripe → webhook → update `users.plan`
- Plans : 'monthly' | 'annual' | 'lifetime'
- Middleware Next.js → redirect vers /login si non authentifié
- Redirect vers /pricing si plan expiré

---

## Structure Next.js recommandée

```
/app
  /page.tsx              → landing page (reproduire landing_final.html)
  /pricing/page.tsx      → page pricing
  /login/page.tsx        → connexion
  /register/page.tsx     → inscription
  /dashboard
    /layout.tsx          → sidebar + topbar
    /page.tsx            → vue d'ensemble
    /checkin/page.tsx    → check-in
    /log/page.tsx        → log de trades
    /rapport/page.tsx    → rapport hebdo
    /confluences/page.tsx→ confluences
    /journal/page.tsx    → journal
    /guide/page.tsx      → guide
  /api
    /stripe/webhook      → handle paiements
    /stripe/checkout     → créer session
/components
  /ui                    → boutons, cards, inputs
  /dashboard             → composants dashboard
  /charts                → graphiques (recharts)
/lib
  /supabase.ts           → client supabase
  /stripe.ts             → client stripe
  /auth.ts               → helpers auth
```

---

## Variables d'environnement nécessaires

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_MONTHLY=
STRIPE_PRICE_ANNUAL=
STRIPE_PRICE_LIFETIME=
NEXT_PUBLIC_URL=https://mindtrade.app
```

---

## Ordre de développement recommandé

1. **Setup** — Next.js + Tailwind + Supabase + variables d'env
2. **Auth** — login, register, middleware protection
3. **Landing** — reproduire landing_final.html en Next.js
4. **Dashboard layout** — sidebar + topbar + routing
5. **Check-in** — flow 5 questions + calcul score
6. **Vue d'ensemble** — hero score + métriques + graphiques
7. **Log de trades** — CRUD + filtres + stats
8. **Confluences** — CRUD + scoring
9. **Journal** — éditeur + historique
10. **Rapport hebdo** — agrégation données + graphiques
11. **Stripe** — checkout + webhook + accès conditionnel
12. **Deploy** — Vercel + domaine

---

## Commande de démarrage pour Claude Code

```
Tu as accès aux fichiers mindtrade_landing_final.html et mindtrade_dashboard_final_v2.html 
qui sont la référence visuelle exacte du produit.

Commence par le setup : initialise un projet Next.js 14 avec TypeScript, 
Tailwind CSS, et configure Supabase. 

Reproduis exactement la DA des fichiers HTML (couleurs, fonts, spacing).
Stack : Next.js 14 + Supabase + Stripe + Vercel.
```

---

## Infos importantes

- Le produit intervient AVANT le trade (pas après) — c'est le différenciateur clé
- Score mental DISTINCT du score de discipline (exclusif MindTrade)
- Confluences corrélées automatiquement au win rate
- 10 minutes par jour maximum pour l'utilisateur
- Bilingue FR/EN (toggle dans la nav)
- Dark mode toggle dans le dashboard
- Données sauvegardées en localStorage dans les fichiers HTML de référence → à migrer en Supabase
