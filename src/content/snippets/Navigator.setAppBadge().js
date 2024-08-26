if (!navigator.setAppBadge) {
  console.error("Badging API not supported in this browser.");
  return;
}

// ___Begin visible code snippet___

const notifications = 42;
await navigator.setAppBadge(notifications);

console.log(`Badge contents set to ${notifications}`);
