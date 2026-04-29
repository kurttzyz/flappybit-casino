// base_classes/Spin.js
var Spin = (function () {

    function Spin(scene) {
        this.scene = scene;
        this.printResult();
        this.clearColor();
    }

    Spin.prototype.clearColor = function () {
        this.scene.baseSpin.bgSpin.clearTint();
        this.scene.autoSpin.buttonAuto.clearTint();
        this.scene.maxBet.maxBet.clearTint();
        this.scene.coin.coin.clearTint();
        this.scene.btnLine.btnLine.clearTint();
        this.scene.btnMusic.clearTint();
        this.scene.btnSound.clearTint();
    };

    Spin.prototype.printResult = function () {
        // Read symbol results directly from the 5 containers on the scene.
        // Each container holds 5 symbol sprites in its .list[].
        // Indices 1, 2, 3 are the 3 visible rows (top, middle, bottom).
        var containers = [
            this.scene.container,
            this.scene.container2,
            this.scene.container3,
            this.scene.container4,
            this.scene.container5
        ];

        for (var col = 0; col < containers.length; col++) {
            var list = containers[col].list;
            if (!list || list.length < 4) {
                console.error('Spin.printResult: container ' + col + ' list is missing or too short', list);
                return;
            }
            Options.result.push([
                list[3].frame.name,
                list[2].frame.name,
                list[1].frame.name
            ]);
        }

        this.getWinningLines();
    };

    Spin.prototype.getWinningLines = function () {
        for (var lineIndx = 0; lineIndx < Options.line; lineIndx++) {
            var streak = 0;
            var currentkind = null;

            for (var coordIndx = 0; coordIndx < Options.payLines[lineIndx].length; coordIndx++) {
                var coords = Options.payLines[lineIndx][coordIndx];
                var symbolAtCoords = Options.result[coords[0]][coords[1]];
                if (coordIndx === 0) {
                    currentkind = symbolAtCoords;
                    streak = 1;
                } else {
                    if (symbolAtCoords !== currentkind) break;
                    streak++;
                }
            }

            if (streak >= 3) {
                Options.winningLines.push(lineIndx + 1);
                this.audioPlayWin();
                this.mathMoney(currentkind, streak);
            } else {
                this.audioPlayLose();
            }
        }

        this.getLineArray(Options.winningLines);
        this.resetOptions();
    };

    Spin.prototype.getLineArray = function (lineArr) {
        if (!lineArr.length) return;
        for (var i = 0; i < lineArr.length; i++) {
            var lineName = 'payline_' + lineArr[i] + '.png';
            Options.lineArray.push(
                new Sprite(this.scene, Config.width / 2, Config.height / 2, 'line', lineName)
            );
        }
    };

    Spin.prototype.mathMoney = function (symbolName, streak) {
        var index = streak - 3;
        this.symbolValue(symbolName, index);
    };

    Spin.prototype.resetOptions = function () {
        Options.win          = 0;
        Options.moneyWin     = 0;
        Options.result       = [];
        Options.winningLines = [];
    };

    Spin.prototype.symbolValue = function (symbolName, index) {
        switch (symbolName) {
            case 'symbols_0.png': this.getMoney(Options.payvalues[0][index]); break;
            case 'symbols_1.png': this.getMoney(Options.payvalues[1][index]); break;
            case 'symbols_2.png': this.getMoney(Options.payvalues[2][index]); break;
            case 'symbols_3.png': this.getMoney(Options.payvalues[3][index]); break;
            case 'symbols_4.png': this.getMoney(Options.payvalues[4][index]); break;
            case 'symbols_5.png': this.getMoney(Options.payvalues[5][index]); break;
            case 'symbols_6.png': this.getMoney(Options.payvalues[6][index]); break;
            case 'symbols_7.png': this.getMoney(Options.payvalues[7][index]); break;
            case 'symbols_8.png': this.getMoney(Options.payvalues[8][index]); break;
            default:              this.getMoney(Options.payvalues[9][index]); break;
        }
    };

    Spin.prototype.audioPlayWin = function () {
        if (this.scene.audioMusicName === 'btn_music.png') {
            this.scene.audioObject.audioWin.play();
        }
    };

    Spin.prototype.audioPlayLose = function () {
        if (this.scene.audioMusicName === 'btn_music.png') {
            this.scene.audioObject.audioLose.play();
        }
    };

    Spin.prototype.getMoney = function (money) {
        var maxBet   = Options.line * Options.coin;
        var payValue = money / Options.line;
        Options.win += (payValue * maxBet);
        this.setTextureWin(Options.win);
    };

    Spin.prototype.setTextureWin = function (value) {
        Options.moneyWin = value;
        this.scene.valueMoney += Options.moneyWin;

        var width = this.setTextWidthWin();
        if (this.scene.txtWin) {
            this.scene.txtWin.destroy();
        }
        this.scene.txtWin = this.scene.add.text(
            width, Config.height - 130,
            'WIN: ' + Options.moneyWin + ' $ ',
            { fontSize: '20px', color: '#25a028', fontFamily: 'PT Serif' }
        );

        this.scene.baseSpin.saveLocalStorage();
    };

    Spin.prototype.setTextWidthWin = function () {
        if (Options.moneyWin >= 100000) return Config.width - 340;
        if (Options.moneyWin >= 10000)  return Config.width - 335;
        if (Options.moneyWin >= 1000)   return Config.width - 330;
        if (Options.moneyWin >= 100)    return Config.width - 322;
        return Config.width - 340;
    };

    return Spin;
})();