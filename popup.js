'use strict';

var bellCheckEvery = 0.1; //Every 10 seconds

function setAlarm(event) {
  let minutes = parseFloat(event.target.value);
  chrome.browserAction.setBadgeText({text: ' '});
  chrome.storage.sync.set({bellTimeInMinutes: minutes});
  chrome.storage.sync.set({bellCheckEvery: bellCheckEvery});
  chrome.alarms.create({periodInMinutes: bellCheckEvery, delayInMinutes:bellCheckEvery});
  window.close();
}

function clearAlarm() {
  chrome.browserAction.setBadgeText({text: ''});
  chrome.alarms.clearAll();
  window.close();
}

document.getElementById('sampleSecond').addEventListener('click', setAlarm);
document.getElementById('10seconds').addEventListener('click', setAlarm);
document.getElementById('1min').addEventListener('click', setAlarm);
document.getElementById('5min').addEventListener('click', setAlarm);
document.getElementById('15min').addEventListener('click', setAlarm);
document.getElementById('cancelAlarm').addEventListener('click', clearAlarm);
