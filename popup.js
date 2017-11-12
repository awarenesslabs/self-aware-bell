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

function clearAlarm() {
  chrome.browserAction.setBadgeText({text: ''});
  chrome.alarms.clearAll();
  chrome.storage.sync.set({bellTimeInMinutes: 0});
  window.close();
}

document.getElementById('ringTime').addEventListener('change', setAlarm);
document.getElementById('cancelAlarm').addEventListener('click', clearAlarm);

chrome.storage.sync.get('bellTimeInMinutes', function(item) {
  if(!item || !item.bellTimeInMinutes) {
    return;
  }
  document.getElementById('ringTime').value = item.bellTimeInMinutes;
});