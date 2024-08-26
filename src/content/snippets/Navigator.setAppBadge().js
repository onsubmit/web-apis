const notifications = 42;
await navigator.setAppBadge(notifications);

console.log(`Badge contents set to ${notifications}`);
