// Sample data arrays, replace with your actual data
const fingerPositions = [300.        , 284.21052632, 268.42105263, 252.63157895,
       236.84210526, 221.05263158, 205.26315789, 189.47368421,
       173.68421053, 157.89473684, 142.10526316, 126.31578947,
       110.52631579,  94.73684211,  78.94736842,  63.15789474,
        47.36842105,  31.57894737,  15.78947368,   0.        , 300, 300, 300, 300];
const bowPositions = [180.        , 186.31578947, 192.63157895, 198.94736842,
       205.26315789, 211.57894737, 217.89473684, 224.21052632,
       230.52631579, 236.84210526, 243.15789474, 249.47368421,
       255.78947368, 262.10526316, 268.42105263, 274.73684211,
       281.05263158, 287.36842105, 293.68421053, 300.        , 180, 180, 180, 180];

let isPlaying = false;
let source = null;
let audioBuffer = null;
let animationFrameId = null;
let currentIndex = 0;

// Load the audio buffer asynchronously
const loadAudioBuffer = async () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const response = await fetch('violin.wav'); // Ensure this path is correct
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
};

const playSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioBuffer) {
        source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.loop = true;
        source.start(0);
    }
};

const stopSound = () => {
    if (source) {
        source.stop();
        source = null;
    }
};

const updateAnimation = () => {
    const fingerImage = document.getElementById('finger-image');
    const bowImage = document.getElementById('bow-image');

    // Assuming these positions map to pixel values for simplicity
    if(fingerPositions && bowPositions) { // Make sure your arrays are defined
        fingerImage.style.left = `${fingerPositions[currentIndex]}px`;
        bowImage.style.bottom = `${bowPositions[currentIndex]}px`;

        currentIndex++;
        if (currentIndex >= fingerPositions.length) {
            currentIndex = 0; // Reset to loop the animation
        }
    }

    if (isPlaying) {
        animationFrameId = requestAnimationFrame(updateAnimation);
    }
};

document.getElementById('playPauseBtn').addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
        playSound();
        updateAnimation();
        document.getElementById('playPauseBtn').textContent = 'Pause';
    } else {
        stopSound();
        cancelAnimationFrame(animationFrameId);
        document.getElementById('playPauseBtn').textContent = 'Play';
    }
});

// Preload the audio buffer
loadAudioBuffer();
