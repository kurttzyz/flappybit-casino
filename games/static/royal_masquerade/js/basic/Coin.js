// base_classes/Coin.js
var Coin = (function() {
    function Coin(scene) {
        this.scene = scene;
        this.addCoin();
    }

    Coin.prototype.addCoin = function() {
        var self = this;
        this.coin = new Sprite(this.scene, Config.width - 678, Config.height - 50, 'bgButtons', 'btn-coin.png');
        this.txtCoin = this.scene.add.dynamicBitmapText(Config.width - 720, Config.height - 70, 'txt_bitmap', Options.txtCoin, 38);
        this.txtCoin.setDisplayCallback(this.scene.textCallback);
        this.txtCountCoin = this.scene.add.text(Config.width - 700, Config.height - 140, Options.coin, {
            fontSize: '35px',
            color: '#fff',
            fontFamily: 'PT Serif'
        });
        this.coin.on('pointerdown', this.onCoin, this);
        this.coin.on('pointerup', function() { self.coin.setScale(1); });
    };

    Coin.prototype.onCoin = function() {
        if (!Options.checkClick && Options.txtAutoSpin === 'AUTO') {
            this.coin.setScale(0.9);
            this.scene.audioPlayButton();
            if (Options.coin < 50) {
                Options.coin += 10;
                this.txtCountCoin.setText(Options.coin);
                this.scene.maxBet.txtCountMaxBet.setText('BET: ' + Options.coin * Options.line);
            } else {
                Options.coin = 10;
                this.txtCountCoin.setText(Options.coin);
                this.scene.maxBet.txtCountMaxBet.setText('BET: ' + Options.coin * Options.line);
            }
        }
    };

    return Coin;
})();
