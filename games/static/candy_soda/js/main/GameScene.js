// scenes/GameScene.js
var GameScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function GameScene() {
        Phaser.Scene.call(this, { key: 'Game' });
    },

    create: function() {
        this.audioObject = new Audio(this);
        Options.hsv = Phaser.Display.Color.HSVColorWheel();

        var bg = new Sprite(this, Config.width / 2, Config.height / 2, 'background', 'bg.jpg');

        this.container  = new Container(this, Config.width - 940, Config.height - 90);
        this.container2 = new Container(this, Config.width - 790, Config.height - 90);
        this.container3 = new Container(this, Config.width - 640, Config.height - 90);
        this.container4 = new Container(this, Config.width - 490, Config.height - 90);
        this.container5 = new Container(this, Config.width - 340, Config.height - 90);

        var machine = new Sprite(this, Config.width / 2, Config.height / 2, 'background', 'machine.png');

        this.valueMoney = localStorage.getItem('money') ? localStorage.getItem('money') : Options.money;
        this.txtMoney = this.add.text(Config.width - 1050, Config.height - 695, this.valueMoney + '$', {
            fontSize: '30px', color: '#fff', fontFamily: 'PT Serif'
        });
        this.setTextX(this.valueMoney);

        this.times   = new Time(this);
        this.credits = new Credit(this);

        var musicName = localStorage.getItem('music') ? localStorage.getItem('music') : 'btn_music_off.png';
        var soundName = localStorage.getItem('sound') ? localStorage.getItem('sound') : 'btn_sound_off.png';

        this.btnMusic = new Sprite(this, Config.width - 310, Config.height - 675, 'sound', musicName);
        this.btnMusic.setScale(0.6);
        this.btnSound = new Sprite(this, Config.width - 390, Config.height - 675, 'sound', soundName);
        this.btnSound.setScale(0.6);

        this.audioMusicName = this.btnMusic.frame.name;
        this.audioSoundName = this.btnSound.frame.name;

        this.btnMusic.on('pointerdown', this.onMusic, this);
        this.btnSound.on('pointerdown', this.onSound, this);

        if (this.audioMusicName === 'btn_music.png') {
            this.audioObject.musicDefault.play();
        }

        this.coin     = new Coin(this);
        this.btnLine  = new Line(this);
        this.maxBet   = new Maxbet(this);
        this.info     = new Info(this);
        this.autoSpin = new AutoSpin(this);
        this.baseSpin = new BaseSpin(this);
    },

    onMusic: function() {
        if (!Options.checkClick) {
            if (this.audioMusicName === 'btn_music.png') {
                this.audioMusicName = 'btn_music_off.png';
                this.audioObject.musicDefault.stop();
                this.audioObject.audioWin.stop();
            } else {
                this.audioMusicName = 'btn_music.png';
                this.audioPlayButton();
                this.audioObject.musicDefault.play();
            }
            if (localStorage.getItem('musics')) {
                localStorage.removeItem('musics');
            }
            localStorage.setItem('music', this.audioMusicName);
            this.btnMusic.setTexture('sound', this.audioMusicName);
        }
    },

    onSound: function() {
        if (!Options.checkClick) {
            if (this.audioSoundName === 'btn_sound.png') {
                this.audioSoundName = 'btn_sound_off.png';
            } else {
                this.audioSoundName = 'btn_sound.png';
                this.audioObject.audioButton.play();
            }
            if (localStorage.getItem('sounds')) {
                localStorage.removeItem('sounds');
            }
            localStorage.setItem('sound', this.audioSoundName);
            this.btnSound.setTexture('sound', this.audioSoundName);
        }
    },

    audioPlayButton: function() {
        if (this.audioSoundName === 'btn_sound.png') {
            this.audioObject.audioButton.play();
        }
    },

    setTextX: function(value) {
        if      (value >= 100000000) this.txtMoney.x = 217;
        else if (value >= 10000000)  this.txtMoney.x = 220;
        else if (value >= 1000000)   this.txtMoney.x = 230;
        else if (value >= 100000)    this.txtMoney.x = 240;
        else if (value >= 10000)     this.txtMoney.x = 240;
        else if (value >= 1000)      this.txtMoney.x = 250;
        else if (value >= 100)       this.txtMoney.x = 260;
        else if (value >= 10)        this.txtMoney.x = 270;
        else                         this.txtMoney.x = 280;
    },

    textCallback: function(data) {
        data.tint.topLeft    = Options.hsv[Math.floor(Options.i)].color;
        data.tint.topRight   = Options.hsv[359 - Math.floor(Options.i)].color;
        data.tint.bottomLeft = Options.hsv[359 - Math.floor(Options.i)].color;
        data.tint.bottomRight = Options.hsv[Math.floor(Options.i)].color;
        Options.i += 0.05;
        if (Options.i >= Options.hsv.length) Options.i = 0;
        return data;
    }
});
