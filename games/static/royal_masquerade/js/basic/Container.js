// base_classes/Container.js
var Container = (function() {
    var Container = new Phaser.Class({
        Extends: Phaser.GameObjects.Container,

        initialize: function Container(scene, x, y) {
            Phaser.GameObjects.Container.call(this, scene, x, y);
            scene.add.existing(this);

            var symbols1 = scene.add.sprite(0, 0, 'symbols', 'symbols_' + this.randomBetween(0, 9) + '.png');
            var symbols2 = scene.add.sprite(0, -Options.symbolHeight, 'symbols', 'symbols_' + this.randomBetween(0, 9) + '.png');
            var symbols3 = scene.add.sprite(0, -Options.symbolHeight * 2, 'symbols', 'symbols_' + this.randomBetween(0, 9) + '.png');
            var symbols4 = scene.add.sprite(0, -Options.symbolHeight * 3, 'symbols', 'symbols_' + this.randomBetween(0, 9) + '.png');
            var symbols5 = scene.add.sprite(0, -Options.symbolHeight * 4, 'symbols', 'symbols_' + this.randomBetween(0, 9) + '.png');
            this.add([symbols1, symbols2, symbols3, symbols4, symbols5]);
        },

        randomBetween: function(min, max) {
            return Phaser.Math.Between(min, max);
        }
    });

    return Container;
})();
