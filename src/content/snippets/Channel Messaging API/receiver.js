if (!window.MessageChannel) {
  console.error('Channel Messaging API not supported in this browser.');
  return;
}

// ___Begin visible code snippet___

let port2;
const list = document.querySelector('ul#receiverList');

window.addEventListener('message', (e) => {
  if (e.ports[0]) {
    port2 = e.ports[0];
    port2.onmessage = onMessage;
  }
});

function onMessage(e) {
  log(e.data);
  port2.postMessage(`Message received by <iframe>: ${e.data}`);
}

function log(data) {
  const listItem = document.createElement('li');
  listItem.textContent = data;
  list.appendChild(listItem);
}
