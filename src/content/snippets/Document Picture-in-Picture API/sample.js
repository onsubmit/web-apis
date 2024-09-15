if (!('documentPictureInPicture' in window)) {
  console.error(
    'Document Picture-in-Picture API not supported in this browser.'
  );
  return;
}

// ___Begin visible code snippet___

const docPip = window.documentPictureInPicture;

const player = document.getElementById('player');
const audio = document.getElementById('audio');
const container = document.getElementById('container');
const inPipMessage = document.getElementById('in-pip');
const togglePipButton = document.getElementById('toggle');

togglePipButton.addEventListener('click', togglePictureInPicture);

async function togglePictureInPicture() {
  if (docPip.window) {
    inPipMessage.style.display = 'none';
    container.append(player);
    docPip.window.close();
    return;
  }

  // Open PIP window
  const pipWindow = await docPip.requestWindow({
    width: 400,
    height: 200,
  });

  // Move audio player to PIP window
  pipWindow.document.body.append(player);
  inPipMessage.style.display = 'block';
  console.log(`${new Date().toUTCString()}: PIP window opened`);

  // Handle PIP window closes
  pipWindow.addEventListener('pagehide', () => {
    inPipMessage.style.display = 'none';
    container.append(player);
    console.log(`${new Date().toUTCString()}: PIP window closed`);
  });
}

// Handle PIP window opens
docPip.addEventListener('enter', (event) => {
  const pipWindow = event.window;
  pipWindow.document.body.innerHTML = '';

  const muteButton = pipWindow.document.createElement('button');
  muteButton.textContent = 'Mute';
  muteButton.addEventListener('click', () => {
    audio.muted = !audio.muted;
    const ts = new Date().toUTCString();
    console.log(`${ts}: Audio ${muteButton.textContent}d`);
    muteButton.textContent = { true: 'Unmute', false: 'Mute' }[audio.muted];
  });

  pipWindow.document.body.append(muteButton);
});
