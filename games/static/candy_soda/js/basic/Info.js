// base_classes/Info.js
var Info = (function() {
    function Info(scene) {
        this.scene = scene;
        this.click = false;
        this.addInfo();
    }

    Info.prototype.addInfo = function() {
        this.info = new Sprite(this.scene, Config.width - 1020, Config.height - 50, 'bgButtons', 'btn-info.png');
        var txtInfo = this.scene.add.dynamicBitmapText(Config.width - 1060, Config.height - 70, 'txt_bitmap', Options.txtInfo, 38);
        txtInfo.setDisplayCallback(this.scene.textCallback);
        this.info.on('pointerdown', this.showPayTable, this);
    };

    Info.prototype.showPayTable = function() {
        if (!this.click) {
            this.click = true;
            this.scene.audioPlayButton();
            this.showTable();
            var self = this;
            this.btnExit = new Sprite(this.scene, Config.width - 30,
                Config.height - 635, 'bgButtons', 'btn_exit.png');
            this.btnExit.setScale(0.9);
            this.btnExit.setDepth(1);
            this.btnExit.on('pointerdown', function() {
                self.deleteTable();
            });
        }
    };

    Info.prototype.showTable = function() {
        this.payValues = [];
        this.paytable = new Sprite(this.scene, Config.width / 2, Config.height / 2,
            'about', 'paytable.png');
        this.paytable.setDepth(1);

        var width = 190, width2 = width, height = 25, height2 = 245;

        for (var i = 0; i < Options.payvalues.length; i++) {
            if (i >= 5) {
                for (var j = 0; j < Options.payvalues[i].length; j++) {
                    height2 -= 30;
                    this.payValues.push(this.scene.add.text(width2, Config.height / 2 + height2, Options.payvalues[i][j], {
                        fontSize: '30px',
                        color: '#630066',
                        fontFamily: 'PT Serif'
                    }).setDepth(1));
                }
                width2 += 225;
                height2 = 245;
            } else {
                for (var j = 0; j < Options.payvalues[i].length; j++) {
                    height += 30;
                    this.payValues.push(this.scene.add.text(width, Config.height / 2 - height, Options.payvalues[i][j], {
                        fontSize: '30px',
                        color: '#630066',
                        fontFamily: 'PT Serif'
                    }).setDepth(1));
                }
                width += 225;
                height = 25;
            }
        }
    };

    Info.prototype.deleteTable = function() {
        this.click = false;
        this.scene.audioPlayButton();
        this.paytable.destroy();
        this.btnExit.destroy();
        if (this.payValues.length > 0) {
            for (var i = 0; i < this.payValues.length; i++) {
                this.payValues[i].destroy();
            }
        }
    };

    return Info;
})();
