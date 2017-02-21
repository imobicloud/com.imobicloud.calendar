var moment = require('alloy/moment'),
	firstDayOfWeek, // 0: Sunday is the first day of the week. 1: Monday is the first day of the week.
	todayId = moment().startOf('day').format(); // get today's iso string without hours, minutes and seconds

init(arguments[0]);

/*
 args = {
 	date: moment object,
 	weekFormatter: null or function(){}
 	dateFormatter: null or function(){}
 }
 * */
function init(args) {
	firstDayOfWeek = moment.localeData().firstDayOfWeek();

	loadWeek(args.weekFormatter || weekFormatter);
	loadDate(args.date, args.dateFormatter || dateFormatter);
};

// TODO: fix: Click event is not fired
function viewReady() {
	this.removeEventListener('postlayout', viewReady);
}

// Creates the week of day row. Will use the default weekFormatter if you don't pass your own function
function loadWeek(formatter) {
  	var dow = firstDayOfWeek,
  		weekNames = moment.weekdaysShort(),
  		container = $.UI.create('View', { classes: 'imc-calendar-weeks' });

  	for (var i = 0; i < 7; i++) {
		var weekView = formatter({
  			column: i,
  			weekText: weekNames[ dow < 7 ? dow : 0 ]
  		});
		container.add(weekView);
  		dow++;
	};

	// TODO: fix: Click event is not fired
	container.addEventListener('postlayout', viewReady);

	$.calendar.add(container);
}

// Creates the month with six rows. Will use the default dateFormatter if you don't pass your own function
function loadDate(time, formatter) {
	var column      = 0,
		thisMonth   = time.month(),
  		currentDate = time.subtract(firstDayOfWeek === 0 ? time.day() : ( time.day() || 7 ) - 1, 'days'),
  		cancelNextMonth = false;

  	var container = $.UI.create('View', { classes: 'imc-calendar-dates' });

  	for (var i = 0; i < 42; i++) {
  		var dateId = currentDate.format(),
  			isThisMonth = true,
  			isToday = false;

  		if (currentDate.month() == thisMonth) {
  			if (dateId == todayId) {
  				isToday = true;
  			}
  			cancelNextMonth = true;
  		} else  {
  			isThisMonth = false;
  			if (cancelNextMonth && column === 0) {
  				break;
  			}
  		}

		var dateView = formatter({
			index: i,
			column: column,
			dateId: dateId,
			dateText: currentDate.date(),
			isThisMonth: isThisMonth,
 			isToday: isToday
		});
		container.add(dateView);

		currentDate.add(1, 'days');

		if (column < 6) { column++; } else { column = 0; }
	};

	// TODO: fix: Click event is not fired
	container.addEventListener('postlayout', viewReady);

	$.calendar.add(container);
}

/*
 params = {
    column: 0, // from 0 to 6
   	weekText: "Sun"
 }
 * */
// Standard weekFormatter includes a view for wrapper and a label for text
function weekFormatter(params) {
  	var vDate = $.UI.create('View', { classes: 'imc-calendar-week imc-calendar-week-' + params.column });
		vDate.add( $.UI.create('Label', { text: params.weekText, classes: 'imc-calendar-week-label imc-calendar-week-label-' + params.column }) );
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
// Standard dateFormatter includes a view for wrapper and a label for text
// You can differentiate between: days in current month, the current day (today class)
// and days out of the month (disabled class)
function dateFormatter(params) {
  	var  viewClasses = ['imc-calendar-date'],
		labelClasses = ['imc-calendar-date-label'];

	if (params.isThisMonth) {
		if (params.isToday) {
			 viewClasses.push('imc-calendar-today');
  			labelClasses.push('imc-calendar-today-label');
		}
	} else {
		 viewClasses.push('imc-calendar-disabled');
		labelClasses.push('imc-calendar-disabled-label');
	}

	 viewClasses.push('imc-calendar-date-' + params.column);
	labelClasses.push('imc-calendar-date-label-' + params.column);

	var vDate = $.UI.create('View', { date: params.dateId,   classes:  viewClasses.join(' ') });
    vDate.add( $.UI.create('Label', { text: params.dateText, classes: labelClasses.join(' ') }) );

	return vDate;
}
