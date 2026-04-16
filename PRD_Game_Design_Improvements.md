# PRD - Améliorations de Conception du Jeu MMA Promotion Manager

**Version**: 2.0 (Adaptée au jeu)  
**Date**: Avril 2026  
**Statut**: En développement  

---

## 1. Vision Globale

Transformer **MMA Promotion Manager** en une expérience addictive de gestion stratégique où chaque décision a des conséquences visibles, où la progression est gratifiante, et où le joueur comprend clairement son objectif (construire la meilleure organisation) tout en restant motivé à relever de nouveaux défis.

---

## 2. Principes de Conception Fondamentaux

### 2.1 Un Objectif Clair
- **Objectif Principal**: Le joueur doit comprendre immédiatement qu'il dirige une **organisation MMA** avec pour but de :
  1. Gagner de l'argent avec chaque événement
  2. Construire le meilleur roster possible
  3. Atteindre la viabilité financière et la dominance
  
- **Implémentation**:
  - Afficher dans le **Header** : Nom de la promotion + Budget (toujours visible)
  - Créer une mission/tutoriel clairs : "Organisez votre premier événement et gagnez de l'argent"
  - Afficher la progression financière : "X combats organisés", "Budget: $XXX,XXX"
  - Afficher des milestone visibles : "1er événement", "1er profit", "100 combats"

**Critères de Succès**:
- Un nouveau joueur comprend qu'il gère une organisation en < 15s
- Le budget et nom de la promotion sont toujours visibles
- Progression claires vers les objectifs secondaires (milestones)

---

### 2.2 Une Première Expérience Satisfaisante
- **Problème**: Les premières minutes (onboarding) déterminent si le joueur continue
- **Solution**: 
  - Créer le premier événement en < 2 minutes
  - Voir des résultats immédiats (victoire, argent gagné)
  - Ressentir du succès dès le premier événement

**Implémentation**:
- **Onboarding guidé** :
  1. Nommer sa promotion (déjà présent ✓)
  2. Recevoir 16 combattants prêts à combattre
  3. Guide rapide : "Glissez 2 combattants pour créer votre premier match"
  4. Simulation pré-configurée : 1 fight avec combattants bien équilibrés
  5. Affichage dramatique du résultat : "🏆 VICTOIRE! +$5,000"

- **Onboarding visuel** :
  - Animation lors du premier profit (+$5,000 en vert)
  - Notification de succès "Premier événement complété !"
  - Déblocage immédiat du prochain onglet

**Critères de Succès**:
- > 85% des joueurs créent leur premier événement en < 3 minutes
- Première simulation génère un profit (même petit)
- Feedback visuel+audio sur chaque étape clé

---

### 2.3 La Curiosité
- **Objectif**: Donner envie au joueur de continuer à organiser plus d'événements
- **Éléments de curiosité**:
  - **Aléatoire** : Les combats ont des résultats aléatoires (pas prédictibles)
  - **Événements contextuels** : Événements rares qui impactent l'organisation (blessure, contrat lucratif, etc.)
  - **Nouveau contenu déverrouillé** : À partir de certains milestones (Lire: Histoire de la promotion)
  - **Défis spéciaux** : "Atteindre +$200k", "Organiser 50 événements", "Recruter le champion"

**Implémentation**:
- Afficher dans le **History** les événements contextuels avec impact dramatique
- Teasers de contenu futur : "À X événements, découvrez des défis épiques"
- **Foreshadowing Bar** (déjà présente) : Montrer des avertissements d'événements rares
- Récompenses visuelles pour les milestones (badges, notifications)

**Critères de Succès**:
- Chaque 5 événements = au moins 1 événement contextuel
- Temps de session moyen > 7-10 minutes
- Taux de return > 60% après 1ère session

---

### 2.4 Le Sentiment de Progression
- **Objectif**: Le joueur doit sentir sa **promotion grandir**
- **Formes de progression visibles**:
  - **Budget** : $100k → $200k → $500k → $1M+ (augmentation à chaque événement)
  - **Roster** : 16 combattants → Recrutement de champions
  - **Statistiques** : "10 combats organisés" → "50" → "100+" → Milestone badges
  - **Événements contextuels** : Accumulation d'événements rares (sponsorships, rivalités)
  - **Histoire de la promotion** : Timeline visible dans History

**Implémentation**:
- Afficher la **progression du budget** en temps réel avec animation (+$5k en vert, -$3k en rouge)
- Counter visible : "Combats organisés: 15/50" avec barre de progression
- Badge système : Débloquer "Entrepreneur", "Champion Manager", "Légende" aux milestones
- **Season rewards** : À X événements, gains additionnels

