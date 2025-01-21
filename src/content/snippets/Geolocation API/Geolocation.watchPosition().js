if (!navigator.geolocation) {
  console.error('Geolocation API not supported in this browser.');
  return;
}

// ___Begin visible code snippet___

const Geolocation = navigator.geolocation;
let timestamp;
const clearButton = document.getElementById('clear-button');

console.log(
  'Give the console some time to output the updates. Remember to click clear to stop the watcher completely.'
);

clearButton.addEventListener('click', handleClick);

Geolocation.watchPosition(
  (position) => {
    timestamp = new Date(position.timestamp);
    console.log(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}, Timestamp: ${timestamp}`);
  },
  (error) => {
    console.error(`ERROR(${error.code}): ${error.message}`);
  },
  {
    enableHighAccuracy: true,
    maximumAge: 0,
  }
);

function handleClick() {
  location.reload();
}
