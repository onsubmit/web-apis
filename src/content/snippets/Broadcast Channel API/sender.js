if (!window.BroadcastChannel) {
  console.error('BroadcastChannel not supported in this browser.');
  return;
}

// ___Begin visible code snippet___

const channel = new BroadcastChannel('my-channel');
console.log('Broadcast channel created.');

let count = 0;
const interval = setInterval(() => {
  if (count++ < 30) {
    console.log(`Sending message ${count}...`);
    channel.postMessage({
      message: `Message ${count}`,
      timestamp: new Date().toUTCString(),
    });
  } else {
    console.log('Stopped sending messages...');
    clearInterval(interval);
    channel.close();
  }
}, 2000);
