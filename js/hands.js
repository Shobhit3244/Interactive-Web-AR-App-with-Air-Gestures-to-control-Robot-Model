// Hand Tracking using MediaPipe Hands
// This module handles gesture detection for air pinch and drag interactions

let handsInstance;
let handCamera;
let handResults = null;

function initHandTracking() {
    const videoElement = document.getElementById('hand-video');
    const canvasElement = document.getElementById('hand-canvas');
    const canvasCtx = canvasElement.getContext('2d');

    // Configure MediaPipe Hands
    handsInstance = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });

    handsInstance.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    handsInstance.onResults(onHandResults);

    // Setup camera
    handCamera = new Camera(videoElement, {
        onFrame: async () => {
            await handsInstance.send({ image: videoElement });
        },
        width: 640,
        height: 480
    });

    handCamera.start();

    console.log('Hand tracking initialized');
}

function onHandResults(results) {
    handResults = results;

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        handDetected = true;
        document.getElementById('hand-status').textContent = 'Yes';
        
        const landmarks = results.multiHandLandmarks[0];
        
        // Process hand landmarks for pinch detection
        handlePinchInteraction(landmarks);
    } else {
        handDetected = false;
        document.getElementById('hand-status').textContent = 'No';
        isPinching = false;
        document.getElementById('pinch-status').textContent = 'No';
    }
}

function calculatePinchDistance(landmarks) {
    // Calculate distance between thumb tip (4) and index finger tip (8)
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];

    const distance = Math.sqrt(
        Math.pow(indexTip.x - thumbTip.x, 2) +
        Math.pow(indexTip.y - thumbTip.y, 2) +
        Math.pow(indexTip.z - thumbTip.z, 2)
    );

    return distance;
}

function getHandPosition(landmarks) {
    // Get average position of index finger tip and thumb tip for pinch center
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];

    return {
        x: (thumbTip.x + indexTip.x) / 2,
        y: (thumbTip.y + indexTip.y) / 2,
        z: (thumbTip.z + indexTip.z) / 2
    };
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initHandTracking,
        calculatePinchDistance,
        getHandPosition
    };
}