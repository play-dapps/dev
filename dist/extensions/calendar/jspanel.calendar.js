/* jspanel.calendar.js v0.1.0 (c) Stefan Sträßer(Flyer53) <info@jspanel.de> license: MIT */

/* dependencies: moment.js - http://momentjs.com/ */

/* global jsPanel, module, moment */
'use strict'; //import {jsPanel} from '../../jspanel.js';

if (!jsPanel.calendar) {
  jsPanel.calendar = {
    version: '0.1.0',
    date: '2019-06-06 18:30',
    defaults: {
      locale: 'de',
      months: 1,
      showWeekNumbers: true,
      ondateselect: undefined
    },
    keyValue: undefined,
    weekcount: [6, 10, 14],
    // number of weeks in calendar for 1, 2 or 3 months
    daycount: [43, 71, 99],
    // number of days in calendar for 1, 2 or 3 months
    generateHTML: function generateHTML(options) {
      var wrapper = document.createElement('div');
      wrapper.className = 'jsPanel-cal-wrapper';
      wrapper.innerHTML = "<div class=\"jsPanel-cal-sub jsPanel-cal-blank1\"></div>\n                <div class=\"jsPanel-cal-sub jsPanel-cal-back\">&#9204;</div>\n                <div class=\"jsPanel-cal-sub jsPanel-cal-month\"></div>\n                <div class=\"jsPanel-cal-sub jsPanel-cal-forward\">&#9205;</div>\n                <div class=\"jsPanel-cal-sub jsPanel-cal-reset\">&#8634;</div>\n                <div class=\"jsPanel-cal-sub jsPanel-cal-blank3\"></div>";

      for (var i = 0; i < 7; i++) {
        wrapper.innerHTML += "<div class=\"jsPanel-cal-sub day-name day-name-".concat(i, "\"></div>");
      }

      for (var _i = 0; _i < this.weekcount[options.months - 1]; _i++) {
        wrapper.innerHTML += "<div class=\"jsPanel-cal-sub week week-".concat(_i, "\"></div>");
      }

      for (var _i2 = 1; _i2 < this.daycount[options.months - 1]; _i2++) {
        wrapper.innerHTML += "<div class=\"jsPanel-cal-sub day day-".concat(_i2, "\"></div>");
      }

      return wrapper;
    },
    unselectAllDays: function unselectAllDays(wrapper) {
      var days = wrapper.querySelectorAll('.jsPanel-cal-sub.day');
      days.forEach(function (day) {
        day.classList.remove('selected');
      });
    },
    create: function create(container) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var opts = options;

      if (options.config) {
        opts = Object.assign({}, options.config, options);
        delete opts.config;
      }

      opts = Object.assign({}, this.defaults, opts); // opts months must be in range 1 - 3

      if (opts.months < 1 || opts.months > 3) {
        opts.months = 1;
      } // method to fill the calendar with data


      container.fill = function (date) {
        var now = date || moment(); // returns 2019-06-01T09:44:14.083Z

        now.locale(opts.locale);
        var month = now.month(),
            // returns number 0 to 11 where 0 is January
        firstDay = now.date(1).weekday(),
            // returns locale aware number 0 to 6 where 0 is either Sunday or Monday
        localeData = now.localeData(); // fill selected month incl. year

        var monthBox = container.querySelector('.jsPanel-cal-month');
        monthBox.innerHTML = now.format('MMMM YYYY');
        monthBox.dataset.date = now.format('YYYY-MM-DD'); // fill day names (Mo, Tu, etc.) considering used locale

        var dayNames = container.querySelectorAll('.jsPanel-cal-sub.day-name'),
            weekdays = localeData.weekdaysMin();

        if (localeData.firstDayOfWeek() === 1) {
          // week starts with Monday
          for (var i = 0, j = 1; i < 7; i++, j++) {
            dayNames[i].textContent = weekdays[j];
          }

          dayNames[6].textContent = weekdays[0];
          dayNames[5].classList.add('weekend');
          dayNames[6].classList.add('weekend');
        } else {
          for (var _i3 = 0; _i3 < 7; _i3++) {
            dayNames[_i3].textContent = weekdays[_i3];
          }

          dayNames[0].classList.add('weekend');
          dayNames[6].classList.add('weekend');
        } // fill dates


        var firstEntry = now.subtract(++firstDay, 'days');
        var days = container.querySelectorAll('.jsPanel-cal-sub.day');
        days.forEach(function (day) {
          day.classList.remove('today', 'notInMonth');
          var value = firstEntry.add(1, 'days');
          day.textContent = value.format('D');
          day.dataset.date = now.format('YYYY-MM-DD');

          if (value.month() !== month) {
            day.classList.add('notInMonth');
          } else if (day.dataset.date === moment().format('YYYY-MM-DD')) {
            day.classList.add('today');
          }
        }); // fill week numbers

        if (opts.showWeekNumbers) {
          container.querySelectorAll('.jsPanel-cal-sub.week').forEach(function (week, index) {
            week.textContent = moment(container.querySelector(".jsPanel-cal-sub.day-".concat((index + 1) * 7)).dataset.date).week();
          });
        } else {
          container.querySelector('.jsPanel-cal-wrapper').style.gridTemplateColumns = '0fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr';
        }
      }; // load calendar HTML and fill it


      var wrapper = this.generateHTML(opts);
      wrapper.classList.add("month-count-".concat(opts.months));
      container.append(wrapper);
      container.fill(); // handler to go back one month

      var month = container.querySelector('.jsPanel-cal-sub.jsPanel-cal-month');
      jsPanel.pointerdown.forEach(function (evt) {
        container.querySelector('.jsPanel-cal-sub.jsPanel-cal-back').addEventListener(evt, function (e) {
          e.preventDefault();
          var count = jsPanel.calendar.keyValue || 1;
          container.fill(moment(month.dataset.date).subtract(count, 'months'));
        }, false);
      }); // handler to go forward one month

      jsPanel.pointerdown.forEach(function (evt) {
        container.querySelector('.jsPanel-cal-sub.jsPanel-cal-forward').addEventListener(evt, function (e) {
          e.preventDefault();
          var count = jsPanel.calendar.keyValue || 1;
          container.fill(moment(month.dataset.date).add(count, 'months'));
        }, false);
      }); // handler to reset to current month

      jsPanel.pointerdown.forEach(function (evt) {
        container.querySelector('.jsPanel-cal-sub.jsPanel-cal-reset').addEventListener(evt, function (e) {
          e.preventDefault();
          container.fill(moment());
        }, false);
      }); // handler for click on a single day

      jsPanel.pointerdown.forEach(function (evt) {
        wrapper.addEventListener(evt, function (e) {
          var target = e.target,
              altKey = e.altKey,
              ctrlKey = e.ctrlKey,
              shiftKey = e.shiftKey;
          e.preventDefault();

          if (target.classList.contains('day')) {
            var date = target.dataset.date; // date of clicked day
            // if a day is clicked and no modifier key is active

            if (!ctrlKey && !shiftKey && !altKey) {
              // unselect all selected days
              jsPanel.calendar.unselectAllDays(wrapper);
            } // custom callback


            if (opts.ondateselect && typeof opts.ondateselect === 'function') {
              var arg = moment(date);
              opts.ondateselect.call(arg, arg, e);
            }
          }
        }, false);
      });
      return container;
    }
  }; // jsPanel.calendar.keyValue is set to the value of the pressed key while key is down and if key's value is between 1 and 9

  document.addEventListener('keydown', function (e) {
    if (e.key.match(/^[2-9]$/)) {
      jsPanel.calendar.keyValue = e.key;
    } else if (e.key.match(/^1$/)) {
      jsPanel.calendar.keyValue = 12;
    }
  });
  document.addEventListener('keyup', function () {
    jsPanel.calendar.keyValue = undefined;
  });
} // Add CommonJS module exports, so it can be imported using require() in Node.js
// https://nodejs.org/docs/latest/api/modules.html


if (typeof module !== 'undefined') {
  module.exports = jsPanel;
}