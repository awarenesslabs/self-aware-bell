'use strict';

chrome.runtime.onInstalled.addListener(function(){

});

// Check if chrome is active
chrome.windows.onFocusChanged.addListener(function(window) {
  if (window == chrome.windows.WINDOW_ID_NONE) {
    // TODO: - better to remove the alarms when no focus
    chrome.storage.sync.set({isFocused: false});
    restartBell();
  } else {
    chrome.storage.sync.set({isFocused: true});
  }
});

chrome.alarms.onAlarm.addListener(function() {
  chrome.storage.sync.get(['isFocused'], function(item) {
    if(!item.isFocused) {
      restartBell();
      return;
    }

    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
      if(!tabs || !tabs[0] || !tabs[0].url) {
        restartBell()
        return;
      }
      
      var url = tabs[0].url;
      
      if (isDistractingUrl(url)) {
        chrome.storage.sync.get(['timeSinceStarted', 'bellTimeInMinutes', 'bellCheckEvery'], function(item) {
          chrome.storage.sync.set({timeSinceStarted: item.timeSinceStarted + item.bellCheckEvery});
        })
      }

    checkIfShouldRingBell();
    });
  })
});

function isDistractingUrl(url) {
  var isFacebook = (/^(https?:\/\/)?((w{3}\.)?)facebook\.com\/*.*/i.test(url));
  var isReddit = (/^(https?:\/\/)?((w{3}\.)?)reddit\.com\/*.*/i.test(url));
  return isFacebook || isReddit;
}

function checkIfShouldRingBell() {
  chrome.storage.sync.get(['timeSinceStarted', 'bellTimeInMinutes'], function(item) {
    if(item.timeSinceStarted <= 0) {
      return;
    }
    if(item.timeSinceStarted >= item.bellTimeInMinutes) {
      restartBell();
      playBell();
    }
  })
}

function restartBell() {
  return chrome.storage.sync.set({timeSinceStarted: 0});
}

chrome.notifications.onButtonClicked.addListener(function() {
  chrome.storage.sync.get(['bellTimeInMinutes'], function(item) {
    chrome.browserAction.setBadgeText({text: ' '});
    chrome.alarms.create({periodInMinutes: item.bellTimeInMinutes, delayInMinutes:item.bellTimeInMinutes});
  });
});


function playBell() {
  // TODO: perhaps a better way is to hold it globally and not initialize it every time
  const audio = new Audio('bell.mp3');
  chrome.storage.sync.get(['volume'], function(item) {
    if(item.volume) {
      audio.volume = item.volume
    }
    audio.play();
  })
}

function notify() {
  chrome.notifications.create({
    type:     'basic',
    iconUrl:  'icon.png',
    title:    'Breath in',
    message:  'Breath In. Breath Out',
    buttons: [
      {title: 'Breathing...'}
    ],
    priority: 0});
}