**Critères de Succès**:
- Progression financière visible après chaque événement (flash color)
- 5+ milestones atteignables en 20-30 événements
- Déblocage de contenu (badges, défis) régulièrement

---

### 2.5 Le Feedback
- **Objectif**: Chaque action produit une réaction immédiate et satisfaisante
- **Types de feedback** (dans MMA Promotion Manager) :
  - **Visuel** : 
    - Flash de couleur du budget (+vert, -rouge)
    - Animations lors de la simulation
    - Nombre flottant des gains/pertes
  - **Textuel** :
    - "+$5,000 Net profit" après événement
    - "VICTOIRE!" vs "DÉFAITE"
    - Notifications d'événements contextuels
  - **Sonore** (optionnel) :
    - Son de victoire
    - Bruit d'alerte pour les événements négatifs
  - **Contextuel** :
    - Écran de résultats avec statistiques détaillées

**Implémentation**:
- **Après chaque simulation** :
  - Afficher le screen "Results" avec animations
  - Flash du budget (vert si profit, rouge si perte)
  - Nombres flottants des revenus/coûts
  - Événement contextuel avec description dramatique
  
- **Lors de recrutement** :
  - Animation du nouvel ajout au roster
  - Notification "Combattant recruté!"

**Critères de Succès**:
- 100% des actions (simuler, recruter) ont retour visuel
- Budget flash observable immédiatement (320ms)
- Délai résultats < 1s après clic "Simuler"

---

### 2.6 Un Défi Adapté (Équilibre Économique)
- **Problème**: Le budget initial ($100k) peut être épuisé trop rapidement, frustrant le joueur
- **Solution**: 
  - Équilibrage fin des coûts/revenus
  - Profit même avec matches perdus (gain net positif)
  - Aléatoire pour crée du suspense

**Implémentation**:
- **Équation économique** (actuelle) :
  - Revenue: $8,000/combat
  - Cost: $3,000/combat + $5,000 fixed
  - Net pour 1 combat: $8,000 - $3,000 - $5,000 = **$0** (problème!)
  - Net pour 5 combats: $40,000 - $15,000 - $5,000 = **+$20,000** ✓

- **Ajustements proposés** :
  - Augmenter revenue à $8,500/combat OU
  - Réduire fixed cost à $4,000 OU
  - Les deux pour plus de marge

- **Variance aléatoire** : ±20% des revenus (match bonus/malus)

**Critères de Succès**:
- Profit net positif pour tout événement (min 1 combat)
- Taux de bankruptcy < 5% avant événement 10
- Progression economique visible et gratifiante

---

## 3. Améliorations Détaillées

### 3.1 Équilibre Économique Progressif

**Objectif**: Créer une progression financière satisfaisante qui challenge sans frustrer

**Phases de jeu**:
```
Phase 1 (Événements 1-5)    : "Démarrage"    - Budget croissant lentement
Phase 2 (Événements 6-15)   : "Croissance"   - Profits réguliers, éviter bankruptcy
Phase 3 (Événements 16-30)  : "Stabilité"    - Budget stable et solide
Phase 4 (Événements 31+)    : "Dominance"    - Recrutement champions, gestion avancée
```

**Paramètres par phase**:
- Taille des événements recommandée (1 → 5 combats)
- Probabilité d'événements contextuels (60%)
- Impacts financiers des événements

**Implémentation MMA**:
- Tous les événements doivent générer net > $0
- À partir de Phase 2, net par événement > $10,000
- Événements rares peuvent causer des variations (blessure = -$5k, sponsor = +$25k)

**Critères de Succès**:
- < 5% bankruptcy rate au cours des 10 premiers événements
- Budget moyen croissant : +15% par événement (phase 1-2)

---

### 3.2 Règles Cohérentes et Transparentes

**Objectif**: Le joueur comprend les mécaniques et peut planifier

**Principes**:
- **Transparence économique** : Coûts/revenus affichés avant simulation
- **Prévisibilité des combats** : Stats du combattant + opposant visibles
- **Règles stables** : Aucune mécanique cachée
- **Événements aléatoires** : Expliqués mais résultats imprévisibles

**Implémentation**:
- Afficher avant simulation : "Revenue: +$8.5k × 3 = +$25.5k"
- Afficher avant simulation : "Cost: $3k × 3 + $4k = $13k"
- Afficher avant simulation : "Net estimé: +$12.5k" (déjà présent ✓)
- Dans la page **History** : Expliquer chaque événement contextuel
- Tooltip au hover sur stats : "Frappe (Attack) vs Lutte (Grapple) vs Sol (Ground)"

**Critères de Succès**:
- 100% des coûts/revenus expliqués avant action
- Aucun bug économique non-intentionnel
- Joueurs rapportent compréhension > 8/10

---

