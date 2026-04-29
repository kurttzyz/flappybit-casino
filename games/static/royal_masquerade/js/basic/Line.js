// base_classes/Line.js
var Line = (function() {
    function Line(scene) {
        this.scene = scene;
        this.addLine();
    }

    Line.prototype.addLine = function() {
        var self = this;
        this.btnLine = new Sprite(this.scene, Config.width - 865, Config.height - 50, 'bgButtons', 'btn-line.png');
        this.txtLine = this.scene.add.dynamicBitmapText(Config.width - 915, Config.height - 70, 'txt_bitmap', Options.txtLine, 38);
        this.txtLine.setDisplayCallback(this.scene.textCallback);
        this.txtCountLine = this.scene.add.text(Config.width - 880, Config.height - 140, Options.line, {
            fontSize: '35px',
            color: '#fff',
            fontFamily: 'PT Serif'
        });
        this.btnLine.on('pointerdown', function() {
            if (!Options.checkClick && Options.txtAutoSpin === 'AUTO') {
                self.btnLine.setScale(0.9);
                self.scene.audioPlayButton();
                if (Options.line < 20) {
                    Options.line++;
                    self.txtCountLine.setText(Options.line);
                    self.scene.maxBet.txtCountMaxBet.setText('BET: ' + Options.line * Options.coin);
                } else {
                    Options.line = 1;
                    self.txtCountLine.setText(Options.line);
                    self.scene.maxBet.txtCountMaxBet.setText('BET: ' + Options.line * Options.coin);
                }
            }
        });
        this.btnLine.on('pointerup', function() {
            self.btnLine.setScale(1);
        });
    };

    return Line;
})();
