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
        requestButton.style.display = 'none';
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
    accelerationX.value = x;
    accelerationY.value = y;
    accelerationZ.value = z;
  }

  {
    const { x, y, z } = event.accelerationIncludingGravity;
    accelerationIncludingGravityX.value = x;
    accelerationIncludingGravityY.value = y;
    accelerationIncludingGravityZ.value = z;
  }

  const { interval, rotationRate } = event;
  const { alpha, beta, gamma } = rotationRate;
  rotationAlpha.value = alpha;
  rotationBeta.value = beta;
  rotationGamma.value = gamma;
  intervalInMs.value = interval;
}

function handleOrientationEvent(event) {
  const { absolute, alpha, beta, gamma } = event;
  orientationAlpha.value = alpha;
  orientationBeta.value = beta;
  orientationGamma.value = gamma;
  isAbsolute.value = absolute;
}
