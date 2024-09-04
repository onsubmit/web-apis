if (!window.BroadcastChannel) {
  console.error('BroadcastChannel not supported in this browser.');
  return;
}

// ___Begin visible code snippet___

const channel = new BroadcastChannel('my-channel');
console.log('Broadcast channel created.');

const div = document.getElementById('sender-example');
const input = div.querySelector('input');
const button = div.querySelector('button');

button.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(`Sending message: ${input.value}...`);
  channel.postMessage({
    message: `Message ${input.value}`,
    timestamp: new Date().toUTCString(),
  });
  input.value = '';
});
