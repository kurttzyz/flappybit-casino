// base_classes/Tween.js
var Tween = (function() {
    function Tween(scene) {
        this.scene = scene;
        this.renderTweens();
    }

    Tween.prototype.renderTweens = function() {
        var self = this;

        // ── helper: shared onRepeat logic ──────────────────────────────────────
        function makeOnRepeat() {
            return function() {
                var randomNumber = Phaser.Math.RND.between(0, 9);
                this.updateTo('y', this.targets[0].y + Options.symbolHeight, true);
                this.targets[0].first.y = this.targets[0].last.y - Options.symbolHeight;
                var symbol = this.targets[0].first;
                symbol.setVisible(true).setTexture('symbols_blur', 'symbols_' + randomNumber + '.png');
                this.targets[0].moveTo(symbol, 4);
            };
        }

        // ── helper: shared inner onComplete (snap-back tween) ──────────────────
        function makeInnerComplete(isLast) {
            return function() {
                this.targets[0].last.y = this.targets[0].first.y + Options.symbolHeight;
                var symbol = this.targets[0].last;
                this.targets[0].moveTo(symbol, 0);
                for (var i = 0; i < 5; i++) {
                    var symbolsName = this.targets[0].list[i].frame.name;
                    this.targets[0].list[i].setTexture('symbols', symbolsName);
                }
                if (this.targets[0].scene.audioMusicName === 'btn_music.png') {
                    this.targets[0].scene.audioObject.audioReelStop.play();
                    if (isLast) {
                        this.targets[0].scene.audioObject.audioReels.stop();
                    }
                }
                if (isLast) {
                    var spin = new Spin(this.targets[0].scene);
                    Options.checkClick = false;
                }
            };
        }

        // ── helper: outer onComplete (launches snap-back tween) ────────────────
        function makeOuterComplete(isLast) {
            return function() {
                this.targets[0].scene.tweens.add({
                    targets: this.targets[0],
                    props: { y: { value: '-=' + Options.symbolHeight, duration: Options.duration * 2 } },
                    repeat: 1,
                    onRepeat: function() {
                        this.updateTo('y', this.targets[0].y - Options.symbolHeight, true);
                    },
                    onComplete: makeInnerComplete(isLast)
                });
            };
        }

        // ── helper: build one column tween ────────────────────────────────────
        function makeColumnTween(container, repeatIndex, isLast) {
            return self.scene.tweens.add({
                targets: container,
                props: { y: { value: '+=' + Options.symbolHeight, duration: Options.duration } },
                repeat: Options.repeat[repeatIndex],
                onRepeat: makeOnRepeat(),
                onComplete: makeOuterComplete(isLast)
            }, self);
        }

        this.columnTween1 = makeColumnTween(this.scene.container,  0, false);
        this.columnTween2 = makeColumnTween(this.scene.container2, 1, false);
        this.columnTween3 = makeColumnTween(this.scene.container3, 2, false);
        this.columnTween4 = makeColumnTween(this.scene.container4, 3, false);
        this.columnTween5 = makeColumnTween(this.scene.container5, 4, true);
    };

    return Tween;
})();
