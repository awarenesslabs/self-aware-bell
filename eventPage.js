'use strict';

chrome.runtime.onInstalled.addListener(function(){
  console.log('i will run once!');
});

chrome.alarms.onAlarm.addListener(function() {
  chrome.browserAction.setBadgeText({text: ''});
  
  const audio = new Audio('bell.mp3');
  audio.play();

  chrome.notifications.create({
      type:     'basic',
      iconUrl:  'icon.png',
      title:    'Breath in',
      message:  'Breath In. Breath Out',
      buttons: [
        {title: 'Breathing...'}
      ],
      priority: 0});
});

chrome.notifications.onButtonClicked.addListener(function() {
  chrome.storage.sync.get(['minutes'], function(item) {
    chrome.browserAction.setBadgeText({text: 'ON'});
    chrome.alarms.create({delayInMinutes: item.minutes});
  });
});
