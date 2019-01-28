var timers_converted = false;
var lastmin = 0;
var lasthour = 0;
var lastday = 0;
var start_date			= new Date; 				// get script start client date
var start_date_ms		= start_date.getTime();		// get script start client date milisecounds

var diff_last			= 0; 						// To check if time (seconds) have changed

var clientDate_format	= 0; 						// Date format, 0 = "20 Jan 2010", 1 = "Jan 20 2010", 2 = "2010-01-20"

var display_animated_server_time	= true;
var display_local_time				= true;
var display_end_time				= true;
var first_display					= true;

var label_today		= "Today";
var label_tomorrow	= "Tomorrow";
var dayNames		= new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
var monthNames		= new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

var refresh_page			= "";
var is_refreshing_page		= false;
var max_timer_to_refresh	= Number.MAX_VALUE;

// return number of days between 2 dates
function days_between(date1, date2) {
	var date1_day = new Date(date1.getTime());
	var date2_day = new Date(date2.getTime());

	// Reset hours to don't take in care hours diference
	date1_day.setHours(0, 0, 0, 0);
	date2_day.setHours(0, 0, 0, 0);

	// The number of milliseconds in one day
	var ONE_DAY = 1000 * 60 * 60 * 24;

	// Convert both dates to milliseconds
	var date1_day_ms = date1_day.getTime();
	var date2_day_ms = date2_day.getTime();

	// Calculate the difference in milliseconds
	var difference_ms = Math.abs(date1_day_ms - date2_day_ms);

	// Convert back to days and return
	var days = Math.round(difference_ms / ONE_DAY);

	return days;
}

