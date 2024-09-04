if (!window.BroadcastChannel) {
  console.error('BroadcastChannel not supported in this browser.');
  return;
}

// ___Begin visible code snippet___

const list = document.querySelector('ol#receiverList');

const channel = new BroadcastChannel('my-channel');
channel.addEventListener('message', (event) => {
  const eventStr = JSON.stringify(getMessageEvent(event));
  log(`Message received: ${eventStr}`);
});

function getMessageEvent(event) {
  return {
    data: event.data,
    origin: event.origin,
  };
}

function log(data) {
  const listItem = document.createElement('li');
  listItem.textContent = data;
  list.appendChild(listItem);
}
