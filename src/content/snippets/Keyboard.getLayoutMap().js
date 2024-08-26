const layoutMap = await navigator.keyboard.getLayoutMap();

console.log(`layoutMap.size: ${layoutMap.size}`);

for (const [key, value] of layoutMap.entries()) {
  console.log(`${key}: ${value}`);
}