// format date1 // shortDate = format with short date
function putDateTime(date1, shortDate) {
	var output = '';

	// FORMAT DATE ===»
	// separate date values
	var dayWeek = date1.getDay();
	var dayMonth = date1.getDate();
	var month = date1.getMonth();
	var year = date1.getYear(); if (year < 1000) { year += 1900 }

	// check if is abbreviated date format
	if (shortDate == true) {

		// get todays date
		var date2 = new Date();

		// get difference between dates
		var diff = days_between(date2, date1);

		// output diff abreviated dates
			// use month name & check whats the client date format
			if (clientDate_format == 0) {
				output += dayMonth + ' ' + monthNames[month]; // example: 2 Sep
			} else {
				output += monthNames[month] + ' ' + dayMonth; // example: Sep 2
			}

		// tag between: example 2 Sep @ 12:30:00
		output += ' @ ';

		// or check if is long date format
	} else {
		// check whats the client date format
		if (clientDate_format == 2) {
			month++; // convert to 1-12 month number
			output += year + '-' + (month < 10 ? '0' : '') + month + '-' + (dayMonth < 10 ? '0' : '') + dayMonth + ' '; // example: 2010-09-03
		} else if (clientDate_format == 0) {
			output += dayMonth + ' ' + monthNames[month] + ' ' + year + ', '; 										// example: 3 Sep 2010
		} else if (clientDate_format == 1) {
			output += monthNames[month] + ' ' + dayMonth + ' ' + ' ' + year + ', '; 									// example: Sep 3 2010
		}
	}

	// FORMAT TIME ===»
	var h = date1.getHours();
	var m = date1.getMinutes();
	var s = date1.getSeconds();
	//var ms = date1.getMilliseconds();
	output += (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s; // example 13:32:50

	// OUTPUT ===»
	return output;
}

// updates server time and client time
function header_timer() {
	var elem = ""; 							// html element to update

	var now_date = new Date; 				// get now date
	var now_date_ms = now_date.getTime();

	// server time
	if (display_animated_server_time) {
		elem = document.getElementById('server-time'); // html element to update

		var server_date = new Date(elem.title); // retrieve server time from html title element (2010/01/01 01:01:01)
		var server_date_ms = server_date.getTime();

		var actual_server_date_ms = server_date_ms + (now_date_ms - start_date_ms );

		elem.innerHTML = putDateTime(new Date(actual_server_date_ms), false);
	}

	// client time
	if (display_local_time) {
		elem = document.getElementById('local-time'); // html element to update

		elem.innerHTML = putDateTime(now_date, false);
	}
	timers();
}

// function timers
var timerFormat = 2; 	// timer format: 0 = h:m:s , 1 = h:m:s - end, 2 = h:m:s <br> end

function timers() {     // updates timers to include durations and end dates

/**
  var now_date = new Date;        // get now date
  var now_date_ms = now_date.getTime();
  var n = 1;
  var sec_min = 0;
  elem = document.getElementById('server-time'); // html element to update
  var server_date = new Date(elem.title); // retrieve server time from html title element (2010/01/01 01:01:01)
  var now = server_date.getTime();        // get now date
  var server_date_ms = server_date.getTime();
  var diff = (now_date_ms - start_date_ms) / 1000;    // get difference seconds between dates

  if (first_display==false)
    if (diff == diff_last) return;        // avoid update 2x in same second

  if (first_display==true)
    first_display=false;

  if ((diff-diff_last)>59*60) {         // Client clock change 1 hour (Day light saving)
    start_date_ms = start_date_ms + 60*60*1000;
    header_timer()
    return;
  }

  if ((diff-diff_last)<-59*60) {          // Client clock change 1 hour (Day light saving)
    start_date_ms = start_date_ms - 60*60*1000;
    header_timer()
    return;
  }

  diff_last = diff;

  while (document.getElementById('timer' + n)) {
    var elem = document.getElementById('timer' + n); // html element to update

    var sec_to_end = elem.title - diff;         // get duration time from html title element
 
    if (document.getElementById('prod_time_' + n)) {  // used only in empire/production page
      sec_min = Number(document.getElementById('prod_time_' + n).title)
      if (sec_to_end < sec_min) sec_to_end = sec_min;
    }

    // if there's a difference
    if (sec_to_end >= 1) {
      // set duration time
      var h = Math.floor(sec_to_end / 3600);
      var m = Math.floor((sec_to_end % 3600) / 60);
      var s = Math.floor((sec_to_end % 60));
      elem.innerHTML = h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;

      // set end date
        if (timerFormat == 1) {
          var end_date_ms = server_date_ms + (elem.title * 1000);
          //console.log('server_date_ms1: ' + server_date_ms);
         // console.log('end_date_ms1: ' + end_date_ms);
          elem.innerHTML += ' - ' + '<span class="comment help">' + putDateTime(new Date(end_date_ms), true) + '</span>';
        }
        if (timerFormat == 2) {
          var end_date_ms = server_date_ms + (elem.title * 1000);
          //console.log('server_date_ms2: ' + server_date_ms);
          //console.log('end_date_ms2: ' + end_date_ms);
          elem.innerHTML += '<br />' + '<span class="comment">' + putDateTime(new Date(end_date_ms), true) + '</span>';
        }

      // or if not
    } else {
      elem.innerHTML = '-';
      if (refresh_page!="" && diff<2*60*60 && !is_refreshing_page) {
        if (max_timer_to_refresh>=n)
        {
          is_refreshing_page=true;
          setTimeout(function(){window.location.href=refresh_page;}, 1000);
        }
      }
    }

    n++;
  }
**/
	var show_changes = true;
	var n = 1;
	var sec_min = 0;
	var elem
	var now = (new Date).getTime();						// get now date
	var diff = (now - start_date_ms) / 1000;			// get difference milliseconds between dates
	
	if (!timers_converted) convert_timers();
	
	if (diff < 30) show_changes = true;
	else if (window.isActive && (typeof window.isActive === "function")) {
		if (!window.isActive()) show_changes = false;
	}

	update_timers('timersec',show_changes);
	if ((diff < 5) || (diff - lastmin) > 30) { // every minute 
		lastmin = diff;
		update_timers('timermin',show_changes);
		update_timers('timerdone',false);
	}
	if ((diff < 5) || (diff - lasthour) > 600) { lasthour = diff; update_timers('timerhour',show_changes); } // every 10mins
	if ((diff < 5) || (diff - lastday) > 3600) { lastday = diff; update_timers('timerday',show_changes); } // every hour
}

function update_timer_after_ajax(element_name) {			// add seconds to timer to compensate ajax have loaded later regaring page time
	var elem = document.getElementById(element_name);
	var timer = 0;

	timer = parseInt(elem.title);

	var now = (new Date).getTime(); 				// get now date
	var diff = (now - start_date_ms) / 1000; 		// get difference milliseconds between dates

	timer = timer +Math.round(diff);

	elem.title = timer;
	//alert(timer);			//oops
}

function update_timers() {			// force update timers for example after insert html by javascript
	first_display=true;
	timers();
}

// CLOCK/TIMERS 2.1 ----------------------------------------------------------------------------------------------

var format, mainTimeoutID;
function timersDisplay_update() {
	$(".timer").each(function (a, b) {
		if ($(b).attr("customval2") == "fake") {
			var c = $(b).attr("customval");
			//var d = $(c).attr("customval");
			$(b).html(timersDisplay_convert_timer($("#" + c).attr("customval")));
		} else {
			//$(b).children("span").html(convert_timer($(b).children("input")[0].value))
			//$(b).children("span").html(convert_timer($(b).attr("customval")))
			$(b).html(timersDisplay_convert_timer($(b).attr("customval")));
		}
	});
	$(".clock").each(function (a, b) {
		$(b).children("span").html(timersDisplay_convert_clock($(b).children("input")[0].value));
	})
}
function timersDisplay_on_interval() {
	mainTimeoutID = setTimeout(timersDisplay_on_interval, 1000);
	$(".timer").each(function (b, d) {
		if ($(d).attr("customval2") == "fake") {
		} else {
			//var a = $(d).children("input")[0], c = parseInt(a.value);
			var a = $(d).attr("customval"), c = parseInt(a);
			//if (c > 0) { a.value = c - 1 } else { if (c == 0) { a.value = -1; /*location.href = location.href; return*/ } }
			if (c > 0) { $(d).attr('customval', c - 1); } else { if (c == 0) { $(d).attr('customval', -1); } }
		}
	});
	$(".clock").each(function (b, c) {
		var a = $(c).children("input")[0]; a.value = parseInt(a.value) + 1
	});
	timersDisplay_update();
}
function timersDisplay_convert_timer(d) {
/**	if (d < 0) {
		d = 0
		return "---"
	} else {
		var c = Math.floor(d / 3600), a = Math.floor(d / 60) % 60, b = d % 60;
		//return (c < 10 ? "0" + c : c) + ":" + (a < 10 ? "0" + a : a) + ":" + (b < 10 ? "0" + b : b)
		return c + ":" + (a < 10 ? "0" + a : a) + ":" + (b < 10 ? "0" + b : b)
	}
**/
}

function timersDisplay_convert_clock(f) {
	var d = Math.floor(f / 3600) % 24, c = d <= 12 ? d : d - 12, e = d < 12 ? "AM" : "PM", a = Math.floor(f / 60) % 60, b = f % 60; a = a < 10 ? "0" + a : a; b = b < 10 ? "0" + b : b;
	switch (format) {
		case 1:
		case 3:
			return c + ":" + a + ":" + b + " " + e;
		case 2:
		case 4:
			return d + ":" + a + ":" + b
	}
	return null
}
function timersDisplay() {
	//display(); mainTimeoutID = setTimeout(on_interval, 1000);
	timersDisplay_on_interval();
}

function new_t() {
	var now = (new Date).getTime();
	diff = (now - start_date) / 1000;

	if (!timers_converted) convert_timers();

	update_timers('timersec');
	if ((diff < 30) || (diff - lastmin) > 30) { lastmin = diff; update_timers('timermin'); } // every minute 
	if ((diff < 30) || (diff - lasthour) > 600) { lasthour = diff; update_timers('timerhour'); } // every 10mins
	if ((diff < 30) || (diff - lastday) > 3600) { lastday = diff; update_timers('timerday'); } // every hour
	// timer classes
	// timersec == 0s to 5m, updates every tick (200ms?)
	// timermin == 5m to 1h, updates every 30 seconds (worst case, last tick at 0:00:30)
	// timerhour == 1h to 24h, updates every 10 minutes
	// timerday == 24h+, updates every 1 hour
}
function new_timers() {			// updates timers to include durations and end dates
	var show_changes = true;
	var n = 1;
	var sec_min = 0;
	var elem
	var now = (new Date).getTime();						// get now date
	var diff = (now - start_date_ms) / 1000;			// get difference milliseconds between dates
	
	if (!timers_converted) convert_timers();
	
	if (diff < 30) show_changes = true;
	else if (window.isActive && (typeof window.isActive === "function")) {
		if (!window.isActive()) show_changes = false;
	}

	update_timers('timersec',show_changes);
	if ((diff < 5) || (diff - lastmin) > 30) { // every minute 
		lastmin = diff;
		update_timers('timermin',show_changes);
		update_timers('timerdone',false);
	}
	if ((diff < 5) || (diff - lasthour) > 600) { lasthour = diff; update_timers('timerhour',show_changes); } // every 10mins
	if ((diff < 5) || (diff - lastday) > 3600) { lastday = diff; update_timers('timerday',show_changes); } // every hour
}
function update_timers (class_name,show_changes) {
	var beeped = 0;
	var timers = document.getElementsByClassName(class_name);
	if (timers.length == 0) return;
	var now = (new Date).getTime();
	var diff = (now - start_date) / 1000;
	var sec_to_end;
	var elem,m,h,s,n;
	var elem2;

	for(n=0; n<timers.length; n++) {
		elem = timers[n];
		sec_to_end = elem.title - diff;

		if (document.getElementById('prod_time_' + n)) {
			sec_min = Number( document.getElementById('prod_time_'+n).title);
			if (sec_to_end < sec_min ) sec_to_end = sec_min;
		}

		m = 0;
		h = 0;
		function change_class(old,new_class) {
			if (old == new_class) return;
			elem.className = elem.className.replace(old,new_class);
			window.dump('changing class from '+old+' to '+new_class+' for timer '+elem.id+'\n');
		}
		if (sec_to_end >= 1) {
			h = Math.floor(sec_to_end/3600);
			m = Math.floor( (sec_to_end % 3600)/60 );
			s = Math.floor( (sec_to_end %60) );
			if (show_changes) {
				elem.textContent = h+':'+(m<10?'0':'')+m+':'+(s<10?'0':'')+s;
				if (display_end_time) {
					elem2 = document.getElementById('server-time'); // html element to update
					var server_date = new Date(elem2.title); // retrieve server time from html title element (2010/01/01 01:01:01)
					var server_date_ms = server_date.getTime();
					var end_date_ms = server_date_ms + (elem.title * 1000);
					var end_time = putDateTime(new Date(end_date_ms), true);
					if (timerFormat==1) {
						elem.innerHTML += ' - <span class="comment help">' + end_time + '</span>';
					}
					if (timerFormat==2) {
						elem.innerHTML += '<br /><span class="comment help">' + end_time + '</span>';
					}
				}
			}
		} else {
			elem.textContent = 'DONE';
			change_class(class_name,'timerdone');
		}
		// downgrade timers (speed them up)
		if ((class_name == 'timerday') && (h < 24)) change_class('timerday','timerhour');
		if ((class_name == 'timerhour') && (h == 0)) change_class('timerhour','timermin');
		if ((class_name == 'timermin') && (sec_to_end < (5 * 60))) change_class('timermin','timersec');

		// upgrade timers (slow them down)
		if ((class_name == 'timersec') && (sec_to_end > (5 * 60))) change_class('timersec','timermin');
		if ((class_name == 'timermin') && (sec_to_end > 3600)) change_class('timermin','timerhour');
		if ((class_name == 'timerhour') && (sec_to_end > (24 * 3600))) change_class('timerhour','timerday');

		if (sec_to_end < beep_limit) {
			if (beeped == 0) {
				var ev = document.createEvent('Events');
				ev.initEvent('timer_done', true, false);
				if (document.title.indexOf('beep') == -1) {
					document.title = 'beep! ' + document.title;
				}
				elem.dispatchEvent(ev);
				beeped = 1;
			}
		}
	}
}

function convert_timers() {
	timers_converted = true;
	lastday = lasthour = lastmin = 0;
	var elem;
	var n = 1;

	while (elem = document.getElementById('timer'+n)) {
		var now = Date.now();
		var diff = (now - start_date) / 1000;
		var s = elem.title - diff;
		var class_name = 'timersec';
		if (s > (3600*24)) class_name = 'timerday';
		else if (s > 3600) class_name = 'timerhour';
		else if (s > (60*5)) class_name = 'timermin';

		//elem.setUserData('original_class',elem.className,null);
		elem.className = elem.className + ' timer ' + class_name;
		n++;
	}
	update_timers('timerday');
}

$(document).ready(function () {
	timersDisplay();
	convert_timers();
});


