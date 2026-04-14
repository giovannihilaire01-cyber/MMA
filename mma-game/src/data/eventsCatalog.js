// Events catalog for the "Événements Contextuels Aléatoires" feature.
// Approach: ~40 hand-written flavor entries + ~60 templated entries generated
// by loops. Final EVENTS_CATALOG is a flat static array.

export const FAMILY_COLORS = {
  finance: '#E8FF00',
  fighters: '#4A9EFF',
  roster: '#FF6B35',
  combo: '#C77DFF',
}

export const FAMILY_LABELS = {
  finance: 'Finance',
  fighters: 'Combattants',
  roster: 'Roster',
  combo: 'Combo',
}

export const RARITY_LABELS = {
  commun: 'Commun',
  peu_commun: 'Peu commun',
  rare: 'Rare',
  legendaire: 'Légendaire',
}

export const RARITY_WEIGHTS = {
  commun: 50,
  peu_commun: 30,
  rare: 15,
  legendaire: 5,
}

const DEFAULT_COOLDOWNS = {
  commun: 3,
  peu_commun: 5,
  rare: 8,
  legendaire: 15,
}

function base(overrides) {
  const rarete = overrides.rarete || 'commun'
  return {
    id: overrides.id,
    famille: overrides.famille,
    nature: overrides.nature,
    rarete,
    cooldown: overrides.cooldown || DEFAULT_COOLDOWNS[rarete],
    deblocage: overrides.deblocage ?? 0,
    chain: overrides.chain ?? null,
    titre: overrides.titre,
    description: overrides.description,
    icone: overrides.icone || '✨',
    couleur: overrides.couleur || FAMILY_COLORS[overrides.famille],
    impact: overrides.impact,
    effet_persistant: overrides.effet_persistant ?? null,
  }
}

// ─── Hand-written entries (flavor + legendaries + chains) ───

