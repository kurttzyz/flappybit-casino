/**
 * soundManager.js — Audio management
 * Django static: slots/js/utils/soundManager.js
 *
 * Key design: all looping sounds (spin, ambient) are created ONCE in init()
 * and reused forever. We only call .play() / .stop() on them — never .add()
 * again — so Phaser can never accumulate duplicate instances.
 */

window.SoundManager = (function () {

  let _scene        = null;
  let _muted        = false;
  let _volume       = 0.7;

  // Single persistent instances — created once, reused every spin
  let _spinSound    = null;
  let _ambientSound = null;

  /**
   * Call once from GameScene.create().
   * Pre-creates all looping sound objects so they're ready to play/stop.
   */
  function init(scene) {
    _scene = scene;

    // Pre-create spin sound as a single persistent instance
    if (_scene.cache.audio.exists('snd_spin')) {
      _spinSound = _scene.sound.add('snd_spin', { loop: true, volume: _volume * 0.6 });
    }

    // Pre-create ambient sound
    if (_scene.cache.audio.exists('snd_ambient')) {
      _ambientSound = _scene.sound.add('snd_ambient', { loop: true, volume: _volume * 0.4 });
    }
  }

  function _loaded(key) {
    return _scene && _scene.cache.audio.exists(key);
  }

  /**
   * Play a one-shot sound. Silently skips if not loaded or muted.
   */
  function play(key, config = {}) {
    if (_muted || !_loaded(key)) return;
    try {
      _scene.sound.play(key, { volume: _volume, ...config });
    } catch (_) {}
  }

  /**
   * Start ambient loop.
   */
  function startAmbient() {
    if (!_ambientSound || _muted) return;
    try {
      if (!_ambientSound.isPlaying) _ambientSound.play();
    } catch (_) {}
  }

  function stopAmbient() {
    if (!_ambientSound) return;
    try {
      if (_ambientSound.isPlaying) _ambientSound.stop();
    } catch (_) {}
  }

  /**
   * Start spin sound. Because _spinSound is a single persistent instance,
   * calling play() on an already-playing sound is a no-op in Phaser —
   * so we stop first to restart it cleanly from the beginning.
   */
  function startSpinSound() {
    if (!_spinSound || _muted) return;
    try {
      if (_spinSound.isPlaying) _spinSound.stop();
      _spinSound.play();
    } catch (_) {}
  }

  /**
   * Stop spin sound.
   */
  function stopSpinSound() {
    if (!_spinSound) return;
    try {
      if (_spinSound.isPlaying) _spinSound.stop();
    } catch (_) {}
  }

  /**
   * Play win sound based on win size relative to bet.
   */
  function playWinSound(winAmount, bet) {
    if (winAmount <= 0) return;
    const ratio = winAmount / bet;
    play(ratio >= 10 ? 'snd_win_big' : 'snd_win_small');
    play('snd_coin');
  }

  function toggleMute() {
    _muted = !_muted;
    if (_scene) _scene.sound.mute = _muted;
    return _muted;
  }

  function setVolume(v) {
    _volume = Math.max(0, Math.min(1, v));
    if (_scene) _scene.sound.volume = _volume;
  }

  function isMuted() { return _muted; }

  return {
    init,
    play,
    startAmbient,
    stopAmbient,
    startSpinSound,
    stopSpinSound,
    playWinSound,
    toggleMute,
    setVolume,
    isMuted
  };

})();