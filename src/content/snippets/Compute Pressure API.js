/* eslint-disable no-undef */
if (!window.PressureObserver) {
  console.error('Compute Pressure API not supported in this browser.');
  return;
}

// ___Begin visible code snippet___

// eslint-disable-next-line no-undef
const observer = new PressureObserver((changes) => {
  const record = changes[changes.length - 1];
  console.log('Pressure observed:');
  console.debug(JSON.stringify(record, null, 2));
});

console.log(`Observable pressure sources: ${PressureObserver.knownSources}`);

PressureObserver.knownSources.forEach(async (source) => {
  await observer.observe(source, {
    sampleInterval: 1000, // ms
  });
});

setTimeout(() => {
  PressureObserver.knownSources.forEach(async (source) => {
    await observer.unobserve(source);
  });
}, 30 * 1000);
