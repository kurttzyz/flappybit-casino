// base_classes/BaseSpin.js
var BaseSpin = (function() {
    function BaseSpin(scene) {
        this.scene = scene;
        this.addSpin();
    }

    BaseSpin.prototype.addSpin = function() {
        var self = this;
        this.bgSpin = new Sprite(this.scene, Config.width - 275, Config.height - 50, 'bgButtons', 'btn-spin.png');
        this.txtSpin = this.scene.add.dynamicBitmapText(Config.width - 315, Config.height - 70, 'txt_bitmap', Options.txtSpin, 38);
        this.txtSpin.setDisplayCallback(this.scene.textCallback);
        this.bgSpin.on('pointerdown', this.playTweens, this);
        this.bgSpin.on('pointerup', function() {
            self.bgSpin.setScale(1);
        });
    };

    BaseSpin.prototype.playTweens = function() {
        if (!Options.checkClick &&
            this.scene.valueMoney >= (Options.coin * Options.line) &&
            Options.txtAutoSpin === 'AUTO') {
            this.destroyLineArr();
            this.setColor();
            Options.checkClick = true;
            this.bgSpin.setScale(0.9);
            this.removeTextWin();
            this.saveLocalStorage();
            this.tweens = new Tween(this.scene);
        }
    };

    BaseSpin.prototype.destroyLineArr = function() {
        if (Options.lineArray.length > 0) {
            for (var i = 0; i < Options.lineArray.length; i++) {
                Options.lineArray[i].destroy();
            }
            Options.lineArray = [];
        }
    };

    BaseSpin.prototype.removeTextWin = function() {
        this.scene.audioPlayButton();
        if (this.scene.audioMusicName === 'btn_music.png') {
            this.scene.audioObject.audioWin.stop();
            this.scene.audioObject.audioReels.play();
        }
        this.scene.valueMoney -= (Options.coin * Options.line);
        this.scene.txtMoney.setText(this.scene.valueMoney + '$');
        if (this.scene.txtWin) {
            this.scene.txtWin.destroy();
        }
    };

    BaseSpin.prototype.setColor = function() {
        this.bgSpin.setTint(0xa09d9d);
        this.scene.autoSpin.buttonAuto.setTint(0xa09d9d);
        this.scene.maxBet.maxBet.setTint(0xa09d9d);
        this.scene.coin.coin.setTint(0xa09d9d);
        this.scene.btnLine.btnLine.setTint(0xa09d9d);
        this.scene.btnMusic.setTint(0xa09d9d);
        this.scene.btnSound.setTint(0xa09d9d);
    };

    BaseSpin.prototype.saveLocalStorage = function() {
        if (localStorage.getItem('money')) {
            localStorage.removeItem('money');
        }
        localStorage.setItem('money', this.scene.valueMoney);
        this.scene.setTextX(this.scene.valueMoney);
        this.scene.txtMoney.setText(this.scene.valueMoney + '$');
    };

    return BaseSpin;
})();
