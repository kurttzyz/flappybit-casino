/**
 * main.js — Phaser game initialisation
 * Landscape-first, mobile-responsive.
 *
 * Strategy: always use the full 1280×720 design canvas and let
 * Phaser.Scale.FIT shrink/grow it to fit any screen while preserving
 * the 16:9 aspect ratio. This is the same approach used by Candy Soda
 * and avoids the portrait/landscape branching that caused layout bugs.
 */

const PhaserGame = new Phaser.Game({
  type: Phaser.AUTO,           // WebGL with Canvas fallback
  width:  1280,
  height: 720,
  backgroundColor: '#000000',
  parent: 'phaser-container',

  scale: {
    mode:       Phaser.Scale.FIT,          // shrink/grow, keep aspect ratio
    autoCenter: Phaser.Scale.CENTER_BOTH,  // always centred in the mount div
    width:      1280,
    height:     720,
    min: { width: 320, height: 180 },      // smallest phone landscape
    max: { width: 1920, height: 1080 },
  },

  scene: [BootScene, GameScene, UIScene],

  audio: {
    disableWebAudio: false,
  },

  input: {
    activePointers: 3,   // support up to 3-finger multi-touch
  },

  render: {
    antialias:         true,
    pixelArt:          false,
    roundPixels:       false,
    transparent:       false,
    clearBeforeRender: true,
  },
});

window.PhaserGame = PhaserGame;

// ── Refresh Scale Manager on resize / orientation change ────────────────────
// Phaser.Scale.FIT handles this automatically, but firing refresh() on the
// orientationchange event ensures the canvas re-centres after the browser
// finishes rotating (there's a brief delay before dimensions settle).

function onResize() {
  if (PhaserGame.scale) {
    PhaserGame.scale.refresh();
  }
}

window.addEventListener('resize', onResize);
window.addEventListener('orientationchange', function () {
  // Small delay lets the browser finish rotating before we refresh
  setTimeout(onResize, 200);
});

// Modern API (Chrome/Android)
if (window.screen && window.screen.orientation) {
  window.screen.orientation.addEventListener('change', onResize);
}