## 4. Architecture de Progression (MMA Promotion Manager)

### 4.1 Système de Milestones

| Milestone | Événements | Budget Cible | Récompense |
|-----------|-----------|-------------|-----------|
| Démarrage | 0 | $100,000 | Tutoriel complet |
| 1er Profit | 1 | +$5,000 | Notification "Entrepreneur!" |
| Stabilité | 5 | +$50,000 | Badge "Manager" |
| Croissance | 15 | +$200,000 | Déblocage "Défis spéciaux" |
| Dominance | 30 | +$500,000 | Badge "Légende" |
| Légendaire | 50+ | $1M+ | Hall of Fame |

### 4.2 Déblocage de Contenu

**Déverrouillage par Progression**:
- **Événement 1** : Tutoriel + Création 1er événement
- **Événement 3** : Option "Recruter combattants"
- **Événement 5** : Affichage History des événements contextuels
- **Événement 10** : Accès à "Défis personnalisés" (organiser X combats avec Y conditions)
- **Événement 20+** : Skins/cosmétiques pour promotion (logos personnalisés, noms d'équipe)

### 4.3 Événements Contextuels (Existing)

**Distribution** :
- 60% chance d'événement contextuel après chaque simulation
- Rareté : Commun (40%), Rare (40%), Légendaire (20%)
- Impact : Budget (+/- $5-25k), Combattants (blessure, suspension)

**Types existants** :
- Sponsorship (+$25k)
- Blessure (-$5k, suspension 2 events)
- Contrat lucratif (+$10k)
- Scandal (-$10k)

---

## 5. Spécifications Techniques (MMA Promotion Manager)

### 5.1 Formules Économiques (À REVOIR)

**Problème identifié** :
```javascript
// État actuel (NÉGATIF):
const REVENUE_PER_FIGHT = 8000
const COST_PER_FIGHT = 3000
const FIXED_COST = 5000

// Pour 1 combat:
net = 8000 - 3000 - 5000 = 0 (problème!)

// Pour 3 combats:
net = (8000 * 3) - (3000 * 3) - 5000 = 24000 - 9000 - 5000 = 10000 ✓
```

**Solution proposée** :
```javascript
// Option 1: Augmenter les revenus
const REVENUE_PER_FIGHT = 8500  // +$500
// => 1 fight: 8500 - 3000 - 5000 = $500
// => 3 fights: 25500 - 9000 - 5000 = +$11,500

// Option 2: Réduire les coûts fixes
const FIXED_COST = 4000  // -$1000
// => 1 fight: 8000 - 3000 - 4000 = $1000
// => 3 fights: 24000 - 9000 - 4000 = +$11,000

// Option 3: Aléatoire variance
const variance = 0.8 + (Math.random() * 0.4) // 80%-120% du revenue
const netRevenue = REVENUE_PER_FIGHT * variance * fightCount
```

**Recommandation** : **Appliquer les deux** (augmenter revenue + réduire fixed cost) pour plus de marge

---

### 5.2 Animations & Feedback Timing

**Écran de Résultats**:
- Apparition : 300ms fade-in
- Affichage des chiffres : 500ms stagger (revenus → coûts → net)
- Flash budget : 320ms (déjà implémenté ✓)
- Événement contextuel : 2s après résultats

**Notifications**:
- Milestone atteint : Pop-up 2s
- Événement rare : Notification rouge (Foreshadowing Bar)
- Nouveau badge : Animation 1.5s

---

## 6. Métriques de Succès (MMA Promotion Manager)

| Métrique | Cible | Minimum |
|----------|-------|---------|
| **Onboarding** | | |
| Taux complétion 1er événement | > 85% | > 75% |
| Temps moyen onboarding | < 3 min | < 5 min |
| **Engagement** | | |
| Temps session moyen | > 10 min | > 7 min |
| Événements par session | > 5 | > 3 |
| Taux de bankruptcy | < 5% (ev. 10) | < 10% |
| **Satisfaction** | | |
| Clarté objective | > 9/10 | > 7/10 |
| Feedback économique | > 8/10 | > 6/10 |
| Score satisf. globale | > 8/10 | > 6/10 |
| **Rétention** | | |
| Return Rate (J1→J2) | > 60% | > 40% |
| Average Session Length | > 15 min | > 10 min |
| Events before Quit | > 10 | > 5 |

---

## 7. Roadmap de Développement

### Phase 1: Polish Onboarding & Économie (MVP - Critical)
**Objectif** : Onboarding captivant + économie équilibrée
- [ ] Revoir formules économiques (revenue/costs)
- [ ] Tutoriel guidé pour 1er événement (avec overlays)
- [ ] Notification de succès : "Premier profit ! 🎉"
- [ ] Feedback visuel amélioré (budget flash, animations)
- [ ] Tests: Bankruptcy rate < 5% à événement 10

### Phase 2: Engagement & Progression
**Objectif** : Garder le joueur motivé au-delà de 10 événements
- [ ] Système de milestones (5+ étapes)
- [ ] Badges/achievements visuels
- [ ] Déblocage progressif (défis, cosmétiques)
- [ ] Événements contextuels rares + dramatiques
- [ ] Page "Statistics" : Total événements, budget max, etc.

### Phase 3: Profondeur & Contenu
**Objectif** : Contenu à long terme
- [ ] Recrutement avancé (coûts élevés pour champions)
- [ ] Défis personnalisés ("Atteindre $500k", "50 événements")
- [ ] Cosmétiques : Logos promotion, noms personnalisés
- [ ] Leaderboard global (si multi-joueur/cloud)
- [ ] Modes spéciaux (tournois, championships)

### Phase 4: Polish Final
**Objectif** : Excellence UX/UI
- [ ] Animations fluides partout (transitions écrans)
- [ ] Sons feedback (victoire, événement rare, etc.)
- [ ] Responsive design mobile
- [ ] Tests utilisateurs complets
- [ ] Balance fine : Économie + événements

---

## 8. Annexes

### A. Glossaire MMA Promotion Manager

- **Promotion** : L'organisation de combat gérée par le joueur
- **Événement** : Une série de combats (1-5 fights)
- **Fight/Combat** : Match entre 2 combattants (revenus $8k, coûts $3k)
- **Combattant** : Fighter avec stats (Frappe/Lutte/Sol)
- **Budget** : Ressource principale ($100k initial)
- **Événement Contextuel** : Événement aléatoire impactant budget/roster (60% chance)
- **Milestone** : Jalon de progression (1er profit, 15 événements, etc.)
- **Feedback** : Réaction du jeu (flash budget, animations, notifications)

### B. Fichiers Clés du Projet

| Fichier | Rôle |
|---------|------|
| `src/App.jsx` | État global + logique principale |
| `src/screens/Onboarding.jsx` | Écran initial (à améliorer) |
| `src/screens/Matchmaking.jsx` | Création d'événements |
| `src/screens/Results.jsx` | Affichage résultats (économie + événements) |
| `src/utils/simulateFight.js` | Simulation des combats |
| `src/utils/eventsEngine.js` | Événements contextuels |
| `src/data/eventsCatalog.js` | Catalogue d'événements |
| `src/components/Header.jsx` | Affichage budget + nom |

### C. Issues à Prioriser

1. **[URGENT]** Équilibrer l'économie (1 fight = $0, problème!)
2. **[HIGH]** Améliorer onboarding (tutoriel guidé)
3. **[HIGH]** Ajouter feedback visuel (flash budget, animations)
4. **[MEDIUM]** Système de milestones + badges
5. **[MEDIUM]** Événements contextuels plus dramatiques
6. **[LOW]** Cosmétiques + personnalisation promotion

### D. Documents de Référence

- Principes MDA : Mechanics (économie), Dynamics (tension), Aesthetics (satisfaction)
- Codebase: Voir fichiers clés ci-dessus
- Current balance: REVENUE=$8k, COST=$3k, FIXED=$5k (À REVOIR)

---

## 9. Recommandations Immédiates

### 🔴 URGENT (Sprint 1)
1. **Fixer l'économie** : Augmenter revenue à $8.5k OU réduire fixed cost à $4k
   - Impact: Rend 1 fight = +$500 profit (au lieu de $0)
   - Fichier: `App.jsx` (lignes 21-23)

2. **Améliorer onboarding** : Ajouter tutoriel visuel pour 1er événement
   - Fichier: `Onboarding.jsx`
   - Ajouter: "Glissez 2 combattants → Simulez → Gagnez de l'argent!"

3. **Feedback économique** : Améliorer flash du budget
   - Fichier: `Header.jsx`
   - Ajouter: Animation de gain/perte plus spectaculaire

### 🟠 HIGH (Sprint 2)
4. **Milestones système** : Tracker progression (5/50 événements, etc.)
5. **Badges/Achievements** : Déblocages visuels ("Entrepreneur", "Légende")
6. **Événements dramatiques** : Améliorer Description + contexte

### 🟡 MEDIUM (Sprint 3+)
7. Cosmétiques promotion
8. Défis personnalisés
9. Leaderboard/Stats avancées

---

**Fin du PRD**

**Status** : ✅ Adapté au jeu MMA Promotion Manager  
**Approuvé par** : [À compléter]  
**Date d'approbation** : [À compléter]  
**Prochaine Review** : Après Phase 1 (Économie + Onboarding)
