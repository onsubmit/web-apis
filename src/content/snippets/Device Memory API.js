if (!navigator.deviceMemory) {
  console.error('Device Memory API not supported in this browser.');
  return;
}

// ___Begin visible code snippet___

const memory = navigator.deviceMemory;
console.log(`This device has at least ${memory} gigabytes of RAM.`);