// --- rare entries (hand-written flavor, produce persistent effects) ---
const RARE_HAND = [
  // FIGHTERS — rare negative: injury (persistent)
  {
    rarete: 'rare', deblocage: 10,
    id: 'fighters_r_neg_injury',
    famille: 'fighters', nature: 'negatif',
    titre: 'Blessure Sérieuse',
    description: '[FIGHTER] se blesse à l\'entraînement. Stats réduites pendant plusieurs événements.',
    icone: '🩹',
    impact: { type: 'stats', cible: 'meilleur_fighter', stat: null, valeur_min: -8, valeur_max: -4 },
    effet_persistant: { type: 'blessure', duree: 4 },
  },
  // FIGHTERS — rare negative: suspension
  {
    rarete: 'rare', deblocage: 10,
    id: 'fighters_r_neg_suspension',
    famille: 'fighters', nature: 'negatif',
    titre: 'Suspension Antidopage',
    description: '[FIGHTER] est contrôlé positif et suspendu temporairement.',
    icone: '🚫',
    impact: { type: 'stats', cible: 'meilleur_fighter', stat: null, valeur_min: -2, valeur_max: 0 },
    effet_persistant: { type: 'suspension', duree: 3 },
  },
  // FIGHTERS — rare negative: meforme
  {
    rarete: 'rare', deblocage: 10,
    id: 'fighters_r_neg_slump',
    famille: 'fighters', nature: 'negatif',
    titre: 'Méforme Chronique',
    description: '[FIGHTER] traverse une passe difficile. Baisse progressive de performance.',
    icone: '📉',
    impact: { type: 'stats', cible: 'pire_bilan', stat: null, valeur_min: -6, valeur_max: -3 },
    effet_persistant: { type: 'meforme', duree: 5 },
  },
  // FIGHTERS — rare positive: breakthrough
  {
    rarete: 'rare', deblocage: 10,
    id: 'fighters_r_pos_camp',
    famille: 'fighters', nature: 'positif',
    titre: 'Stage à l\'Étranger',
    description: '[FIGHTER] rentre transformé d\'un camp d\'entraînement.',
    icone: '🥋',
    impact: { type: 'stats', cible: 'meilleur_fighter', stat: null, valeur_min: 6, valeur_max: 12 },
  },
  // FINANCE — rare positive
  {
    rarete: 'rare', deblocage: 0,
    id: 'fin_r_pos_ppv',
    famille: 'finance', nature: 'positif',
    titre: 'Pay-Per-View Explosif',
    description: 'Les ventes PPV explosent. Bonus de [MONTANT] pour [PROMOTION].',
    icone: '💰',
    impact: { type: 'budget', cible: 'random', stat: null, valeur_min: 25000, valeur_max: 45000 },
  },
  // FINANCE — rare negative
  {
    rarete: 'rare', deblocage: 0,
    id: 'fin_r_neg_audit',
    famille: 'finance', nature: 'negatif',
    titre: 'Contrôle Fiscal',
    description: 'Un contrôle inattendu. Redressement de [MONTANT].',
    icone: '🧾',
    impact: { type: 'budget', cible: 'random', stat: null, valeur_min: -25000, valeur_max: -15000 },
  },
  // ROSTER — rare positive
  {
    rarete: 'rare', deblocage: 10,
    id: 'roster_r_pos_scout',
    famille: 'roster', nature: 'positif',
    titre: 'Recrue Inattendue',
    description: 'Un scout ramène un talent. Nouveau combattant dans [PROMOTION].',
    icone: '📋',
    impact: { type: 'roster', cible: 'random', stat: null, valeur_min: 55, valeur_max: 70 },
  },
  // ROSTER — rare negative
  {
    rarete: 'rare', deblocage: 10,
    id: 'roster_r_neg_retire',
    famille: 'roster', nature: 'negatif',
    titre: 'Retraite Anticipée',
    description: '[FIGHTER] annonce sa retraite. Le roster se réduit.',
    icone: '🏖️',
    impact: { type: 'roster', cible: 'pire_bilan', stat: null, valeur_min: 0, valeur_max: 0 },
  },
  // COMBO — rare positive
  {
    rarete: 'rare', deblocage: 10,
    id: 'combo_r_pos_boost',
    famille: 'combo', nature: 'positif',
    titre: 'Élan de Popularité',
    description: '[PROMOTION] gagne en visibilité. Budget et moral en hausse.',
    icone: '🔥',
    impact: { type: 'combo', cible: 'meilleur_fighter', stat: null, valeur_min: 15000, valeur_max: 25000 },
  },
  // COMBO — rare negative
  {
    rarete: 'rare', deblocage: 10,
    id: 'combo_r_neg_brawl',
    famille: 'combo', nature: 'negatif',
    titre: 'Bagarre Générale',
    description: 'Une rixe éclate. [FIGHTER] sanctionné, amendes pour [PROMOTION].',
    icone: '⚠️',
    impact: { type: 'combo', cible: 'meilleur_fighter', stat: null, valeur_min: -20000, valeur_max: -12000 },
  },
].map(base)

