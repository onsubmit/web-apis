if (!navigator.clearAppBadge) {
  console.error('Badging API not supported in this browser.');
  return;
}

// ___Begin visible code snippet___

await navigator.clearAppBadge();

console.log('Badge contents cleared');
