# PRD - Améliorations de Conception du Jeu MMA

**Version**: 1.0  
**Date**: Avril 2026  
**Statut**: En développement  

---

## 1. Vision Globale

Transformer le jeu MMA en une expérience engageante où chaque interaction produit un retour immédiat, où le progression est visible et gratifiante, et où le joueur comprend clairement ses objectifs et reste motivé à continuer.

---

## 2. Principes de Conception Fondamentaux

### 2.1 Un Objectif Clair
- **Objectif Principal**: Le joueur doit comprendre immédiatement son but (ex: "Battre ton adversaire", "Atteindre le champion", "Débloquer tous les coups")
- **Implémentation**:
  - Afficher un titre/objectif visible au début du jeu
  - Intégrer un système de missions ou objectifs secondaires
  - Afficher une barre de progression vers le but principal

**Critères de Succès**:
- Un nouveau joueur peut expliquer l'objectif en moins de 10 secondes
- L'objectif est visible en tout moment sur l'interface

---

### 2.2 Une Première Expérience Satisfaisante
- **Problème**: Les premières minutes déterminent si le joueur continue ou abandon
- **Solution**: 
  - Actions faciles et intuitives dès le départ
  - Résultats visibles/audibles immédiats
  - Réussite rapide dans les 30 premières secondes

**Implémentation**:
- Tutoriel interactif non-bloquant (optionnel)
- Premier coup facile à exécuter avec feedback immédiat
- Première victoire facilement accessible (difficulté progessive)

**Critères de Succès**:
- 80% des joueurs accomplissent leur première action en < 15s
- Feedback audio/visuel confirmant chaque action

---

### 2.3 La Curiosité
- **Objectif**: Donner envie au joueur de découvrir la suite
- **Mécaniques à débloquer**:
  - Nouveaux coups et combos
  - Nouveaux adversaires avec styles différents
  - Historique/lore du combattant
  - Environnements variés

**Implémentation**:
- Système de progression déverrouillant du contenu
- Aperçus de contenu verrouillé (teasing)
- Milestones visibles et atteignables

**Critères de Succès**:
- Chaque niveau déverrouille au moins 1 nouvel élément
- Temps de jeu moyen > 5 minutes par session

---

### 2.4 Le Sentiment de Progression
- **Objectif**: Le joueur doit sentir qu'il progresse constamment
- **Formes de progression**:
  - **Mécanique**: Maîtriser de nouveaux coups/combos
  - **Statistiques**: Augmentation de l'ATK, DEF, SPD
  - **Collections**: Débloquer de nouveaux personnages/skins
  - **Rang**: Classement (Bronze → Silver → Gold → Champion)

**Implémentation**:
- Système XP/Points visible après chaque combat
- Affichage de la progression (barre de progression vers le prochain rang)
- Notifications de déblocage/succès
- Page de statistiques personnelles

**Critères de Succès**:
- Progression visible après chaque combat
- Au moins 3 niveaux de progression différents
- Déblocages réguliers (tous les 2-3 combats minimum)

---

### 2.5 Le Feedback
- **Objectif**: Chaque action doit produire une réaction perceptible
- **Types de feedback**:
  - **Visuel**: Animation du coup, changement de couleur, particules
  - **Sonore**: Bruit de coup, réaction de l'adversaire
  - **Textuel**: "+15 Points", "CRITIQUE !"
  - **Haptique** (mobile): Vibration

**Implémentation**:
- Animation d'impact visible pour chaque coup
- Son distinctif pour chaque type d'action
- Affichage des dégâts infligés
- Messages de feedback contextuel

**Critères de Succès**:
- 100% des actions ont un retour visuel
- Délai de feedback < 100ms
- Sons clairs et distincts

---

### 2.6 Un Défi Adapté (Équilibre de Difficulté)
- **Problème**: Trop facile = ennui, Trop difficile = abandon
- **Solution**: Courbe de difficulté progressive
- **Implémentation**:
  - Adversaires faibles au départ
  - Augmentation graduelle de la difficulté
  - Options de difficulté personnalisée

**Critères de Succès**:
- Taux de complétion > 70%
- Pas de frustration excessive (détectable par les patterns de gameplay)

---

## 3. Améliorations Détaillées

### 3.1 Difficulté Progressive

**Objectif**: Créer une courbe de difficulté qui engage sans frustrer

