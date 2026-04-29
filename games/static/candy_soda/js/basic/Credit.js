// base_classes/Credit.js
var Credit = (function() {
    function Credit(scene) {
        this.scene = scene;
        this.addCredit();
    }

    Credit.prototype.addCredit = function() {
        var self = this;
        this.credits = new Sprite(this.scene, Config.width - 235, Config.height - 680,
            'about', 'btn-credits.png');
        this.credits.setScale(0.7);
        this.credits.on('pointerdown', function() {
            self.scene.audioPlayButton();
            self.paylines = new Sprite(self.scene, Config.width / 2, Config.height / 2,
                'about', 'palines.png');
            self.paylines.setDepth(1);
            self.btnExit = new Sprite(self.scene, Config.width - 30,
                Config.height - 635, 'bgButtons', 'btn_exit.png');
            self.btnExit.setScale(0.9);
            self.btnExit.setDepth(1);
            self.btnExit.on('pointerdown', function() {
                self.deleteCredit();
            });
        });
    };

    Credit.prototype.deleteCredit = function() {
        this.scene.audioPlayButton();
        this.btnExit.destroy();
        this.paylines.destroy();
    };

    return Credit;
})();
