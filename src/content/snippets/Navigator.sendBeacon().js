if (!navigator.sendBeacon) {
  console.error('Beacon API not supported in this browser.');
  return;
}

// ___Begin visible code snippet___

const data = new FormData();
data.append('browser', navigator.userAgent);

const url = 'https://example.com/log';
const success = navigator.sendBeacon(url, data);

if (success) {
  console.log('Analytics data sent');
  console.debug(`${[...data.entries()].map(([k, v]) => `${k}=${v}`)}`);
} else {
  console.warn('Analytics data failed to send');
}
