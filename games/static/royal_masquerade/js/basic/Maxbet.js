// base_classes/Maxbet.js
var Maxbet = (function() {
    function Maxbet(scene) {
        this.scene = scene;
        this.addMaxbet();
    }

    Maxbet.prototype.addMaxbet = function() {
        var self = this;
        this.maxBet = new Sprite(this.scene, Config.width - 477, Config.height - 50, 'bgButtons', 'btn-maxbet.png');
        this.txtMaxBet = this.scene.add.dynamicBitmapText(Config.width - 550, Config.height - 70, 'txt_bitmap', Options.txtMaxBet, 38);
        this.txtMaxBet.setDisplayCallback(this.scene.textCallback);
        this.txtCountMaxBet = this.scene.add.text(Config.width - 555, Config.height - 140, 'BET: ' + Options.coin * Options.line, {
            fontSize: '35px',
            color: '#fff',
            fontFamily: 'PT Serif'
        });
        this.maxBet.on('pointerdown', this.onMaxbet, this);
        this.maxBet.on('pointerup', function() {
            self.maxBet.setScale(1);
        });
    };

    Maxbet.prototype.onMaxbet = function() {
        if (!Options.checkClick && Options.line * Options.coin < 1000 && Options.txtAutoSpin === 'AUTO') {
            this.maxBet.setScale(0.9);
            this.scene.audioPlayButton();
            Options.line = 20;
            this.scene.btnLine.txtCountLine.setText(Options.line);
            Options.coin = 50;
            this.scene.coin.txtCountCoin.setText(Options.coin);
            this.txtCountMaxBet.setText('BET: ' + Options.line * Options.coin);
        }
    };

    return Maxbet;
})();
