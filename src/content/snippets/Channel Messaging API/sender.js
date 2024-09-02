if (!window.MessageChannel) {
  console.error('Channel Messaging API not supported in this browser.');
  return;
}

// ___Begin visible code snippet___

const div = document.getElementById('sender-example');
const input = div.querySelector('#message-input');
const output = div.querySelector('#message-output');
const button = div.querySelector('button');
const iframe = div.querySelector('iframe');
const channel = new MessageChannel();
const port1 = channel.port1;

// Wait for the iframe to load
iframe.addEventListener('load', onLoad);

function onLoad() {
  // Listen for button clicks
  button.addEventListener('click', onClick);
  // Listen for messages on port1
  port1.onmessage = onMessage;
  // Transfer port2 to the iframe
  iframe.contentWindow.postMessage('init', '*', [channel.port2]);
}

// Post a message on port1 when the button is clicked
function onClick(e) {
  e.preventDefault();
  port1.postMessage(input.value);
}

// Handle messages received on port1
function onMessage(e) {
  output.textContent = e.data;
  input.value = '';
}
