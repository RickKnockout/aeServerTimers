// ==UserScript==
// @name                AE Server Timers BETA
// @namespace           http://www.tampermonkey.net
// @author              Rick
// @description         Replaces local with server times
// @require http://code.jquery.com/jquery-1.7.1.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @grant GM_addStyle
// @include             http://*.astroempires.com/*
// @exclude             http://*.astroempires.com/
// @exclude             http://*.astroempires.com/home.aspx*
// @exclude             http://*.astroempires.com/login.aspx*
// @exclude             http://*.astroempires.com/profile.aspx?action=*
// @exclude             http://forum.astroempires.com/*
// @exclude             http://support.astroempires.com/*
// @exclude             http://wiki.astroempires.com/*
// @exclude             http://wiki.astroempires.com/*/*
// @exclude             http://*.astroempires.com/upgrade.aspx*
// @exclude             http://*.astroempires.com/tables.aspx*
// @exclude             http://*.astroempires.com/smilies.aspx*
// @run-at document-start
// ==/UserScript==

var changed = 1;

window.addEventListener('beforescriptexecute',
  function(event){
    var originalScript = event.target;
    if(/js_timers_v1\.12\.js/.test(originalScript.src)){ 
    var replacementScript = document.createElement('script');
    replacementScript.src = 'https://cdn.jsdelivr.net/gh/cruentus/aeServerTimers/servertimersBETA6.js';
    originalScript.parentNode.replaceChild(replacementScript, originalScript);
    changed--;
    }
	if(changed == 0) window.removeEventListener(event.type, arguments.callee, true); // If it's done changing shit, stop!
}, true);

if (document.location.href.indexOf('bases_production') == -1) {
	window.t = new_t;
	window.timers = new_timers;
	window.timersDisplay_convert_timer = function (){};
};
