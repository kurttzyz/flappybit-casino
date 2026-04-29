// scenes/Preload.js
var PreloadScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function PreloadScene() {
        Phaser.Scene.call(this, { key: 'Preload' });
    },

    preload: function () {
        // Build the base path from Django's STATIC_URL injected in the template.
        // window.STATIC_URL is set by:  window.STATIC_URL = "{% static '' %}";
        // which Django renders to e.g.  /static/
        // So base becomes:              /static/candy_soda/
        var base = (window.STATIC_URL || '/static/') + 'candy_soda/';

        // ── Images ──────────────────────────────────────────────────────────────
        this.load.atlas('logo',
            base + 'images/logo/logo.png',
            base + 'images/logo/logo.json');

        this.load.atlas('about',
            base + 'images/about/about.png',
            base + 'images/about/about.json');

        this.load.atlas('background',
            base + 'images/bg/bg.png',
            base + 'images/bg/bg.json');

        this.load.atlas('bgPreload',
            base + 'images/bg/bgmenu.png',
            base + 'images/bg/bgmenu.json');

        this.load.atlas('bgButtons',
            base + 'images/buttons/button.png',
            base + 'images/buttons/button.json');

        this.load.atlas('symbols',
            base + 'images/symbols/symbols.png',
            base + 'images/symbols/symbols.json');

        this.load.atlas('symbols_blur',
            base + 'images/symbols/symbols_blur.png',
            base + 'images/symbols/symbols_blur.json');

        this.load.atlas('line',
            base + 'images/lines/line.png',
            base + 'images/lines/line.json');

        this.load.atlas('sound',
            base + 'images/sound/sound.png',
            base + 'images/sound/sound.json');

        this.load.atlas('autoSpin',
            base + 'images/autoSpin/auto.png',
            base + 'images/autoSpin/auto.json');

        this.load.bitmapFont('txt_bitmap',
            base + 'fonts/bitmap/text_slot_machine.png',
            base + 'fonts/bitmap/text_slot_machine.xml');

        // ── Audio ───────────────────────────────────────────────────────────────
        this.load.audio('backgroundDefault', base + 'audios/background-default.mp3');
        this.load.audio('reels',             base + 'audios/reels.mp3');
        this.load.audio('reelStop',          base + 'audios/reel_stop.mp3');
        this.load.audio('win',               base + 'audios/win.mp3');
        this.load.audio('button',            base + 'audios/button.mp3');
        this.load.audio('lose',              base + 'audios/lose.mp3');
        this.load.audio('musicDefault',      base + 'audios/music_default.mp3');

        // ── Progress bar ────────────────────────────────────────────────────────
        var cx = Config.width  / 2;
        var cy = Config.height / 2;

        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(cx - 460, cy - 90, 900, 50);

        this.loadingText = this.make.text({
            x: cx,
            y: cy - 5,
            text: '0%',
            style: { font: '30px PT Serif', fill: '#ffffff' }
        });
        this.loadingText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            this.progressBar.clear();
            this.progressBar.fillStyle(0xff00ff, 1);
            this.progressBar.fillRect(cx - 450, cy - 80, 880 * value, 30);
            this.loadingText.setText(parseInt(value * 100) + '%');
        }, this);

        this.load.on('complete', this.onComplete, this);
    },

    create: function () {
        this.scene.start('Boot');
    },

    onComplete: function () {
        this.progressBar.destroy();
        this.progressBox.destroy();
        this.loadingText.destroy();
    }
});