if (!window.EyeDropper) {
  console.error('EyeDropper API not supported in this browser.');
  return;
}

// ___Begin visible code snippet___

const startButton = document.getElementById('start-button');
const resultTextbox = document.getElementById('resultText');
const resultColor = document.getElementById('resultColor');
startButton.addEventListener('click', handleClick);

async function handleClick() {
  const eyeDropper = new window.EyeDropper();

  try {
    const result = await eyeDropper.open();
    resultTextbox.value = result.sRGBHex;
    resultColor.value = result.sRGBHex;
  } catch (e) {
    console.error(e.toString());
  }
}
