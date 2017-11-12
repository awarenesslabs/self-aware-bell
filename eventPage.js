'use strict';

chrome.runtime.onInstalled.addListener(function(){
  console.log('i will run once!');

  // Check if chrome is active
  chrome.windows.onFocusChanged.addListener(function(window) {
    if (window == chrome.windows.WINDOW_ID_NONE) {
      // TODO: - better to remove the alarms when no focus
      chrome.storage.sync.set({isFocused: false});
    } else {
      chrome.storage.sync.set({isFocused: true});
    }
  });
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
    });
  
    checkIfShouldRingBell();
  })
});

// TODO: match all facebook url - regex
function isDistractingUrl(url) {
  return (url === 'https://www.facebook.com/');
}

function checkIfShouldRingBell() {
  chrome.storage.sync.get(['timeSinceStarted', 'bellTimeInMinutes'], function(item) {
    if(item.timeSinceStarted <= 0) {
      return;
    }
    // TODO:
    console.log(item.timeSinceStarted + ' >= ' + item.bellTimeInMinutes);
    if(item.timeSinceStarted >= item.bellTimeInMinutes) {
      playBell();
      // TODO: not resetting here
      restartBell();
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
  console.log('Breath in')
  const audio = new Audio('bell.mp3');
  audio.play();
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
