/**
 * BootScene.js — Asset preloading
 * Django static: slots/js/scenes/BootScene.js
 */

class BootScene extends Phaser.Scene {

  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    const base = (window.STATIC_URL || '/static/') + 'wrath_of_olympus/';

    this._createProgressBar();

    this.load.on('progress', (value) => {
      if (this._progressFill) {
        this._progressFill.width = this._barMaxWidth * value;
        this._progressText && this._progressText.setText('Loading... ' + Math.floor(value * 100) + '%');
      }
    });

    this.load.on('complete', () => {
      this._progressText && this._progressText.setText('Ready!');
    });

    // ── Images ────────────────────────────────────────────────────────
    this.load.image('background',  base + 'images/background.png');
    this.load.image('reels_frame', base + 'images/reels.png');

    // ── Main sprite sheet (symbols + UI buttons) ──────────────────────
    this.load.image('sprite_sheet_raw', base + 'images/sprite.png');

    // ── Audio ─────────────────────────────────────────────────────────
    this.load.audio('snd_spin',      base + 'audio/slot_spin.wav');
    this.load.audio('snd_stop',      base + 'audio/slot_stop.wav');
    this.load.audio('snd_win_small', base + 'audio/slot_win.wav');
    this.load.audio('snd_win_big',   base + 'audio/slot_win_big.wav');
    this.load.audio('snd_coin',      base + 'audio/slot_coin.wav');
    this.load.audio('snd_ambient',   base + 'audio/slot_ambient.wav');
    this.load.audio('snd_button',    base + 'audio/slot_button.wav');
  }

  create() {
    this._sliceSprites();

    this.scene.start('GameScene');
    this.scene.start('UIScene');
  }

  // ─── Internal helpers ─────────────────────────────────────────────────────

  _createProgressBar() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    this.add.rectangle(cx, cy - 60, 300, 4, 0x1a2a4a);

    // Fill bar — starts at width 0, grows via width scaling
    this._progressFill = this.add.rectangle(cx - 150, cy - 60, 0, 4, 0xf0c040).setOrigin(0, 0.5);
    this._barMaxWidth  = 300;

    this.add.text(cx, cy - 30, 'ZEUS THUNDER SLOTS', {
      fontFamily: '"Cinzel Decorative", serif',
      fontSize:   '28px',
      color:      '#f0c040',
      stroke:     '#7a5500',
      strokeThickness: 3
    }).setOrigin(0.5);

    this._progressText = this.add.text(cx, cy - 80, 'Loading...', {
      fontFamily: '"Cinzel", serif',
      fontSize:   '13px',
      color:      '#a07810'
    }).setOrigin(0.5);
  }

  /**
   * Slice every frame from the sprite sheet into its own canvas texture.
   *
   * Symbol frames  → key: "sym_<id>"   e.g. "sym_zeus"
   * UI button frames → key: "btn_<id>" e.g. "btn_spin"
   */
  _sliceSprites() {
    const sourceImg = this.textures.get('sprite_sheet_raw').getSourceImage();
    const frames    = window.SPRITE_JSON_FRAMES || {};

    // Symbol frame IDs (match ids in symbols.js)
    const SYMBOL_IDS = new Set([
      'zeus', 'crown', 'lyre', '10', 'laurel',
      'divine_eye', 'lightning', 'orb', 'K', 'helmet',
      'diamond', 'Q', 'J'
    ]);

    // UI button frame IDs
    const UI_IDS = new Set([
      'spin', 'auto', 'turbo', 'max', 'back',
      'sound', 'disable_sound', 'disable_btn',
      'add', 'subtract', 'stop'
    ]);

    for (const [frameName, frameData] of Object.entries(frames)) {
      const { x, y, w, h } = frameData.frame;
      const id = frameName.replace('.png', '');

      let canvasKey;
      if (SYMBOL_IDS.has(id)) {
        canvasKey = 'sym_' + id;
      } else if (UI_IDS.has(id)) {
        canvasKey = 'btn_' + id;
      } else {
        continue; // skip unrecognised frames
      }

      if (this.textures.exists(canvasKey)) continue;

      const canvas = this.textures.createCanvas(canvasKey, w, h);
      const ctx    = canvas.getContext('2d');
      ctx.drawImage(sourceImg, x, y, w, h, 0, 0, w, h);
      canvas.refresh();
    }

    // Fallback coloured placeholders when no JSON is loaded
    if (Object.keys(frames).length === 0) {
      this._generatePlaceholders();
    }
  }

  _generatePlaceholders() {
    const { SYMBOL_W, SYMBOL_H } = window.SLOT_CONFIG;

    window.SYMBOLS.forEach(sym => {
      const key = 'sym_' + sym.id;
      if (this.textures.exists(key)) return;

      const canvas = this.textures.createCanvas(key, SYMBOL_W - 10, SYMBOL_H - 10);
      const ctx    = canvas.getContext('2d');

      const hex = sym.color.replace('#', '');
      const r   = parseInt(hex.substring(0, 2), 16);
      const g   = parseInt(hex.substring(2, 4), 16);
      const b   = parseInt(hex.substring(4, 6), 16);

      const grad = ctx.createRadialGradient(
        (SYMBOL_W-10)/2, (SYMBOL_H-10)/2, 0,
        (SYMBOL_W-10)/2, (SYMBOL_H-10)/2, (SYMBOL_W-10)/2
      );
      grad.addColorStop(0,   `rgba(${r},${g},${b},0.9)`);
      grad.addColorStop(0.7, `rgba(${r},${g},${b},0.4)`);
      grad.addColorStop(1,   `rgba(0,0,0,0.8)`);

      ctx.fillStyle = grad;
      ctx.roundRect(4, 4, SYMBOL_W-18, SYMBOL_H-18, 12);
      ctx.fill();

      ctx.strokeStyle = sym.color;
      ctx.lineWidth   = 2;
      ctx.roundRect(4, 4, SYMBOL_W-18, SYMBOL_H-18, 12);
      ctx.stroke();

      ctx.fillStyle    = '#ffffff';
      ctx.font         = 'bold 18px "Cinzel", serif';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sym.label, (SYMBOL_W-10)/2, (SYMBOL_H-10)/2);

      canvas.refresh();
    });
  }
}

