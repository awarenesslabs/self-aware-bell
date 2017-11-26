'use strict';

var bellCheckEvery = 0.1; //Every 10 seconds

function setAlarm(event) {
  if(event.target.value === '0') {
    clearAlarm();
    window.close();
    return;
  }
  let minutes = parseFloat(event.target.value);
  chrome.browserAction.setBadgeText({text: ' '});
  chrome.storage.sync.set({bellTimeInMinutes: minutes});
  chrome.storage.sync.set({bellCheckEvery: bellCheckEvery});
  chrome.alarms.create({periodInMinutes: bellCheckEvery, delayInMinutes:bellCheckEvery});
  window.close();
}

function setVolume(event) {
  console.log(event.target.value);
  const volumeValue = event.target.value / 100.0;
  chrome.storage.sync.set({volume: volumeValue});
}

function clearAlarm() {
  chrome.browserAction.setBadgeText({text: ''});
  chrome.alarms.clearAll();
  chrome.storage.sync.set({bellTimeInMinutes: 0});
  window.close();
}

document.getElementById('ringTime').addEventListener('change', setAlarm);
document.getElementById('cancelAlarm').addEventListener('click', clearAlarm);
document.getElementById('volume').addEventListener('change', setVolume);

function initUi() {
  initBellTimeUi();
  initVolumeUi();
}

function initBellTimeUi() {
  chrome.storage.sync.get('bellTimeInMinutes', function(item) {
    let bellTimeInMinutes = (item && item.bellTimeInMinutes) ? item.bellTimeInMinutes : 0;
    document.getElementById('ringTime').value = bellTimeInMinutes;
  });
}

function initVolumeUi() {
  chrome.storage.sync.get('volume', function(item) {
    if(item.volume != 0 && (!item || !item.volume)) {
      return;
    }
    const volumeValue = item.volume * 100
    document.getElementById('volume').value = volumeValue;
  });
}

initUi();