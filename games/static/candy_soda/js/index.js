(function () {
    Config.scene = [PreloadScene, BootScene, GameScene];

    var game = new Phaser.Game(Config);

    // React to window resize and orientation changes on mobile
    function onResize() {
        if (game.scale) {
            game.scale.refresh();
        }
    }

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', function () {
        // Small delay lets the browser finish rotating before we refresh
        setTimeout(onResize, 200);
    });
    window.screen && window.screen.orientation &&
        window.screen.orientation.addEventListener('change', onResize);
})();