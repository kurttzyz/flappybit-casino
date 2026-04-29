/**
 * UIScene.js — HUD / controls overlay (FIXED)
 * Fixes: mobile layout, button sizing, bold/visible controls
 */

class UIScene extends Phaser.Scene {

  constructor() {
    super({ key: 'UIScene' });
  }

  create() {
    this._balance    = 1000;
    this._bet        = 10;
    this._betOptions = [1, 5, 10, 25, 50, 100];
    this._betIndex   = 2;
    this._spinning   = false;
    this._muted      = false;
    this._turbo      = false;
    this._auto       = false;

    this._buildUI();
    this._bindDOMReadouts();

    this.game.events.on('spinComplete', this._onSpinComplete, this);

    // Handle resize
    this.scale.on('resize', this._onResize, this);
  }

  _onResize() {
    // Rebuild UI on resize
    this.children.removeAll(true);
    this._buildUI();
    this._bindDOMReadouts();
  }

  // ─── Responsive UI Builder ────────────────────────────────────────────────

  _buildUI() {
    const { width, height } = this.scale;
    const isMobile = width < 600;

    // ── Dark bar at bottom ────────────────────────────────────────────
    const barH = isMobile ? 130 : 100;
    this.add.rectangle(width / 2, height - barH / 2, width, barH, 0x020810, 0.95)
      .setDepth(10);

    // Subtle top border line on bar
    this.add.rectangle(width / 2, height - barH, width, 2, 0xa07810, 1)
      .setDepth(10);

    if (isMobile) {
      this._buildMobileUI(width, height, barH);
    } else {
      this._buildDesktopUI(width, height, barH);
    }

    // ── Balance panel (top-left) ──────────────────────────────────────
    this._buildBalancePanel(width, height);

    // ── Win panel (top-right) ─────────────────────────────────────────
    this._buildWinPanel(width, height);

    // ── Big win banner ────────────────────────────────────────────────
    this._winBanner = this.add.text(width / 2, height / 2 - 100, '', {
      fontFamily: '"Cinzel Decorative", serif',
      fontSize:   isMobile ? '32px' : '52px',
      color:      '#f0c040',
      stroke:     '#7a5500',
      strokeThickness: 5,
      shadow: { offsetX: 0, offsetY: 0, color: '#f0c040', blur: 24, fill: true }
    }).setOrigin(0.5).setAlpha(0).setDepth(20);
  }

  // ─── Desktop Layout ───────────────────────────────────────────────────────

  _buildDesktopUI(width, height, barH) {
    const barY    = height - barH / 2;
    const BTN_H   = 60;
    const unit    = width / 16;

    // Positions across the bar
    const backX    = unit * 1;
    const subX     = unit * 2.5;
    const betX     = unit * 4;
    const addX     = unit * 5.5;
    const maxX     = unit * 7;
    const autoX    = unit * 9;
    const turboX   = unit * 11;
    const spinX    = unit * 13;
    const soundX   = unit * 15;

    // Back
    this._makeBtn('btn_back', backX, barY, BTN_H, () => SoundManager.play('snd_button'), 'BACK');

    // Bet −
    this._makeBtn('btn_subtract', subX, barY, BTN_H, () => {
      if (this._betIndex > 0) {
        this._betIndex--;
        this._bet = this._betOptions[this._betIndex];
        this._refreshBetText();
        SoundManager.play('snd_button');
      }
    }, '−');

    // Bet display
    this._buildBetDisplay(betX, barY);

    // Bet +
    this._makeBtn('btn_add', addX, barY, BTN_H, () => {
      if (this._betIndex < this._betOptions.length - 1) {
        this._betIndex++;
        this._bet = this._betOptions[this._betIndex];
        this._refreshBetText();
        SoundManager.play('snd_button');
      }
    }, '+');

    // Max
    this._makeBtn('btn_max', maxX, barY, BTN_H, () => {
      this._betIndex = this._betOptions.length - 1;
      this._bet      = this._betOptions[this._betIndex];
      this._refreshBetText();
      SoundManager.play('snd_button');
    }, 'MAX');

    // Auto
    this._autoBtn = this._makeBtn('btn_auto', autoX, barY, BTN_H, () => {
      this._auto = !this._auto;
      SoundManager.play('snd_button');
      if (this._auto) {
        this._autoBtn.setTint(0xf0c040);
        this._runAutoSpin();
      } else {
        this._autoBtn.clearTint();
      }
    }, 'AUTO');

    // Turbo
    this._turboBtn = this._makeBtn('btn_turbo', turboX, barY, BTN_H, () => {
      this._turbo = !this._turbo;
      SoundManager.play('snd_button');
      this._turboBtn.setTint(this._turbo ? 0xf0c040 : 0xffffff);
    }, 'TURBO');

    // SPIN — largest button
    this._spinBtn = this._makeBtn('btn_spin', spinX, barY, BTN_H * 1.4, () => {
      this._triggerSpin();
    }, 'SPIN');

    // Sound
    this._soundBtn = this._makeBtn('btn_sound', soundX, barY, BTN_H, () => {
      this._muted = SoundManager.toggleMute();
      const key   = this._muted ? 'btn_disable_sound' : 'btn_sound';
      if (this.textures.exists(key)) this._soundBtn.setTexture(key);
      SoundManager.play('snd_button');
    }, '🔊');
  }

