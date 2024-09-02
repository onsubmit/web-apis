if (!window.MessageChannel) {
  console.error('Channel Messaging API not supported in this browser.');
  return;
}

// ___Begin visible code snippet___

const channel = new MessageChannel();
const port1 = channel.port1;

const div = document.getElementById('sender-example');
const input = div.querySelector('input');
const p = div.querySelector('p');
const button = div.querySelector('button');
const iframe = div.querySelector('iframe');

iframe.addEventListener('load', () => {
  button.addEventListener('click', onClick);
  port1.onmessage = onMessage;
  iframe.contentWindow.postMessage('init', '*', [channel.port2]);
});

function onClick(e) {
  e.preventDefault();
  port1.postMessage(input.value);
}

function onMessage(e) {
  p.textContent = e.data;
  input.value = '';
}
