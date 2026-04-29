/**
 * symbols.js — Symbol definitions & paytable
 * Django static: slots/js/config/symbols.js
 *
 * Symbols are ordered by value (highest first).
 * Each symbol maps to a frame name in the spritesheet (symbol.png / symbol.json).
 *
 * Paytable: payouts[matchCount] = multiplier on bet
 *   matchCount = 3 | 4 | 5
 */

window.SYMBOLS = [
  {
    id: 'zeus',
    label: 'Zeus',
    frame: 'zeus.png',     // spritesheet frame key
    tier: 'wild',          // 'wild' | 'high' | 'mid' | 'low'
    isWild: true,
    payouts: { 3: 10, 4: 25, 5: 100 },
    color: '#4af0ff'
  },
  {
    id: 'crown',
    label: 'Crown',
    frame: 'crown.png',
    tier: 'high',
    isWild: false,
    payouts: { 3: 6, 4: 15, 5: 50 },
    color: '#f0c040'
  },
  {
    id: 'lyre',
    label: 'Lyre',
    frame: 'lyre.png',
    tier: 'high',
    isWild: false,
    payouts: { 3: 5, 4: 12, 5: 40 },
    color: '#ffd700'
  },
  {
    id: 'divine_eye',
    label: 'Divine Eye',
    frame: 'divine_eye.png',
    tier: 'high',
    isWild: false,
    payouts: { 3: 4, 4: 10, 5: 30 },
    color: '#a0d0ff'
  },
  {
    id: 'lightning',
    label: 'Lightning',
    frame: 'lightning.png',
    tier: 'mid',
    isWild: false,
    payouts: { 3: 3, 4: 8, 5: 20 },
    color: '#ffe060'
  },
  {
    id: 'laurel',
    label: 'Laurel',
    frame: 'laurel.png',
    tier: 'mid',
    isWild: false,
    payouts: { 3: 2, 4: 6, 5: 15 },
    color: '#80d080'
  },
  {
    id: 'orb',
    label: 'Orb',
    frame: 'orb.png',
    tier: 'mid',
    isWild: false,
    payouts: { 3: 2, 4: 5, 5: 12 },
    color: '#c0a0ff'
  },
  {
    id: 'helmet',
    label: 'Helmet',
    frame: 'helmet.png',
    tier: 'mid',
    isWild: false,
    payouts: { 3: 2, 4: 5, 5: 12 },
    color: '#d0a060'
  },
  {
    id: 'diamond',
    label: 'Diamond',
    frame: 'diamond.png',
    tier: 'low',
    isWild: false,
    payouts: { 3: 1, 4: 3, 5: 8 },
    color: '#60d0ff'
  },
  {
    id: 'K',
    label: 'King',
    frame: 'K.png',
    tier: 'low',
    isWild: false,
    payouts: { 3: 1, 4: 2, 5: 6 },
    color: '#50c050'
  },
  {
    id: 'Q',
    label: 'Queen',
    frame: 'Q.png',
    tier: 'low',
    isWild: false,
    payouts: { 3: 1, 4: 2, 5: 5 },
    color: '#c060c0'
  },
  {
    id: 'J',
    label: 'Jack',
    frame: 'J.png',
    tier: 'low',
    isWild: false,
    payouts: { 3: 1, 4: 2, 5: 5 },
    color: '#6080e0'
  },
  {
    id: '10',
    label: '10',
    frame: '10.png',
    tier: 'low',
    isWild: false,
    payouts: { 3: 1, 4: 2, 5: 4 },
    color: '#e0a030'
  }
];

// Quick lookup by id
window.SYMBOL_MAP = {};
window.SYMBOLS.forEach(s => { window.SYMBOL_MAP[s.id] = s; });

// Symbol IDs only (used for reel strip generation)
window.SYMBOL_IDS = window.SYMBOLS.map(s => s.id);

/**
 * Weighted symbol pool for reel strip generation.
 * Higher-tier symbols appear less frequently.
 */
window.SYMBOL_WEIGHTS = {
  zeus:       1,   // wild — very rare
  crown:      2,
  lyre:       2,
  divine_eye: 3,
  lightning:  4,
  laurel:     5,
  orb:        5,
  helmet:     5,
  diamond:    6,
  K:          8,
  Q:          8,
  J:          9,
  '10':      10
};
