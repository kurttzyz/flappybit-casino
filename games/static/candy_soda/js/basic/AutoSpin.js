// base_classes/AutoSpin.js
var AutoSpin = (function() {
    function AutoSpin(scene) {
        this.scene = scene;
        this.autoSpin();
    }

    AutoSpin.prototype.autoSpin = function() {
        var self = this;
        this.buttonAuto = new Sprite(this.scene, Config.width - 110, Config.height - 50, 'bgButtons', 'btn-info.png');
        this.txtAutoSpin = this.scene.add.dynamicBitmapText(Config.width - 155, Config.height - 70, 'txt_bitmap', Options.txtAutoSpin, 38);
        this.txtAutoSpin.setDisplayCallback(this.scene.textCallback);
        this.buttonAuto.on('pointerdown', function() {
            if (!Options.checkClick) {
                self.buttonAuto.setScale(0.9);
                self.playSpeedAuto();
            }
        });
        this.buttonAuto.on('pointerup', function() {
            self.buttonAuto.setScale(1);
        });
    };

    AutoSpin.prototype.playSpeedAuto = function() {
        var self = this;
        if (Options.txtAutoSpin === 'STOP') {
            Options.txtAutoSpin = 'AUTO';
            this.txtAutoSpin.setText(Options.txtAutoSpin);
            if (this.txtSpeed && this.timer) {
                this.txtSpeed.destroy();
                this.timer.remove();
            }
        } else {
            Options.txtAutoSpin = 'STOP';
            this.txtAutoSpin.setText(Options.txtAutoSpin);
            this.scene.audioPlayButton();

            this.bgAuto = new Sprite(this.scene, Config.width / 2, Config.height / 2, 'autoSpin', 'bg_auto.png');
            this.auto = new Sprite(this.scene, Config.width / 2, Config.height / 2 - 100, 'bgButtons', 'btn-spin.png');
            this.txtAuto = this.scene.add.text(Config.width / 2 - 5, Config.height / 2 - 115,
                Options.txtAuto, { fontSize: '35px', color: '#fff', fontFamily: 'PT Serif' });

            this.setXAuto();
            this.plus();
            this.minus();
            this.play();
            this.exit();
        }
    };

    AutoSpin.prototype.plus = function() {
        var self = this;
        this.btnPlus = new Sprite(this.scene, Config.width / 2 - 100, Config.height / 2 - 100, 'autoSpin', 'btn_plus_bet.png');
        this.btnPlus.on('pointerdown', function() {
            self.scene.audioPlayButton();
            if (Options.txtAuto < 100) {
                self.btnMinus.clearTint();
                self.btnPlus.setScale(0.9);
                Options.txtAuto += 5;
                Options.txtAuto < 100 ? self.txtAuto.x = 620 : self.txtAuto.x = 610;
                self.txtAuto.setText(Options.txtAuto);
            }
            if (Options.txtAuto === 100) {
                self.btnPlus.setTint(0xa09d9d);
            }
        });
        this.btnPlus.on('pointerup', function() {
            self.btnPlus.setScale(1);
        });
    };

    AutoSpin.prototype.minus = function() {
        var self = this;
        this.btnMinus = new Sprite(this.scene, Config.width / 2 + 100, Config.height / 2 - 100, 'autoSpin', 'btn_minus_bet.png');
        this.btnMinus.on('pointerdown', function() {
            self.scene.audioPlayButton();
            if (Options.txtAuto > 5) {
                self.btnPlus.clearTint();
                self.btnMinus.setScale(0.9);
                Options.txtAuto -= 5;
                self.setXAuto();
                self.txtAuto.setText(Options.txtAuto);
            }
            if (Options.txtAuto === 5) {
                self.btnMinus.setTint(0xa09d9d);
            }
        });
        this.btnMinus.on('pointerup', function() {
            self.btnMinus.setScale(1);
        });
    };

    AutoSpin.prototype.play = function() {
        var self = this;
        this.btnPlay = new Sprite(this.scene, Config.width / 2, Config.height / 2 + 100, 'bgButtons', 'btn_play.png');
        this.btnPlay.setScale(0.9);
        this.btnPlay.on('pointerdown', function() {
            self.scene.audioPlayButton();
            self.removeImgAuto();
            if (self.scene.valueMoney >= Options.coin * Options.line) {
                self.speedPlay(Options.txtAuto);
            } else {
                self.setTextAuto();
            }
        });
    };

    AutoSpin.prototype.exit = function() {
        var self = this;
        this.btnExit = new Sprite(this.scene, Config.width - 30, Config.height - 635, 'bgButtons', 'btn_exit.png');
        this.btnExit.setScale(0.9);
        this.btnExit.on('pointerdown', function() {
            self.scene.audioPlayButton();
            self.removeImgAuto();
            self.setTextAuto();
        });
    };

    AutoSpin.prototype.speedPlay = function(speed) {
        var self = this;
        var width = speed > 5 ? Config.width - 150 : Config.width - 130;

        this.txtSpeed = this.scene.add.dynamicBitmapText(width, Config.height / 2 - 350, 'txt_bitmap', speed, 80);
        this.txtSpeed.setDisplayCallback(this.scene.textCallback);

        this.timer = this.scene.time.addEvent({
            delay: 500,
            callback: function() {
                self.timer.delay = 4500;
                if (speed > 0 && self.scene.valueMoney >= Options.coin * Options.line) {
                    self.scene.baseSpin.setColor();
                    Options.checkClick = true;
                    self.scene.baseSpin.destroyLineArr();
                    self.scene.baseSpin.removeTextWin();
                    self.scene.baseSpin.saveLocalStorage();
                    self.tweens = new Tween(self.scene);
                    speed--;
                    self.txtSpeed.setText(speed);
                } else {
                    Options.checkClick = false;
                    self.timer.remove(false);
                    self.txtSpeed.destroy();
                    self.setTextAuto();
                }
            },
            loop: true
        });
    };

    AutoSpin.prototype.setTextAuto = function() {
        Options.txtAutoSpin = 'AUTO';
        this.txtAutoSpin.setText(Options.txtAutoSpin);
    };

    AutoSpin.prototype.setXAuto = function() {
        if (Options.txtAuto >= 100)      this.txtAuto.x = 610;
        else if (Options.txtAuto >= 10)  this.txtAuto.x = 620;
        else                             this.txtAuto.x = 635;
    };

    AutoSpin.prototype.removeImgAuto = function() {
        this.bgAuto.destroy();
        this.btnPlus.destroy();
        this.btnMinus.destroy();
        this.auto.destroy();
        this.txtAuto.destroy();
        this.btnPlay.destroy();
        this.btnExit.destroy();
    };

    return AutoSpin;
})();
