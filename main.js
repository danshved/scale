var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var oscillator = null;


// Parameters of the curve to modulate the sine waves.
var midFrequency = 349.2282;  // F#, roughly in the middle of the keyboard.
var sigma = 1.5;  // In octaves

// How many frequencies to include in the tone. The distance between the lowest
// and the highest frequency will be (harmonicsCount - 1) octaves.
var harmonicsCount = 13;
var bottomFrequency = 20;
var topFrequency = 20000;

function createSheppardOscillator(index) {
    // Create a periodic wave.
    index = ((index % 12) + 12) % 12;
    var bottomFrequency = 440.0 / 64.0 * Math.exp(index / 12.0 * Math.log(2))
    var real = new Float32Array(1 + (1 << harmonicsCount));
    var imag = new Float32Array(1 + (1 << harmonicsCount));

    real.fill(0)
    imag.fill(0)
    for (var i = 0; i < harmonicsCount; i++) {
        var frequencyIndex = 1 << i;
        var frequency = bottomFrequency * frequencyIndex;

        // Cut out everything outside the audible range. This also technically
        // assures that the wave is the same when bottomFrequency is 440 / 2^6
        // and 440 / 2^5.
        if (frequency < bottomFrequency || frequency > topFrequency) {
            continue;
        }

        var delta = (Math.log(frequency) - Math.log(midFrequency)) / Math.log(2);
//        real[frequencyIndex] = Math.exp(-delta*delta / (sigma * sigma));
        imag[frequencyIndex] = Math.exp(-delta*delta / (sigma * sigma));
//        var x = delta / sigma;
//        if (x > -1.0 && x < 1.0) {
//            real[frequencyIndex] = Math.max(0, Math.cos(x * Math.PI / 2.0))
//        }

    }

    var wave = context.createPeriodicWave(real, imag);

    // Create an oscillator node.
    oscillator = context.createOscillator();
    oscillator.frequency.value = bottomFrequency;
    oscillator.setPeriodicWave(wave);
    return oscillator;
}

// index is the tone number, measured in semitones.
// 0 = A
// 1 = Bb
// ...
// 11 = Ab
// 12 = A
function play(index) {
    if (oscillator === null) {
        oscillator = createSheppardOscillator(index);
        oscillator.connect(context.destination);
        oscillator.start();
    }
}

function stop() {
    if (oscillator !== null) {
        oscillator.stop();
        oscillator.disconnect();
        oscillator = null;
    }
}

// TODO: add gain node (right now it is too loud).
// TODO: fade out cleanly when note stops playing.
