(function() {
  function addEvent(domElem, eventName, func, useCapture) {
    useCapture = typeof useCapture !== 'undefined' ? useCapture : false;
    domElem.addEventListener(eventName, func, useCapture);
  }

  function setHtmlFontSize() {
    const minSiteWidth = 320,
      maxSiteWidth = 750,
      maxFontSize = 32;
    let windowWidth = window.innerWidth ? window.innerWidth : document.documentElement.offsetWidth;
    windowWidth = Math.min(Math.max(windowWidth, minSiteWidth), maxSiteWidth);

    let fs = windowWidth * maxFontSize / maxSiteWidth;
    let tagHtml = document.getElementsByTagName('html')[0];
    tagHtml.style.cssText = 'font-size: ' + fs + 'px';
    let realfz = (+window.getComputedStyle(tagHtml).fontSize.replace('px', '') * 10000) / 10000;
    console.log(realfz);
    if (fs !== realfz) {
      tagHtml.style.cssText = 'font-size: ' + fs * (fs / realfz) + 'px';
    }
    if (windowWidth >= 430) {
      tagHtml.style.cssText = 'font-size: 16px';
    }
  }

  setHtmlFontSize()
  addEvent(window, 'resize', setHtmlFontSize)
})();
