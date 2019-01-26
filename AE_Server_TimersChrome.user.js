// ==UserScript==
// @name                AE Server Timers Chrome Edition
// @namespace           http://www.tampermonkey.net
// @author              Rick / Aetheric
// @description         Replaces local with server times, for chrome!
// @require http://code.jquery.com/jquery-1.7.1.min.js
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
var script=document.createElement('script');
window.addEventListener('load',
  function(event){
script.src='https://cdn.jsdelivr.net/gh/cruentus/aeServerTimers/servertimers6.js';
document.getElementsByTagName('head')[0].appendChild(script);
/**
    var originalScript = event.target;
    console.log('og script:' + originalScript);
    console.log('og script src:' + originalScript.src);
    if(/js_timers_v1\.12\.js/.test(originalScript.src)){
    var replacementScript = document.createElement('script');
    replacementScript.src = 'https://cdn.jsdelivr.net/gh/cruentus/aeServerTimers/servertimers6.js';
    originalScript.parentNode.replaceChild(replacementScript, originalScript);

    changed--;
    }**/
	if(changed == 0) window.removeEventListener(event.type, arguments.callee, true); // If it's done changing shit, stop!
}, true);
