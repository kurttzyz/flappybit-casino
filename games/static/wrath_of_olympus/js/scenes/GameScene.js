/**
 * GameScene.js
 * Symbols placed directly in scene (no containers).
 * Hard border rectangles at depth 4 cover symbol overflow at frame edges.
 */

class GameScene extends Phaser.Scene {

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const { width, height } = this.scale;

    SoundManager.init(this);
    SoundManager.startAmbient();

    this._spinning   = false;
    this._reelStates = [];
    this._grid       = [];
    this._winLines   = [];
    this._winTimers  = [];

    this._layout = this._computeLayout(width, height);

    this._addBackground(width, height);
    this._buildReels();
    this._addReelBorders();
    this._addFrame(width, height);
    this._addPaylineGraphics();

    this.game.events.on('requestSpin', this._onSpinRequest, this);
  }

  update() {
    if (!this._spinning) return;

    let allStopped = true;
    this._reelStates.forEach((reel, col) => {
      if (!reel.stopped) {
        allStopped = false;
        this._updateReel(col, reel);
      }
    });

    if (allStopped && this._spinning) {
      this._spinning = false;
      this._onAllReelsStopped();
    }
  }

  // ─── Layout ───────────────────────────────────────────────────────────────

  _computeLayout(width, height) {
    const { COLS, ROWS, SYMBOL_W, SYMBOL_H, REEL_GAP } = window.SLOT_CONFIG;

    const totalW = COLS * SYMBOL_W + (COLS - 1) * REEL_GAP;
    const totalH = ROWS * SYMBOL_H;

    const startX = (width  - totalW) / 2;
    const startY = (height - totalH) / 2 - 57;

    return { totalW, totalH, startX, startY, COLS, ROWS, SYMBOL_W, SYMBOL_H, REEL_GAP };
  }

  // ─── Background ───────────────────────────────────────────────────────────

  _addBackground(width, height) {
    if (this.textures.exists('background')) {
      const bg = this.add.image(width / 2, height / 2, 'background');
      bg.setDisplaySize(width, height);
    } else {
      this.add.rectangle(width / 2, height / 2, width, height, 0x040c1e);
    }
  }

  _addFrame(width, height) {
    if (this.textures.exists('reels_frame')) {
      const frame = this.add.image(0, 0, 'reels_frame');
      const scaleX = 0.7998;
      const scaleY = 1.0324;
      frame.setScale(scaleX, scaleY);
      frame.setPosition(640, 316);
      frame.setDepth(5);
    }
  }

  // ─── Reel borders ─────────────────────────────────────────────────────────asdasd

  _addReelBorders() {
    const { startX, startY, totalW, totalH } = this._layout;
    const { width, height } = this.scale;

    const g = this.add.graphics();
    g.setDepth(4);
    g.fillStyle(0x000000, 1);

    g.fillRect(0, 0, width, startY);
    g.fillRect(0, startY + totalH, width, height - (startY + totalH));
    g.fillRect(0, startY, startX, totalH);
    g.fillRect(startX + totalW, startY, width - (startX + totalW), totalH);
  }

  // ─── Build reels ──────────────────────────────────────────────────────────

  _buildReels() {
    const { COLS, ROWS, SYMBOL_W, SYMBOL_H, REEL_GAP, startX, startY } = this._layout;

    this._reels      = [];
    this._grid       = [];
    this._reelStates = [];

    const BUFFER_ABOVE = 2;
    const BUFFER_BELOW = 1;
    const TOTAL_SLOTS  = ROWS + BUFFER_ABOVE + BUFFER_BELOW;

    this._bufferAbove = BUFFER_ABOVE;
    this._totalSlots  = TOTAL_SLOTS;
    this._reelTopY    = startY;
    this._reelBottomY = startY + ROWS * SYMBOL_H;

    for (let col = 0; col < COLS; col++) {
      const colX   = startX + col * (SYMBOL_W + REEL_GAP) + SYMBOL_W / 2;
      const strip  = window.REEL_STRIPS[col];
      const colSyms = [];

      for (let slot = 0; slot < TOTAL_SLOTS; slot++) {
        const worldY = startY + (slot - BUFFER_ABOVE) * SYMBOL_H + SYMBOL_H / 2;
        const symId  = strip[Math.floor(Math.random() * strip.length)];
        const sprite = this._makeSymbolSprite(symId, colX, worldY);
        const inView = slot >= BUFFER_ABOVE && slot < BUFFER_ABOVE + ROWS;
        sprite.setVisible(inView);
        colSyms.push({ sprite, symbolId: symId, colX });
      }

      this._reels.push(colSyms);

      this._grid.push([]);
      for (let row = 0; row < ROWS; row++) {
        this._grid[col][row] = colSyms[BUFFER_ABOVE + row].symbolId;
      }

      this._reelStates.push({
        spinning:      false,
        stopped:       true,
        speed:         0,
        totalScrolled: 0,
        targetScroll:  0,
      });
    }
  }

  _makeSymbolSprite(symId, x, y) {
    const key = 'sym_' + symId;
    const { SYMBOL_W, SYMBOL_H, SYMBOL_PADDING } = window.SLOT_CONFIG;
    const maxW = SYMBOL_W - SYMBOL_PADDING * 0.5;
    const maxH = SYMBOL_H - SYMBOL_PADDING * 2;

    let sprite;
    if (this.textures.exists(key)) {
      sprite = this.add.image(x, y, key);
      sprite.setOrigin(0.5, 0.5);
      const scale = Math.min(maxW / sprite.width, maxH / sprite.height);
      sprite.setScale(scale);
    } else {
      const sym = window.SYMBOL_MAP[symId] || { color: '#888888', label: '?' };
      sprite = this.add.rectangle(
        x, y, maxW, maxH,
        parseInt(sym.color.replace('#', ''), 16), 0.85
      );
      this.add.text(x, y, sym.label, {
        fontFamily: '"Cinzel", serif',
        fontSize:   '15px',
        color:      '#ffffff',
        stroke:     '#000000',
        strokeThickness: 3,
      }).setOrigin(0.5, 0.5).setDepth(4);
    }
    sprite.setDepth(3);
    sprite._symbolId = symId;
    return sprite;
  }

  // ─── Spin ─────────────────────────────────────────────────────────────────

  _onSpinRequest(data) {
    if (this._spinning) return;

    this._clearWinDisplay();
    this._spinning = true;

    const { MIN_SPIN_SYMBOLS, SYMBOL_H, SPIN_SPEED_BASE, STAGGER_DELAY } = window.SLOT_CONFIG;
    const resultGrid = window.SlotEngine.spin();

    SoundManager.startSpinSound();

    this._reelStates.forEach((reel, col) => {
      reel.spinning      = true;
      reel.stopped       = false;
      reel.speed         = SPIN_SPEED_BASE + col * 2;
      reel.totalScrolled = 0;
      reel.targetScroll  = 0;

      const stopDelay = 800 + col * STAGGER_DELAY;
      const minScroll = (MIN_SPIN_SYMBOLS + col * 3) * SYMBOL_H;

      this.time.delayedCall(stopDelay, () => {
        reel.targetScroll = Math.max(minScroll, reel.totalScrolled + SYMBOL_H * 8);
        this._plantResult(col, resultGrid[col]);
      });
    });
  }

  _updateReel(col, reel) {
    if (!reel.spinning) return;

    const { SYMBOL_H, SPIN_DECEL } = window.SLOT_CONFIG;
    const colSyms = this._reels[col];

    if (reel.targetScroll > 0 && reel.totalScrolled >= reel.targetScroll * 0.8) {
      reel.speed *= SPIN_DECEL;
      if (reel.speed < 8) reel.speed = 8;
    }

    colSyms.forEach(sym => { sym.sprite.y += reel.speed; });
    reel.totalScrolled += reel.speed;

    const bottomEdge = this._reelBottomY + SYMBOL_H;
    colSyms.forEach(sym => {
      if (sym.sprite.y > bottomEdge) {
        const minY = Math.min(...colSyms.map(s => s.sprite.y));
        sym.sprite.y = minY - SYMBOL_H;
      }
    });

    this._cullColumn(col);

    if (reel.targetScroll > 0 && reel.totalScrolled >= reel.targetScroll) {
      reel.spinning = false;
      this._snapReel(col, reel);
    }
  }

  _cullColumn(col) {
    const { SYMBOL_H } = window.SLOT_CONFIG;
    const margin = SYMBOL_H * 0.45;
    this._reels[col].forEach(sym => {
      const inView = sym.sprite.y + margin > this._reelTopY &&
                     sym.sprite.y - margin < this._reelBottomY;
      sym.sprite.setVisible(inView);
    });
  }

  _plantResult(col, resultSymbols) {
    const colSyms = this._reels[col];
    const { SYMBOL_H, ROWS, SYMBOL_W, SYMBOL_PADDING } = window.SLOT_CONFIG;
    const maxW = SYMBOL_W - SYMBOL_PADDING * 2;
    const maxH = SYMBOL_H - SYMBOL_PADDING * 2;

    const sorted  = [...colSyms].sort((a, b) => a.sprite.y - b.sprite.y);
    const targets = sorted.slice(0, ROWS);

    targets.forEach((sym, row) => {
      const symId = resultSymbols[row];
      sym.symbolId         = symId;
      sym.sprite._symbolId = symId;

      const key = 'sym_' + symId;
      if (this.textures.exists(key)) {
        sym.sprite.setTexture(key);
        sym.sprite.setOrigin(0.5, 0.5);
        const scale = Math.min(maxW / sym.sprite.width, maxH / sym.sprite.height);
        sym.sprite.setScale(scale);
      }
    });

    this._grid[col] = resultSymbols.slice(0, ROWS);
  }

  _snapReel(col, reel) {
    const { SYMBOL_H, SPIN_BOUNCE } = window.SLOT_CONFIG;
    const { COLS } = window.SLOT_CONFIG;
    const colSyms      = this._reels[col];
    const BUFFER_ABOVE = this._bufferAbove;
    const isLastReel   = col === COLS - 1;

    const sorted = [...colSyms].sort((a, b) => a.sprite.y - b.sprite.y);
    sorted.forEach((sym, i) => {
      sym.sprite.y = sorted[0].sprite.y + i * SYMBOL_H;
    });

    const targetRow0Y = this._reelTopY + SYMBOL_H / 2;
    const snapDelta   = targetRow0Y - sorted[BUFFER_ABOVE].sprite.y;
    sorted.forEach(sym => { sym.sprite.y += snapDelta; });

    this.tweens.add({
      targets:  colSyms.map(s => s.sprite),
      y:        (target) => target.y + SPIN_BOUNCE,
      duration: 80,
      yoyo:     true,
      ease:     'Sine.easeOut',
      onComplete: () => {
        reel.spinning = false;
        reel.stopped  = true;
        SoundManager.play('snd_stop');
        this._cullColumn(col);

        const allStopped = this._reelStates.every(r => r.stopped);

        // Stop spin sound the moment the last reel lands —
        // don't wait for _onAllReelsStopped to avoid any timing gap
        if (allStopped) {
          SoundManager.stopSpinSound();
          this._syncGridFromDisplay();
        }
      }
    });
  }

  _syncGridFromDisplay() {
    const { SYMBOL_H, ROWS, COLS } = window.SLOT_CONFIG;

    for (let col = 0; col < COLS; col++) {
      const visible = this._reels[col]
        .filter(s => {
          const offset = s.sprite.y - this._reelTopY;
          const row    = Math.round((offset - SYMBOL_H / 2) / SYMBOL_H);
          return row >= 0 && row < ROWS;
        })
        .sort((a, b) => a.sprite.y - b.sprite.y);

      for (let row = 0; row < ROWS; row++) {
        if (visible[row]) this._grid[col][row] = visible[row].symbolId;
      }
    }

    this._onAllReelsStopped();
  }

  _onAllReelsStopped() {
    // Spin sound is already stopped in _snapReel when the last reel lands.
    // Call stopSpinSound again as a safety net in case update() path fires first.
    SoundManager.stopSpinSound();

    const result = window.SlotEngine.evaluate(this._grid, 1);

    this.game.events.emit('spinComplete', {
      grid:          this._grid,
      wins:          result.wins,
      totalWinUnits: result.totalWin
    });

    if (result.wins.length > 0) {
      this._showWins(result.wins);
    }
  }

  // ─── Win display ──────────────────────────────────────────────────────────

  _winDelayedCall(delay, fn) {
    const timer = this.time.delayedCall(delay, fn);
    this._winTimers.push(timer);
    return timer;
  }

  _showWins(wins) {
    const { SYMBOL_W, SYMBOL_H, REEL_GAP } = window.SLOT_CONFIG;
    const { startX, startY }               = this._layout;

    let lineIdx = 0;
    const showNext = () => {
      if (lineIdx >= wins.length) {
        this._winDelayedCall(1000, () => {
          this._clearWinDisplay();
          lineIdx = 0;
          showNext();
        });
        return;
      }

      const win = wins[lineIdx];
      const gfx = this._paylineGfx;
      gfx.clear();

      const color = window.PAYLINE_COLORS[win.lineIndex % window.PAYLINE_COLORS.length];
      gfx.lineStyle(3, color, 1);

      win.paylinePattern.forEach((row, col) => {
        const cx = startX + col * (SYMBOL_W + REEL_GAP) + SYMBOL_W / 2;
        const cy = startY + row * SYMBOL_H + SYMBOL_H / 2;
        if (col === 0) gfx.moveTo(cx, cy);
        else           gfx.lineTo(cx, cy);
      });
      gfx.strokePath();

      win.positions.forEach(({ col, row }) => {
        const cx   = startX + col * (SYMBOL_W + REEL_GAP) + SYMBOL_W / 2;
        const cy   = startY + row * SYMBOL_H + SYMBOL_H / 2;
        const glow = this.add.circle(cx, cy, SYMBOL_W / 2 - 8, color, 0.25);
        glow.setDepth(4);
        this._winLines.push(glow);

        this.tweens.add({
          targets:  glow,
          alpha:    { from: 0.1, to: 0.5 },
          duration: 300,
          yoyo:     true,
          repeat:   -1
        });
      });

      lineIdx++;
      this._winDelayedCall(900, showNext);
    };

    showNext();
  }

  _clearWinDisplay() {
    this._winTimers.forEach(t => { if (t) t.remove(); });
    this._winTimers = [];

    if (this._paylineGfx) this._paylineGfx.clear();
    this._winLines.forEach(o => {
      this.tweens.killTweensOf(o);
      o.destroy();
    });
    this._winLines = [];
  }

  _addPaylineGraphics() {
    this._paylineGfx = this.add.graphics();
    this._paylineGfx.setDepth(6);
  }
}