const HAND_WRITTEN = [
  // FINANCE — legendary positive
  base({
    id: 'fin_l_pos_tv_deal',
    famille: 'finance', nature: 'positif', rarete: 'legendaire',
    deblocage: 25,
    titre: 'Contrat TV Historique',
    description: 'Un diffuseur national signe avec [PROMOTION] : [MONTANT] tombent dans les caisses.',
    icone: '📺',
    impact: { type: 'budget', cible: 'random', stat: null, valeur_min: 80000, valeur_max: 120000 },
  }),
  // FINANCE — legendary negative (with chain)
  base({
    id: 'fin_l_neg_lawsuit',
    famille: 'finance', nature: 'negatif', rarete: 'legendaire',
    deblocage: 25,
    chain: 'fighters_l_neg_star_walks',
    titre: 'Scandale Judiciaire',
    description: 'Une enquête éclabousse [PROMOTION]. Frais juridiques : [MONTANT].',
    icone: '⚖️',
    impact: { type: 'budget', cible: 'random', stat: null, valeur_min: -60000, valeur_max: -35000 },
  }),
  // FIGHTERS — legendary negative (chained target)
  base({
    id: 'fighters_l_neg_star_walks',
    famille: 'fighters', nature: 'negatif', rarete: 'legendaire',
    deblocage: 25,
    titre: 'La Star Claque la Porte',
    description: '[FIGHTER] rompt son contrat et part à la concurrence.',
    icone: '🚪',
    impact: { type: 'roster', cible: 'meilleur_bilan', stat: null, valeur_min: 0, valeur_max: 0 },
  }),
  // ROSTER — legendary positive
  base({
    id: 'roster_l_pos_prodigy',
    famille: 'roster', nature: 'positif', rarete: 'legendaire',
    deblocage: 25,
    titre: 'Prodige Découvert',
    description: 'Un scout local ramène un jeune prodige. [FIGHTER] rejoint [PROMOTION] gratuitement.',
    icone: '🌟',
    impact: { type: 'roster', cible: 'random', stat: null, valeur_min: 70, valeur_max: 85 },
  }),
  // COMBO — legendary positive (sponsor for best fighter)
  base({
    id: 'combo_l_pos_sponsor_star',
    famille: 'combo', nature: 'positif', rarete: 'legendaire',
    deblocage: 10,
    titre: 'Sponsor Mondial',
    description: '[FIGHTER] signe un méga-sponsor qui rejaillit sur [PROMOTION]. Bonus [MONTANT].',
    icone: '⭐',
    impact: { type: 'combo', cible: 'meilleur_bilan', stat: null, valeur_min: 30000, valeur_max: 50000 },
    effet_persistant: { type: 'sponsor', duree: 5 },
  }),

  // FINANCE — peu_commun flavor
  base({
    id: 'fin_u_pos_local_sponsor',
    famille: 'finance', nature: 'positif', rarete: 'peu_commun',
    titre: 'Sponsor Local',
    description: 'Une enseigne locale parraine [PROMOTION] : [MONTANT] nets.',
    icone: '🏷️',
    impact: { type: 'budget', cible: 'random', stat: null, valeur_min: 8000, valeur_max: 15000 },
  }),
  base({
    id: 'fin_u_neg_equipment',
    famille: 'finance', nature: 'negatif', rarete: 'peu_commun',
    titre: 'Panne Matériel',
    description: 'Le ring doit être remplacé. Coût : [MONTANT].',
    icone: '🔧',
    impact: { type: 'budget', cible: 'random', stat: null, valeur_min: -10000, valeur_max: -6000 },
  }),

  // FIGHTERS — peu_commun flavor
  base({
    id: 'fighters_u_pos_mentor',
    famille: 'fighters', nature: 'positif', rarete: 'peu_commun',
    titre: 'Nouveau Coach',
    description: '[FIGHTER] trouve un mentor qui le transforme.',
    icone: '🎓',
    impact: { type: 'stats', cible: 'pire_fighter', stat: null, valeur_min: 4, valeur_max: 8 },
  }),
  base({
    id: 'fighters_u_neg_gym_dispute',
    famille: 'fighters', nature: 'negatif', rarete: 'peu_commun',
    titre: 'Conflit au Gym',
    description: '[FIGHTER] quitte son club, entraînement perturbé.',
    icone: '💢',
    impact: { type: 'stats', cible: 'random', stat: null, valeur_min: -6, valeur_max: -2 },
  }),

  // ROSTER — peu_commun flavor
  base({
    id: 'roster_u_pos_free_agent',
    famille: 'roster', nature: 'positif', rarete: 'peu_commun',
    titre: 'Agent Libre',
    description: 'Un combattant libre rejoint [PROMOTION].',
    icone: '➕',
    impact: { type: 'roster', cible: 'random', stat: null, valeur_min: 45, valeur_max: 60 },
  }),

  // COMBO — peu_commun flavor
  base({
    id: 'combo_u_pos_viral',
    famille: 'combo', nature: 'positif', rarete: 'peu_commun',
    titre: 'Vidéo Virale',
    description: '[FIGHTER] devient viral. [PROMOTION] en profite : [MONTANT].',
    icone: '📱',
    impact: { type: 'combo', cible: 'meilleur_fighter', stat: null, valeur_min: 6000, valeur_max: 12000 },
  }),
  base({
    id: 'combo_u_neg_scandal',
    famille: 'combo', nature: 'negatif', rarete: 'peu_commun',
    titre: 'Scandale Mineur',
    description: '[FIGHTER] fait la une. Amende et baisse de forme.',
    icone: '📰',
    impact: { type: 'combo', cible: 'meilleur_bilan', stat: null, valeur_min: -8000, valeur_max: -4000 },
  }),

  ...RARE_HAND,
]

