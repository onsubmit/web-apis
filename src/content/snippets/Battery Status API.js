if (!navigator.getBattery) {
  console.error('navigator.getBattery() not supported in this browser.');
  return;
}

// ___Begin visible code snippet___

const battery = await navigator.getBattery();

battery.addEventListener('chargingchange', updateChargeInfo);
battery.addEventListener('levelchange', updateLevelInfo);
battery.addEventListener('chargingtimechange', updateChargingInfo);
battery.addEventListener('dischargingtimechange', updateDischargingInfo);

function updateChargeInfo(ev) {
  console.debug(ev ? 'chargingchange event' : 'initial state');

  if (battery.charging) {
    console.log('Battery is charging.');
    console.warn('Browser may have failed to report the battery status.');
  } else {
    console.log('Battery is not charging.');
  }
}

function updateLevelInfo(ev) {
  console.debug(ev ? 'levelchange event' : 'initial state');

  if (battery.level === 1.0) {
    console.log('Battery level is fully charged.');
    console.warn('Browser may have failed to report the battery status.');
  } else {
    console.log(`Battery level is ${battery.level * 100}%.`);
  }
}

function updateChargingInfo(ev) {
  console.debug(ev ? 'chargingtimechange event' : 'initial state');

  if (battery.chargingTime === 0) {
    console.log('Battery level is fully charged.');
    console.warn('Browser may have failed to report the battery status.');
  } else if (battery.chargingTime === Infinity) {
    console.log('Battery is discharging and will never fully charge.');
  } else {
    console.log(`Battery will fully charge in ${battery.chargingTime} seconds.`);
  }
}

function updateDischargingInfo(ev) {
  console.debug(ev ? 'dischargingtimechange event' : 'initial state');

  if (battery.dischargingTime === Infinity) {
    console.log('Battery is charging and will never fully discharge.');
    console.warn('Browser may have failed to report the battery status.');
  } else {
    console.log(`Battery will fully discharge in ${battery.dischargingTime} seconds.`);
  }
}

updateChargeInfo();
updateLevelInfo();
updateChargingInfo();
updateDischargingInfo();