**Design**:
```
Niveau 1-3   : Adversaires faibles (IA basique)
Niveau 4-6   : Adversaires moyens (IA avec patterns)
Niveau 7-10  : Adversaires forts (IA avancée)
Niveau 11+   : Défis extrêmes (boss, combats spéciaux)
```

**Paramètres de difficulté par niveau**:
- Santé de l'adversaire
- Vitesse d'attaque
- Variété des coups
- Fréquence des combos

**Implémentation**:
- Système de scaling automatique basé sur le niveau du joueur
- Option "Difficulté personnalisée" pour les joueurs expérimentés
- Récompenses adaptées à la difficulté

---

### 3.2 Règles Cohérentes

**Objectif**: Le joueur doit pouvoir prédire le comportement du jeu

**Principes**:
- La physique est constante (mêmes dégâts, vitesses identiques)
- Les mécaniques ne changent pas sans raison
- L'IA suit des règles prévisibles
- Les éléments visuels correspondent aux mécaniques

**Implémentation**:
- Documentation interne des règles du jeu
- Tests de cohérence automatisés
- Aucun changement de mécanique sans notification au joueur

**Critères de Succès**:
- Aucun bug de physique non-intentionnel
- Joueurs rapportent une prévisibilité > 8/10

---

## 4. Architecture de Progression

### 4.1 Système de Rang

| Rang | Défaut | Récompenses |
|------|--------|-------------|
| Bronze I-III | 0-100 pts | Déverrouille argent |
| Silver I-III | 100-300 pts | Nouveaux coups |
| Gold I-III | 300-600 pts | Skins, combattants |
| Platine I-III | 600-1000 pts | Défis extrêmes |
| Champion | 1000+ pts | Cosmétiques exclusifs |

### 4.2 Déblocage de Contenu

**Déverrouillage par Progression**:
- Niveau 2: 2ème coup
- Niveau 5: Combo basique
- Niveau 10: Nouveau personnage
- Niveau 15: Difficulté hardcore
- Niveau 20: Mode versus

---

## 5. Spécifications Techniques

### 5.1 Système de Points XP

```javascript
// Formule de gain XP
const xpGain = (dammageInflicted * 2) + (combatDuration / 10) + bonusComplètion
```

- Minimum 10 XP par combat
- Bonus pour victoire rapide (+25%)
- Bonus pour combat sans coup manqué (+15%)

### 5.2 Animations & Feedback

**Coups**:
- Animation d'impact: 200ms
- Knockback visuel: 150ms
- Nombre flottant (damage): 2s fade-out

**Victoire/Défaite**:
- Écran de victoire: 3s (peut être skippé)
- Écran de défaite: 2s + options

---

## 6. Métriques de Succès

| Métrique | Cible | Seuil Minimum |
|----------|-------|---------------|
| Taux de complétion | > 70% | > 50% |
| Temps moyen de jeu | > 8 min | > 5 min |
| Score de satisfaction | > 8/10 | > 6/10 |
| Pas d'abandon frustré | < 10% | < 20% |
| Clarté objective | > 9/10 | > 7/10 |
| Feedback ressenti | > 8/10 | > 6/10 |

---

## 7. Roadmap de Développement

### Phase 1: Fondations (MVP)
- [ ] Objective claire visible
- [ ] Feedback audio/visuel sur chaque action
- [ ] Difficulté progressive (3 niveaux min)
- [ ] Système XP/Points basique

### Phase 2: Engagement
- [ ] Système de rang (5 tiers)
- [ ] Déblocage de contenu
- [ ] Notifications de progression
- [ ] Statistiques du joueur

### Phase 3: Profondeur
- [ ] Nouveaux personnages
- [ ] Système de combos avancés
- [ ] Défis spéciaux
- [ ] Mode versus

### Phase 4: Polish
- [ ] Optimisations audio/visuelles
- [ ] Interface affinée
- [ ] Équilibrage fin
- [ ] Tests utilisateurs

---

## 8. Annexes

### A. Glossaire

- **XP**: Expérience - Points gagnés par combat
- **Rang**: Titre du joueur basé sur ses pts totaux
- **Feedback**: Réaction du jeu à une action (son, visuel, etc.)
- **Combo**: Suite de coups rapides consécutifs
- **IA**: Comportement de l'adversaire
- **Hitbox**: Zone de collision d'une attaque

### B. Documents de Référence

- Principes d'engagement MDA (Mechanics, Dynamics, Aesthetics)
- Game Design Document complet (à créer)
- Documentation API du système de progression

---

**Fin du PRD**

Approuvé par: [À compléter]  
Date d'approbation: [À compléter]
