// config.js
var Config = {
    type: Phaser.AUTO,
    parent: 'phaser-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,           // Shrink/grow to fit, preserving aspect ratio
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720,
        min: {
            width: 320,
            height: 180
        },
        max: {
            width: 1280,
            height: 720
        }
    },
    dom: {
        createContainer: false
    },
    input: {
        activePointers: 3          // Support multi-touch (up to 3 fingers)
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    fps: {
        min: 30,
        target: 60
    },
    scene: []   // Populated in main.js after all scene classes are defined
};