  // ─── Mobile Layout — two-row design ──────────────────────────────────────

  _buildMobileUI(width, height, barH) {
    const barTop  = height - barH;
    const row1Y   = barTop + 38;   // top row: bet controls
    const row2Y   = barTop + 90;   // bottom row: spin controls
    const BTN_H   = 42;
    const SPIN_H  = 56;

    // ── Row 1: BACK | BET− | [BET] | BET+ | MAX ─────────────────────
    const cols5  = width / 6;
    const backX  = cols5 * 0.8;
    const subX   = cols5 * 1.7;
    const betX   = cols5 * 2.8;
    const addX   = cols5 * 3.9;
    const maxX   = cols5 * 5.0;

    this._makeBtn('btn_back', backX, row1Y, BTN_H, () => SoundManager.play('snd_button'), 'BACK');

    this._makeBtn('btn_subtract', subX, row1Y, BTN_H, () => {
      if (this._betIndex > 0) {
        this._betIndex--;
        this._bet = this._betOptions[this._betIndex];
        this._refreshBetText();
        SoundManager.play('snd_button');
      }
    }, '−');

    this._buildBetDisplay(betX, row1Y, true);

    this._makeBtn('btn_add', addX, row1Y, BTN_H, () => {
      if (this._betIndex < this._betOptions.length - 1) {
        this._betIndex++;
        this._bet = this._betOptions[this._betIndex];
        this._refreshBetText();
        SoundManager.play('snd_button');
      }
    }, '+');

    this._makeBtn('btn_max', maxX, row1Y, BTN_H, () => {
      this._betIndex = this._betOptions.length - 1;
      this._bet      = this._betOptions[this._betIndex];
      this._refreshBetText();
      SoundManager.play('snd_button');
    }, 'MAX');

    // ── Row 2: AUTO | TURBO | SPIN | SOUND ───────────────────────────
    const cols4  = width / 5;
    const autoX  = cols4 * 0.8;
    const turboX = cols4 * 1.9;
    const spinX  = cols4 * 3.0;
    const soundX = cols4 * 4.1;

    this._autoBtn = this._makeBtn('btn_auto', autoX, row2Y, BTN_H, () => {
      this._auto = !this._auto;
      SoundManager.play('snd_button');
      if (this._auto) {
        this._autoBtn.setTint(0xf0c040);
        this._runAutoSpin();
      } else {
        this._autoBtn.clearTint();
      }
    }, 'AUTO');

    this._turboBtn = this._makeBtn('btn_turbo', turboX, row2Y, BTN_H, () => {
      this._turbo = !this._turbo;
      SoundManager.play('snd_button');
      this._turboBtn.setTint(this._turbo ? 0xf0c040 : 0xffffff);
    }, 'TURBO');

    this._spinBtn = this._makeBtn('btn_spin', spinX, row2Y, SPIN_H, () => {
      this._triggerSpin();
    }, 'SPIN');

    this._soundBtn = this._makeBtn('btn_sound', soundX, row2Y, BTN_H, () => {
      this._muted = SoundManager.toggleMute();
      const key   = this._muted ? 'btn_disable_sound' : 'btn_sound';
      if (this.textures.exists(key)) this._soundBtn.setTexture(key);
      SoundManager.play('snd_button');
    }, '🔊');
  }

  // ─── Bet display ──────────────────────────────────────────────────────────