// ─── Sprite frame data ───────────────────────────────────────────────────────
// In Django template: <script>window.SPRITE_JSON_FRAMES = {{ sprite_json|safe }};</script>
// Hardcoded fallback based on the uploaded sprite.json:

if (!window.SPRITE_JSON_FRAMES) {
  window.SPRITE_JSON_FRAMES = {
    // ── Game symbols ──────────────────────────────────────────────────
    "zeus.png":          { "frame": { "x": 6,    "y": 6,    "w": 416, "h": 339 } },
    "crown.png":         { "frame": { "x": 434,  "y": 6,    "w": 343, "h": 283 } },
    "lyre.png":          { "frame": { "x": 1497, "y": 6,    "w": 323, "h": 316 } },
    "10.png":            { "frame": { "x": 1143, "y": 164,  "w": 323, "h": 272 } },
    "laurel.png":        { "frame": { "x": 789,  "y": 237,  "w": 318, "h": 316 } },
    "divine_eye.png":    { "frame": { "x": 434,  "y": 334,  "w": 312, "h": 297 } },
    "lightning.png":     { "frame": { "x": 758,  "y": 883,  "w": 297, "h": 304 } },
    "orb.png":           { "frame": { "x": 327,  "y": 643,  "w": 294, "h": 283 } },
    "K.png":             { "frame": { "x": 312,  "y": 938,  "w": 254, "h": 256 } },
    "helmet.png":        { "frame": { "x": 6,    "y": 1066, "w": 246, "h": 327 } },
    "diamond.png":       { "frame": { "x": 6,    "y": 782,  "w": 294, "h": 272 } },
    "Q.png":             { "frame": { "x": 1440, "y": 753,  "w": 245, "h": 256 } },
    "J.png":             { "frame": { "x": 1799, "y": 334,  "w": 222, "h": 272 } },
    // ── UI buttons ────────────────────────────────────────────────────
    "spin.png":          { "frame": { "x": 1119, "y": 448,  "w": 309, "h": 195 } },
    "auto.png":          { "frame": { "x": 789,  "y": 6,    "w": 342, "h": 219 } },
    "turbo.png":         { "frame": { "x": 758,  "y": 565,  "w": 309, "h": 148 } },
    "max.png":           { "frame": { "x": 1119, "y": 655,  "w": 309, "h": 150 } },
    "back.png":          { "frame": { "x": 6,    "y": 572,  "w": 309, "h": 198 } },
    "sound.png":         { "frame": { "x": 6,    "y": 357,  "w": 309, "h": 203 } },
    "disable_sound.png": { "frame": { "x": 1478, "y": 334,  "w": 309, "h": 198 } },
    "disable_btn.png":   { "frame": { "x": 1478, "y": 544,  "w": 309, "h": 197 } },
    "add.png":           { "frame": { "x": 1143, "y": 6,    "w": 342, "h": 146 } },
    "subtract.png":      { "frame": { "x": 758,  "y": 725,  "w": 309, "h": 146 } }
  };
}