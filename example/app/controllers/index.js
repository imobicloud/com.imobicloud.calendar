var moment = require('moment');

init();
function init() {
	$.vCalendar.init();
  	$.index.open();
}

function calendarChange(e) {
  	if (e.type == 'month') {
  		$.lMonth.text = e.date.format("MM-YYYY");
  		$.btnPrev.title = moment(e.date).subtract(1, 'months').format("MMM");
  		$.btnNext.title = moment(e.date).add(1, 'months').format("MMM");
  	} else if (e.type == 'selected') {
  		alert('Select ' + e.date.format("DD-MM-YYYY"));
  	}
}

function prevMonth(e) {
  	$.vCalendar.previous();
}

function nextMonth(e) {
  	$.vCalendar.next();
}

// Advanced 

function getDate(e) {
  	this.title = 'Get month - ' + $.vCalendar.get().format("DD-MM-YYYY");
}

function setDate(e) {
  	$.vCalendar.set( new Date(1986, 1, 20, 0, 0, 0, 0) );
}

function customStyle() {
	$.vCalendar.unload();
	
	$.vCalendar.init({
		dateFormatter: dateFormatter,
		weekFormatter: weekFormatter
	});
};

/*
 params = {
    column: 0, // from 0 to 6
   	weekText: "Sun"
 } 
 * */
function weekFormatter(params) {
  	var vDate = $.UI.create('View', { classes: 'calendar-week calendar-week-' + params.column });
		vDate.add( $.UI.create('Label', { text: params.weekText, classes: 'calendar-week-label calendar-week-label-' + params.column }) );
	return vDate;
}

/*
 params = {
 	index: 0,  // from 0 to 41, 41 dates of a month view, row = Math.floor(params.index / 7)
 	column: 0, // from 0 to 6
 	dateId: "2015-04-23T00:00:00+07:00", // iso string with timezone
 	dateText: 31,
 	isThisMonth: true,
 	isToday: false
 } 
 * */
function dateFormatter(params) {
  	var  viewClasses = ['calendar-date'],
		labelClasses = ['calendar-date-label'];
	
	if (params.isThisMonth) {
		if (params.isToday) {
			viewClasses.push('calendar-today');
  			labelClasses.push('calendar-today-label');
		}
	} else {
	 	viewClasses.push('calendar-disabled');
		labelClasses.push('calendar-disabled-label');
	}
	
	viewClasses.push('calendar-date-' + params.column);
	labelClasses.push('calendar-date-label-' + params.column);
	
	var vDate = $.UI.create('View', { date: params.dateId, classes: viewClasses.join(' ') });
   		vDate.add( $.UI.create('Label', { text: params.dateText, classes: labelClasses.join(' ') }) );
		
		if (params.dateText == 14) {
			var vEvents = $.UI.create('View', { classes: 'calendar-events' });
			vEvents.add( $.UI.create('View', { classes: 'calendar-event calendar-event-yellow' }) );
			vEvents.add( $.UI.create('View', { classes: 'calendar-event calendar-event-blue' }) );
			vEvents.add( $.UI.create('View', { classes: 'calendar-event calendar-event-red' }) );
			vDate.add(vEvents);
		}
		
	return vDate;
}