// ─── Templated entries to reach distribution targets ───
// Targets by family: 28 finance / 38 fighters / 22 roster / 15 combo (total 103)
// Targets by rarity (approx): 50/30/15/5 → ~51 commun / 31 peu_commun / 15 rare / 6 legendaire

const COMMUN_TEMPLATES = {
  finance: [
    { nature: 'positif', titre: 'Billetterie Solide', description: 'La salle est comble. [PROMOTION] empoche [MONTANT].', icone: '🎟️', min: 3000, max: 6000 },
    { nature: 'positif', titre: 'Merchandising', description: 'Ventes de produits dérivés : [MONTANT].', icone: '👕', min: 2000, max: 5000 },
    { nature: 'positif', titre: 'Donateur', description: 'Un mécène soutient [PROMOTION] : [MONTANT].', icone: '🤝', min: 4000, max: 7000 },
    { nature: 'negatif', titre: 'Frais Imprévus', description: 'Petits frais de fonctionnement : [MONTANT].', icone: '💸', min: -4000, max: -2000 },
    { nature: 'negatif', titre: 'Taxe Municipale', description: 'Taxe sur l\'événement : [MONTANT].', icone: '🏛️', min: -3500, max: -1500 },
    { nature: 'negatif', titre: 'Remboursements', description: 'Quelques billets remboursés : [MONTANT].', icone: '↩️', min: -3000, max: -1500 },
  ],
  fighters: [
    { nature: 'positif', titre: 'Sparring Productif', description: '[FIGHTER] progresse au sparring.', icone: '🥊', min: 1, max: 3, impactType: 'stats' },
    { nature: 'positif', titre: 'Nouvelle Technique', description: '[FIGHTER] affine sa technique.', icone: '📘', min: 2, max: 4, impactType: 'stats' },
    { nature: 'positif', titre: 'Regain de Forme', description: '[FIGHTER] est en pleine forme.', icone: '💪', min: 2, max: 5, impactType: 'stats' },
    { nature: 'negatif', titre: 'Fatigue', description: '[FIGHTER] accuse le coup.', icone: '😮‍💨', min: -3, max: -1, impactType: 'stats' },
    { nature: 'negatif', titre: 'Petite Blessure', description: '[FIGHTER] s\'est tordu la cheville.', icone: '🩹', min: -4, max: -2, impactType: 'stats' },
    { nature: 'negatif', titre: 'Distraction', description: '[FIGHTER] a la tête ailleurs.', icone: '💭', min: -3, max: -1, impactType: 'stats' },
    { nature: 'negatif', titre: 'Régime Raté', description: '[FIGHTER] a du mal à peser.', icone: '⚖️', min: -2, max: -1, impactType: 'stats' },
  ],
  roster: [
    { nature: 'positif', titre: 'Contact Utile', description: 'Un agent propose un combattant à [PROMOTION].', icone: '📇', min: 40, max: 55, impactType: 'roster' },
    { nature: 'positif', titre: 'Jeune Espoir', description: 'Un jeune rejoint le roster.', icone: '🆕', min: 35, max: 50, impactType: 'roster' },
    { nature: 'negatif', titre: 'Dispute Contractuelle', description: '[FIGHTER] menace de partir.', icone: '📝', min: -2, max: -1, impactType: 'stats' },
    { nature: 'negatif', titre: 'Transfert Rival', description: '[FIGHTER] reçoit une offre concurrente.', icone: '🔄', min: -2, max: -1, impactType: 'stats' },
  ],
  combo: [
    { nature: 'positif', titre: 'Buzz Réseaux', description: '[PROMOTION] tendance en ligne : [MONTANT].', icone: '💬', min: 3000, max: 6000, impactType: 'combo' },
    { nature: 'negatif', titre: 'Bad Buzz', description: 'Une polémique coûte [MONTANT] à [PROMOTION].', icone: '👎', min: -5000, max: -2000, impactType: 'combo' },
  ],
}

