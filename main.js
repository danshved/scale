var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var oscillator = null;

function play() {
    console.log("Clicked Play");
    if (oscillator === null) {
        oscillator = context.createOscillator();
        oscillator.frequency = 441;
        oscillator.connect(context.destination);
        oscillator.start();
    }
}

function stop() {
    console.log("Clicked Stop");
    if (oscillator !== null) {
        oscillator.stop();
        oscillator = null;
    }
}

// TODO: add gain note (right now it is too loud).
