// base_classes/Sprite.js
var Sprite = (function () {
    var Sprite = new Phaser.Class({
        Extends: Phaser.GameObjects.Sprite,

        initialize: function Sprite(scene, x, y, texture, frame) {
            Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
            scene.add.existing(this);

            // Standard interactive hit area
            this.setInteractive();

            // Expand the hit area on touch devices so small buttons are easier
            // to tap. We pad by 20px on every side beyond the display bounds.
            var self = this;
            this.once('added', function () {
                self._expandHitArea();
            });
            // Fallback: try immediately (sprite may already be on the scene)
            this._expandHitArea();
        },

        _expandHitArea: function () {
            // Only apply extra padding when a touch device is likely
            if (!window.matchMedia) return;
            if (!window.matchMedia('(pointer: coarse)').matches) return;

            var w = this.width  || 64;
            var h = this.height || 64;
            var pad = 20;
            this.setInteractive(
                new Phaser.Geom.Rectangle(-pad, -pad, w + pad * 2, h + pad * 2),
                Phaser.Geom.Rectangle.Contains
            );
        }
    });

    return Sprite;
})();