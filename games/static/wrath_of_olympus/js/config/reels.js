/**
 * reels.js — Reel strip configuration & payline definitions
 *
 * SLOT_CONFIG uses fixed 1280×720 design coordinates.
 * Phaser's Scale.FIT handles all shrinking/growing for mobile —
 * no runtime branching needed here.
 */

function buildReelStrip(length) {
  const pool = [];
  for (const [id, weight] of Object.entries(window.SYMBOL_WEIGHTS)) {
    for (let w = 0; w < weight; w++) pool.push(id);
  }
  const strip = [];
  for (let i = 0; i < length; i++) {
    strip.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return strip;
}

window.REEL_STRIPS = [
  buildReelStrip(40),
  buildReelStrip(40),
  buildReelStrip(40),
  buildReelStrip(40),
  buildReelStrip(40),
];

window.PAYLINES = [
  [1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0],
  [2, 2, 2, 2, 2],
  [0, 1, 2, 1, 0],
  [2, 1, 0, 1, 2],
  [0, 0, 1, 2, 2],
  [2, 2, 1, 0, 0],
  [1, 0, 0, 0, 1],
  [1, 2, 2, 2, 1],
  [0, 1, 1, 1, 0],
  [2, 1, 1, 1, 2],
  [1, 0, 1, 0, 1],
  [1, 2, 1, 2, 1],
  [0, 0, 1, 0, 0],
  [2, 2, 1, 2, 2],
  [0, 1, 0, 1, 0],
  [2, 1, 2, 1, 2],
  [1, 1, 0, 1, 1],
  [1, 1, 2, 1, 1],
  [0, 2, 0, 2, 0],
];

window.PAYLINE_COLORS = [
  0xffffff, 0xf0c040, 0x4af0ff, 0xff6060, 0x60ff80,
  0xff80ff, 0xffa040, 0x40a0ff, 0xffe060, 0x80ffff,
  0xff4090, 0xa0ff40, 0x4040ff, 0xff8040, 0x40ffb0,
  0xc060ff, 0xff60c0, 0x60c0ff, 0xd0ff60, 0xff4040,
];

// ── Slot layout — fixed 1280×720 design space ────────────────────────────────
// Phaser.Scale.FIT scales the entire canvas for mobile; these numbers stay fixed.
window.SLOT_CONFIG = {
  COLS: 5,
  ROWS: 3,

  SYMBOL_W: 170,        // 5 × 170 = 850px reel grid width (centred in 1280)
  SYMBOL_H: 170,        // 3 × 170 = 510px reel grid height

  REEL_GAP:        7, //8
  SYMBOL_PADDING: 25,   // inner padding so symbols don't touch cell borders

  SPIN_SPEED_BASE:   22,
  SPIN_BOUNCE:       14,
  MIN_SPIN_SYMBOLS:  20,
  SPIN_DECEL:      0.97,
  STAGGER_DELAY:    150,
};