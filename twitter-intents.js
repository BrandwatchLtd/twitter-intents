/* Acts as a minimal replacement for the Twitter Intents library by opening
 * Twitter intents found on the page in a popup window. This is achieved
 * by binding an event handler to a parent element and listening for click
 * events.
 *
 * Usage
 *
 *   // By default it listens to clicks on the document in the current window.
 *   var intents = new TwitterIntents();
 *   intents.register();
 *
 *   // You can pass a specific element and window into the function.
 *   var intents = new TwitterIntents(document.body, window);
 *
 *   // To remove the event handlers call .unregister().
 *   intents.unregister();
 *
 * The original source for this function is provided by Twitter. It has been
 * updated here to work with AMD module loaders and with teardown support.
 * See: http://dev.twitter.com/docs/intents
 */
(function (context) {
  'use strict';

  var intentRegex = /twitter\.com(\:\d{2,4})?\/intent\/(\w+)/,
      width = 550,
      height = 420;

  function openWindow(url, window) {
    var screenTop = window.screenTop,
        screenLeft = window.screenLeft,
        windowWidth = window.outerWidth || window.document.documentElement.offsetWidth,
        windowHeight = window.outerHeight || window.document.documentElement.offsetHeight,
        windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
        left = screenLeft, top = screenTop;

    left += Math.round((windowWidth / 2) - (width / 2));
    if (windowHeight > height) {
      top += Math.round((windowHeight / 2) - (height / 2));
    }

    window.open(url, 'intent', windowOptions + ',width=' + width + ',height=' + height + ',left=' + left + ',top=' + top);
  }

  function TwitterIntents(root, window) {
    var isRegistered = false;

    window = window || context.window;
    root = root || window.document;

    function handleIntent(event) {
      var target = event.target || event.srcElement,
          match;

      while (target && target.nodeName.toLowerCase() !== 'a') {
        target = target.parentNode;
      }

      if (target && target.nodeName.toLowerCase() === 'a' && target.href) {
        match = target.href.match(intentRegex);
        if (match) {
          openWindow(target.href, window);
          event.returnValue = false;
          event.preventDefault && event.preventDefault();
        }
      }
    }

    this.register = function () {
      if (isRegistered) { return; }

      if (root.addEventListener) {
        root.addEventListener('click', handleIntent, false);
      } else if (root.attachEvent) {
        root.attachEvent('onclick', handleIntent);
      }

      isRegistered = true;
      return this;
    };

    this.unregister = function () {
      if (!isRegistered) { return; }

      if (root.removeEventListener) {
        root.removeEventListener('click', handleIntent, false);
      } else if (root.detachEvent) {
        root.detachEvent('onclick', handleIntent);
      }

      isRegistered = false;
      return this;
    };
  }

  if (typeof context.define === 'function' && context.define.amd) {
    context.define('twitter-intents', function () {
      return TwitterIntents;
    });
  } else if (context.exports) {
    context.exports = TwitterIntents;
  } else {
    context.TwitterIntents = TwitterIntents;
  }
})(typeof this.module === 'object' ? this.module : this);