const PEU_COMMUN_TEMPLATES = {
  finance: [
    { nature: 'positif', titre: 'Partenariat Streaming', description: 'Un service streaming s\'intéresse : [MONTANT].', icone: '📡', min: 10000, max: 18000 },
    { nature: 'positif', titre: 'Exclu Télé Locale', description: 'Diffusion locale : [MONTANT].', icone: '📺', min: 8000, max: 14000 },
    { nature: 'negatif', titre: 'Poursuite Fournisseur', description: 'Litige avec un fournisseur : [MONTANT].', icone: '⚖️', min: -14000, max: -8000 },
    { nature: 'negatif', titre: 'Caution Perdue', description: 'La ville retient une caution : [MONTANT].', icone: '🏦', min: -12000, max: -7000 },
  ],
  fighters: [
    { nature: 'positif', titre: 'Camp Intensif', description: '[FIGHTER] revient transformé d\'un camp.', icone: '🏕️', min: 4, max: 8, impactType: 'stats' },
    { nature: 'positif', titre: 'Changement de Style', description: '[FIGHTER] adopte un nouveau style.', icone: '🔀', min: 3, max: 7, impactType: 'stats' },
    { nature: 'negatif', titre: 'Surentraînement', description: '[FIGHTER] en surentraînement.', icone: '⚠️', min: -6, max: -3, impactType: 'stats' },
    { nature: 'negatif', titre: 'Problème Personnel', description: '[FIGHTER] traverse une période difficile.', icone: '💔', min: -5, max: -2, impactType: 'stats' },
  ],
  roster: [
    { nature: 'positif', titre: 'Vétéran Disponible', description: 'Un vétéran rejoint [PROMOTION].', icone: '🎖️', min: 55, max: 70, impactType: 'roster' },
    { nature: 'negatif', titre: 'Départ Surprise', description: '[FIGHTER] claque la porte.', icone: '👋', min: 0, max: 0, impactType: 'roster_remove' },
  ],
  combo: [
    { nature: 'positif', titre: 'Presse Favorable', description: 'Article élogieux sur [PROMOTION] : [MONTANT].', icone: '📰', min: 8000, max: 14000, impactType: 'combo' },
    { nature: 'negatif', titre: 'Sponsor Perdu', description: 'Un sponsor se retire : [MONTANT].', icone: '🚫', min: -12000, max: -7000, impactType: 'combo' },
  ],
}

function generateFromTemplates(templates, famille, rarete, startIdx) {
  const out = []
  let i = startIdx
  const arr = templates[famille] || []
  for (const t of arr) {
    const impactType = t.impactType || (famille === 'finance' ? 'budget' : famille === 'combo' ? 'combo' : 'stats')
    const cible = impactType === 'budget' ? 'random'
      : impactType === 'roster' || impactType === 'roster_remove' ? 'random'
      : t.nature === 'positif' ? (Math.random() < 0.5 ? 'pire_fighter' : 'random') : 'pire_bilan'
    out.push(base({
      id: `${famille}_${rarete[0]}_${t.nature[0]}_${i++}`,
      famille, nature: t.nature, rarete,
      titre: t.titre, description: t.description, icone: t.icone,
      impact: {
        type: impactType === 'roster_remove' ? 'roster' : impactType,
        cible,
        stat: null,
        valeur_min: t.min, valeur_max: t.max,
      },
    }))
  }
  return out
}

// Generate commun + peu_commun pool
const GENERATED = [
  ...generateFromTemplates(COMMUN_TEMPLATES, 'finance', 'commun', 0),
  ...generateFromTemplates(COMMUN_TEMPLATES, 'fighters', 'commun', 0),
  ...generateFromTemplates(COMMUN_TEMPLATES, 'roster', 'commun', 0),
  ...generateFromTemplates(COMMUN_TEMPLATES, 'combo', 'commun', 0),
  ...generateFromTemplates(PEU_COMMUN_TEMPLATES, 'finance', 'peu_commun', 0),
  ...generateFromTemplates(PEU_COMMUN_TEMPLATES, 'fighters', 'peu_commun', 0),
  ...generateFromTemplates(PEU_COMMUN_TEMPLATES, 'roster', 'peu_commun', 0),
  ...generateFromTemplates(PEU_COMMUN_TEMPLATES, 'combo', 'peu_commun', 0),
]

