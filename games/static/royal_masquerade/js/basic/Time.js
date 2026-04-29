// base_classes/Time.js
var Time = (function() {
    function Time(scene) {
        this.scene = scene;
        this.addTime();
    }

    Time.prototype.addTime = function() {
        this.txtTime = this.scene.add.text(Config.width - 1260, Config.height - 700, '', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'PT Serif'
        });
        this.callbackTime();
        this.scene.time.addEvent({
            delay: 1000,
            callback: this.callbackTime,
            callbackScope: this,
            loop: true
        });
    };

    Time.prototype.callbackTime = function() {
        var d = new Date();
        var hours = d.getHours();
        hours = hours >= 10 ? hours : '0' + hours;
        var minutes = d.getMinutes();
        minutes = minutes >= 10 ? minutes : '0' + minutes;
        var seconds = d.getSeconds();
        seconds = seconds >= 10 ? seconds : '0' + seconds;
        var time = hours + ':' + minutes + ':' + seconds;
        this.txtTime.setText(time);
    };

    return Time;
})();
