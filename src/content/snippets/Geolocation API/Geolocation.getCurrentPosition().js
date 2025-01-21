if (!navigator.geolocation) {
  console.error('Geolocation API not supported in this browser.');
  return;
}

// ___Begin visible code snippet___

const Geolocation = navigator.geolocation;

Geolocation.getCurrentPosition((position) => {
  console.log('Current location');
  console.log(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
});
