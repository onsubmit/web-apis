if (!window.BroadcastChannel) {
  console.error('BroadcastChannel not supported in this browser.');
  return;
}

// ___Begin visible code snippet___

console.log('Receiver 1: listening for messages...');

const channel = new BroadcastChannel('my-channel');

channel.addEventListener('message', (event) => {
  console.log('Receiver 1: Message received');
  console.debug(JSON.stringify(getMessageEvent(event), null, 2));
});

function getMessageEvent(event) {
  return {
    data: event.data,
    origin: event.origin,
  };
}
