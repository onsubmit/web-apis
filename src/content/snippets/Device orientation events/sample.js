/* eslint-disable no-undef */
if (!window.DeviceOrientationEvent) {
  console.error('Device orientation events are not supported in this browser.');
}

// ___Begin visible code snippet___

if (typeof DeviceMotionEvent.requestPermission === 'function') {
  const requestButton = document.getElementById('request');
  requestButton.style.display = 'inline-block';
  requestButton.onclick = () => {
    DeviceMotionEvent.requestPermission().then((permissionState) => {
      if (permissionState === 'granted') {
        addEventListeners();
      } else {
        console.warn('Permission rejected');
      }
    });
  };
} else {
  addEventListeners();
}

function addEventListeners() {
  window.addEventListener('devicemotion', handleMotionEvent);
  window.addEventListener('deviceorientation', handleOrientationEvent);
}

function handleMotionEvent(event) {
  {
    const { x, y, z } = event.acceleration;
    console.log(`acceleration: ${JSON.stringify({ x, y, z })}`);
  }

  {
    const { x, y, z } = event.accelerationIncludingGravity;
    console.log(`accelerationIncludingGravity: ${JSON.stringify({ x, y, z })}`);
  }

  const { interval, rotationRate } = event;
  const { alpha, beta, gamma } = rotationRate;
  console.log(`rotationRate: ${JSON.stringify({ alpha, beta, gamma })}`);
  console.log(`interval: ${interval}`);
}

function handleOrientationEvent(event) {
  const { absolute, alpha, beta, gamma } = event;
  console.log(`orientation: ${JSON.stringify({ alpha, beta, gamma })}`);
  console.log(`absolute: ${absolute}`);
}
