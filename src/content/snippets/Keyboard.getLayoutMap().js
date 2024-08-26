if (!navigator.keyboard) {
  console.error("Keyboard API not supported in this browser.");
  return;
}

// ___Begin visible code snippet___

const layoutMap = await navigator.keyboard.getLayoutMap();

console.log(`layoutMap.size: ${layoutMap.size}`);

for (const [key, value] of layoutMap.entries()) {
  console.log(`${key}: ${value}`);
}
