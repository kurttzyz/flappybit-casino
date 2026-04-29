// scenes/BootScene.js
var BootScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function BootScene() {
        Phaser.Scene.call(this, { key: 'Boot' });
    },

    create: function() {
        var self = this;
        var scaleObject = { default: 1.2, scale: 1.1, scale2: 1, scale3: 0.9 };

        this.audioObject = new Audio(this);
        this.audioObject.musicBackgroundDefault.play();

        var bgloading = new Sprite(this, Config.width / 2, Config.height / 2, 'bgPreload', 'bg_menu.png');
        var title = new Sprite(this, Config.width / 2, Config.height - 500, 'logo', 'logo_game.png');
        title.setScale(scaleObject.default);

        var timer = this.time.addEvent({
            delay: 150,
            callback: function() {
                if      (title.scale === scaleObject.default) title.setScale(scaleObject.scale);
                else if (title.scale === scaleObject.scale)   title.setScale(scaleObject.scale2);
                else if (title.scale === scaleObject.scale2)  title.setScale(scaleObject.scale3);
                else                                          title.setScale(scaleObject.default);
            },
            callbackScope: this,
            loop: true
        });

        this.btn = new Sprite(this, Config.width / 2, Config.height - 150, 'bgButtons', 'btn_play.png');
        this.btn.setScale(0.9);
        this.btn.on('pointerdown', function() {
            self.audioObject.musicBackgroundDefault.stop();
            timer.remove();
            self.audioObject.audioButton.play();
            self.scene.start('Game');
        });
    }
});
