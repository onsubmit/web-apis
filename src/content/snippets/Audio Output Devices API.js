const audio = document.createElement("audio");
const currentSink = audio.sinkId || "default user agent device";
console.log(`Current audio device id: ${currentSink}`);

console.log("Prompting user for device selection...");
const device = await navigator.mediaDevices.selectAudioOutput();
console.log(`Device selected: ${JSON.stringify(device, null, 2)}`);

await audio.setSinkId(device.deviceId);
console.log(`New audio device id: ${audio.sinkId}`);

console.log("Playing the audio from the selected output device...");
audio.src = "//samplelib.com/lib/preview/mp3/sample-3s.mp3";
audio.play();