// Duplicate select commun entries with variant ids to hit target counts.
// Finance: we need ~14 commun finance. Current commun finance templates = 6 → add 8 variants.
// Fighters: ~19 commun fighters. Current = 7 → add 12 variants.
// Roster: ~11 commun roster. Current = 4 → add 7 variants.
// Combo: ~7 commun combo. Current = 2 → add 5 variants.
function variantsFor(famille, n) {
  const out = []
  const src = GENERATED.filter(e => e.famille === famille && e.rarete === 'commun')
  for (let i = 0; i < n; i++) {
    const seed = src[i % src.length]
    if (!seed) break
    out.push(base({
      ...seed,
      id: `${seed.id}_v${i + 1}`,
      titre: seed.titre + (i % 3 === 0 ? ' (Soir)' : i % 3 === 1 ? ' (Matin)' : ' (Weekend)'),
      impact: {
        ...seed.impact,
        valeur_min: Math.round(seed.impact.valeur_min * (0.8 + 0.4 * (i % 3))),
        valeur_max: Math.round(seed.impact.valeur_max * (0.8 + 0.4 * (i % 3))),
      },
    }))
  }
  return out
}

const COMMUN_VARIANTS = [
  ...variantsFor('finance', 8),
  ...variantsFor('fighters', 12),
  ...variantsFor('roster', 7),
  ...variantsFor('combo', 5),
]

// Additional peu_commun variants (needed: ~8/11/7/4 → we have 4/4/2/2; need +4/+7/+5/+2 ≈ +18)
function peuCommunVariantsFor(famille, n) {
  const out = []
  const src = GENERATED.filter(e => e.famille === famille && e.rarete === 'peu_commun')
  for (let i = 0; i < n; i++) {
    const seed = src[i % src.length]
    if (!seed) break
    out.push(base({
      ...seed,
      id: `${seed.id}_pv${i + 1}`,
      titre: seed.titre + ' +',
      impact: {
        ...seed.impact,
        valeur_min: Math.round(seed.impact.valeur_min * (0.9 + 0.2 * (i % 2))),
        valeur_max: Math.round(seed.impact.valeur_max * (0.9 + 0.2 * (i % 2))),
      },
    }))
  }
  return out
}

const PEU_COMMUN_VARIANTS = [
  ...peuCommunVariantsFor('finance', 4),
  ...peuCommunVariantsFor('fighters', 8),
  ...peuCommunVariantsFor('roster', 5),
  ...peuCommunVariantsFor('combo', 1),
]

// Generate rare variants so rarity hits ~15%
function rareVariantsFor(famille, n) {
  const out = []
  const src = RARE_HAND.filter(e => e.famille === famille)
  for (let i = 0; i < n; i++) {
    const seed = src[i % src.length]
    if (!seed) break
    out.push(base({
      ...seed,
      id: `${seed.id}_rv${i + 1}`,
      titre: seed.titre + ' II',
      impact: { ...seed.impact },
      effet_persistant: seed.effet_persistant ? { ...seed.effet_persistant } : null,
    }))
  }
  return out
}

const RARE_VARIANTS = [
  ...rareVariantsFor('fighters', 3),
  ...rareVariantsFor('finance', 1),
  ...rareVariantsFor('roster', 1),
]

export const EVENTS_CATALOG = [
  ...HAND_WRITTEN,
  ...GENERATED,
  ...COMMUN_VARIANTS,
  ...PEU_COMMUN_VARIANTS,
  ...RARE_VARIANTS,
]

// Dev-only invariant check
export function assertCatalogInvariants(catalog = EVENTS_CATALOG) {
  const byFamille = catalog.reduce((acc, e) => { acc[e.famille] = (acc[e.famille] || 0) + 1; return acc }, {})
  const byRarete = catalog.reduce((acc, e) => { acc[e.rarete] = (acc[e.rarete] || 0) + 1; return acc }, {})
  const ids = new Set()
  for (const e of catalog) {
    if (ids.has(e.id)) throw new Error(`Duplicate event id: ${e.id}`)
    ids.add(e.id)
  }
  if (catalog.length < 100) throw new Error(`Catalog too small: ${catalog.length}`)
  return { total: catalog.length, byFamille, byRarete }
}

