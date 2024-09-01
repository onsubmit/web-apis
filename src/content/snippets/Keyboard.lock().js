if (!navigator.keyboard) {
  console.error('Keyboard API not supported in this browser.');
  return;
}

// ___Begin visible code snippet___

await navigator.keyboard.lock(['KeyW', 'KeyA', 'KeyS', 'KeyD']);
console.log('Keypresses are being captured for the WASD keys.');