  _buildBetDisplay(x, y, small = false) {
    const labelSize = small ? '9px' : '10px';
    const valueSize = small ? '16px' : '22px';
    const labelOffset = small ? -13 : -16;
    const valueOffset = small ? 5 : 7;

    this.add.text(x, y + labelOffset, 'BET', {
      fontFamily: '"Cinzel", serif',
      fontSize:   labelSize,
      color:      '#a07810',
      letterSpacing: 3
    }).setOrigin(0.5).setDepth(11);

    this._betText = this.add.text(x, y + valueOffset, this._formatCoins(this._bet), {
      fontFamily: '"Cinzel Decorative", serif',
      fontSize:   valueSize,
      color:      '#f0c040',
      stroke:     '#7a5500',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(11);
  }

  // ─── Balance panel ────────────────────────────────────────────────────────

  _buildBalancePanel(width, height) {
    const isMobile = width < 600;
    const panelW   = isMobile ? 110 : 160;
    const panelH   = isMobile ? 44 : 52;
    const panelX   = panelW / 2 + 10;
    const panelY   = panelH / 2 + 10;
    const fontSize = isMobile ? '16px' : '22px';

    this.add.rectangle(panelX, panelY, panelW, panelH, 0x020810, 0.88)
      .setStrokeStyle(1, 0xa07810).setDepth(10);
    this.add.text(panelX, panelY - panelH / 2 + 8, 'BALANCE', {
      fontFamily: '"Cinzel", serif',
      fontSize:   isMobile ? '8px' : '10px',
      color:      '#a07810',
      letterSpacing: 2
    }).setOrigin(0.5).setDepth(11);
    this._balanceText = this.add.text(panelX, panelY + 6, this._formatCoins(this._balance), {
      fontFamily: '"Cinzel Decorative", serif',
      fontSize:   fontSize,
      color:      '#f0c040',
      stroke:     '#7a5500',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(11);
  }

  // ─── Win panel ────────────────────────────────────────────────────────────

  _buildWinPanel(width, height) {
    const isMobile = width < 600;
    const panelW   = isMobile ? 110 : 160;
    const panelH   = isMobile ? 44 : 52;
    const panelX   = width - panelW / 2 - 10;
    const panelY   = panelH / 2 + 10;
    const fontSize = isMobile ? '16px' : '22px';

    this.add.rectangle(panelX, panelY, panelW, panelH, 0x020810, 0.88)
      .setStrokeStyle(1, 0xa07810).setDepth(10);
    this.add.text(panelX, panelY - panelH / 2 + 8, 'WIN', {
      fontFamily: '"Cinzel", serif',
      fontSize:   isMobile ? '8px' : '10px',
      color:      '#a07810',
      letterSpacing: 2
    }).setOrigin(0.5).setDepth(11);
    this._winText = this.add.text(panelX, panelY + 6, '0', {
      fontFamily: '"Cinzel Decorative", serif',
      fontSize:   fontSize,
      color:      '#4af0ff',
      stroke:     '#005577',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(11);
  }

  // ─── Button helper ────────────────────────────────────────────────────────

  _makeBtn(textureKey, x, y, targetH, callback, fallbackLabel) {
    if (this.textures.exists(textureKey)) {
      const img   = this.add.image(x, y, textureKey).setDepth(11);
      const scale = targetH / img.height;
      img.setScale(scale);
      img.setInteractive({ useHandCursor: true });

      img.on('pointerover',  () => img.setTint(0xe0e0e0));
      img.on('pointerout',   () => img.clearTint());
      img.on('pointerdown',  () => img.setTint(0x888888));
      img.on('pointerup',    () => { img.clearTint(); callback(); });

      return img;
    }

    // Fallback: styled rectangle button
    const isSpin   = textureKey === 'btn_spin';
    const btnW     = isSpin ? targetH * 1.6 : targetH * 1.8;
    const btnH     = targetH;
    const fillColor = isSpin ? 0xc8930a : 0x0a1e3a;
    const stroke    = isSpin ? 0xf0c040 : 0xa07810;

    const rect = this.add.rectangle(x, y, btnW, btnH, fillColor)
      .setStrokeStyle(isSpin ? 2 : 1.5, stroke)
      .setInteractive({ useHandCursor: true })
      .setDepth(11);

    const label = this.add.text(x, y, fallbackLabel || textureKey.replace('btn_', '').toUpperCase(), {
      fontFamily: '"Cinzel Decorative", serif',
      fontSize:   isSpin ? `${Math.floor(targetH * 0.36)}px` : `${Math.floor(targetH * 0.3)}px`,
      color:      isSpin ? '#3a2000' : '#f0c040',
      stroke:     isSpin ? '#7a5500' : '#000',
      strokeThickness: isSpin ? 2 : 1,
      fontStyle:  'bold'
    }).setOrigin(0.5).setDepth(12);

    rect.on('pointerover',  () => { rect.setFillStyle(isSpin ? 0xf0c040 : 0x1a3060); });
    rect.on('pointerout',   () => { rect.setFillStyle(fillColor); });
    rect.on('pointerdown',  () => { rect.setFillStyle(0x555555); });
    rect.on('pointerup',    () => { rect.setFillStyle(fillColor); callback(); });

    return rect;
  }

  // ─── DOM readouts ─────────────────────────────────────────────────────────

  _bindDOMReadouts() {
    this._elBalance = document.getElementById('balance-value');
    this._elBet     = document.getElementById('bet-amount');
    this._elWin     = document.getElementById('win-value');
  }

  _refreshBetText() {
    if (this._betText) this._betText.setText(this._formatCoins(this._bet));
    if (this._elBet)   this._elBet.textContent = this._formatCoins(this._bet);
  }

  _formatCoins(n) {
    return n.toLocaleString();
  }

  // ─── Spin flow ────────────────────────────────────────────────────────────

  _triggerSpin() {
    if (this._spinning) return;
    if (this._balance < this._bet) {
      this._flashMessage('Insufficient balance!');
      return;
    }

    this._spinning  = true;
    this._balance  -= this._bet;
    this._setSpinBtnEnabled(false);
    if (this._winText) this._winText.setText('0');

    if (this._balanceText) this._balanceText.setText(this._formatCoins(this._balance));
    if (this._elBalance)   this._elBalance.textContent = this._formatCoins(this._balance);

    SoundManager.play('snd_button');
    this.game.events.emit('requestSpin', { bet: this._bet });
  }

  _onSpinComplete(data) {
    this._spinning = false;
    this._setSpinBtnEnabled(true);

    const { totalWinUnits } = data;
    const winAmount = totalWinUnits * this._bet;

    if (winAmount > 0) {
      this._balance += winAmount;

      if (this._balanceText) this._balanceText.setText(this._formatCoins(this._balance));
      if (this._winText)     this._winText.setText(this._formatCoins(winAmount));
      if (this._elBalance)   this._elBalance.textContent = this._formatCoins(this._balance);
      if (this._elWin)       this._elWin.textContent     = this._formatCoins(winAmount);

      this._showWinBanner(winAmount);
      SoundManager.playWinSound(winAmount, this._bet);
    }

    if (this._auto) {
      this.time.delayedCall(this._turbo ? 500 : 1200, () => {
        if (this._auto) this._triggerSpin();
      });
    }
  }

  _setSpinBtnEnabled(enabled) {
    if (!this._spinBtn) return;
    this._spinBtn.setAlpha(enabled ? 1 : 0.4);
    this._spinBtn.disableInteractive();
    if (enabled) this._spinBtn.setInteractive({ useHandCursor: true });
  }

  _runAutoSpin() {
    if (!this._auto || this._spinning) return;
    this._triggerSpin();
  }

  // ─── Win banner ───────────────────────────────────────────────────────────

  _showWinBanner(amount) {
    if (!this._winBanner) return;

    const label = amount >= this._bet * 10 ? '🏆 BIG WIN!'  :
                  amount >= this._bet * 5  ? '✨ GREAT WIN!' : '⚡ WIN!';

    this._winBanner.setText(`${label}\n+${amount.toLocaleString()}`);
    this.tweens.killTweensOf(this._winBanner);
    this._winBanner.setAlpha(0).setScale(0.5);

    this.tweens.add({
      targets:  this._winBanner,
      alpha:    1, scaleX: 1, scaleY: 1,
      duration: 300,
      ease:     'Back.easeOut',
      onComplete: () => {
        this.time.delayedCall(2500, () => {
          this.tweens.add({
            targets: this._winBanner, alpha: 0, duration: 400, ease: 'Sine.easeIn'
          });
        });
      }
    });
  }

  _flashMessage(text) {
    if (!this._winBanner) return;
    this._winBanner.setText(text);
    this.tweens.killTweensOf(this._winBanner);
    this._winBanner.setAlpha(1).setScale(1);
    this.time.delayedCall(2000, () => {
      this.tweens.add({ targets: this._winBanner, alpha: 0, duration: 300 });
    });
  }
}