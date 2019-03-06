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
var script=document.createElement('script');
window.addEventListener('load',
  function(event){
script.src='https://cdn.jsdelivr.net/gh/cruentus/aeServerTimers/servertimersChrome.js';
//script.src='https://raw.githubusercontent.com/cruentus/aeServerTimers/beta/servertimersChrome.js';
document.getElementsByTagName('head')[0].appendChild(script);
}, true);
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('.timerdone {background: red !important;}');
addGlobalStyle('.timersec {color: red !important;}');
addGlobalStyle('.timermin {color:#FFAA00 !important;}');
addGlobalStyle('.timerhour {color:#8888FF !important;}');
addGlobalStyle('.timerday {color:#DDDDDD !important;}');
