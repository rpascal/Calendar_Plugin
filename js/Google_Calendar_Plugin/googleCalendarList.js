(function ($) {
    $.fn.googleCalendarList = function (options) {
        var justDate;
        var dateAndTime;
        var eventHeader;
        var fullEvents = false;
        var shortenedEvents = false;
        var maxSize = 10000;
        var eventIDs = [];
        var futureEvents;

        var settings = {
            'key': null,
            'calendarIds': ['hi', 'hola'],
            'fullEventsWithDateSelect': null,
            'shortenedEvents': null,
            'holderName': null,
            'maxSize': null,
            'futureEvent': false,
            'skipCreatingUnorderedList': false
        };
        if (options) { $.extend(settings, options); }
        if ($.isNumeric(settings.maxSize)) { maxSize = settings.maxSize }

        fullEvents = settings.fullEventsWithDateSelect;
        shortenedEvents = settings.shortenedEvents;
        futureEvents = settings.futureEvent;

      var loadJsonsVariable = function loadJsons() {
           // alert('hi');
            $(".upComingEvents").empty();
            $(".recurringEvents").empty();
            for (i = 0; i < settings.calendarIds.length ; i++) {
                var json = "https://www.googleapis.com/calendar/v3/calendars/" + settings.calendarIds[i] + "/events?key=" + settings.key + "&alt=json";
                addEvents(json);
            }
        }
        if (fullEvents && !settings.skipCreatingUnorderedList) {
            createFullDisplayedUnorderedList(settings.holderName);
            createControls(loadJsonsVariable);
        } else if (shortenedEvents && !settings.skipCreatingUnorderedList) {
            createShortDisplayedUnoderedList(settings.holderName);
        loadJsonsVariable();
        }


        function addEvents(json) {
            $.ajax({
                url: json,
                dataType: 'json',
                type: 'get',
                cache: 'false',
                success: function (data) {
                    $(data.items).each(function (index, item) {
                        
                        justDate = false;
                        dateAndTime = false;
                        eventHeader = "<a target='_blank' href='" + item.htmlLink + "'>" + item.summary + "</a>";
                        eventIDs.push(item.id);
                        if (item.status != "cancelled") {
                            var recurring = item.recurrence != null ? true : false;
                            if (recurring && ($(".recurringEvents").children().length < maxSize)) {
                                appendToScreen(".recurringEvents", getRecurringEventContentText(item), item.id);
                            } else if (!recurring && ($(".upComingEvents").children().length < maxSize)) {
                                if (!(futureEvents && oldDate(getEventDate(item.start, false)))) {
                                    if (fullEvents) {
                                        createFullEvents(item);
                                        //  alert('here');
                                    } else if (shortenedEvents) {
                                        createShortenedEvents(item);
                                    }

                                    sort();
                                }
                            } else {
                                for (var i = 0; i < eventIDs.length; i++) {
                                    if (eventIDs[i] == item.recurringEventId) {
                                        $('#' + item.recurringEventId).remove();
                                    }

                                }
                            }
                        }
                    });
                }
            });

        }

        function sort() {
            $('.upComingEvents > li').sort(sortDate).appendTo('.upComingEvents');
        }

        function createShortDisplayedUnoderedList(holderName) {
            $(holderName).append("<ul class='nav nav-pills nav-justified eventTabs' role='tablist' id='eventTabs'>" +
                     " <li role='presentation' class='active'><a href='#upcomingEventsTab' aria-controls='upcomingEventsTab' role='tab' data-toggle='tab'> " +
                        "  <h3 class='noTopMargin'>Upcoming Events</h3>" +
                     " </a></li>" +
                     " <li role='presentation'><a href='#recurringEventsTab' aria-controls='recurringEventsTab' role='tab' data-toggle='tab'>" +
                     "     <h3 class='noTopMargin'>Recurring Events</h3>" +
                    "  </a></li>" +
                 " </ul>" +

                 " <div class='tab-content'>" +
                  "    <div role='tabpanel' class='tab-pane active' id='upcomingEventsTab'>" +
                  "        <ul class='upComingEvents customUnorderedList'>" +
                   "       </ul>" +
                    "  </div>" +
                     " <div role='tabpanel' class='tab-pane' id='recurringEventsTab'>" +
                      "     <ul class='recurringEvents customUnorderedList'>" +
                       "   </ul>" +
            "</div>" +
            "     </div>"

                 );
        }
        function createFullDisplayedUnorderedList(holderName) {
                 $(holderName).append("<ul class='nav nav-pills nav-justified eventTabs' role='tablist' id='eventTabs'>" +
                     " <li role='presentation' class='active'><a href='#upcomingEventsTab' aria-controls='upcomingEventsTab' role='tab' data-toggle='tab'> " +
                        "  <h3 class='noTopMargin'>Upcoming Events</h3>" +
                     " </a></li>" +
                     " <li role='presentation'><a href='#recurringEventsTab' aria-controls='recurringEventsTab' role='tab' data-toggle='tab'>" +
                     "     <h3 class='noTopMargin'>Recurring Events</h3>" +
                    "  </a></li>" +
                 " </ul>" +
                            " <div class='tab-content'>" +
                  "    <div role='tabpanel' class='tab-pane active' id='upcomingEventsTab'>" +
                                         "      <button type='button' class='btn btn-primary' id='back'>Back</button>" +
                "          <div class='btn-group'> " +
             "               <button type='button' class='btn btn-primary ddlSelectedMonthHeading'>Month</button>" +
            "               <button type='button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>" +
            "                   <span class='caret'></span>" +
            "                   <span class='sr-only'>Toggle Dropdown</span>" +
            "               </button>" +
            "               <ul id='monthsDropDown' class='dropdown-menu  ddlMonthMenu' role='menu' runat='server'>" +
            "               </ul>" +
            "           </div>" +
            "           <div class='btn-group'>" +
            "               <button type='button' class='btn btn-primary ddlSelectedYearHeading'>Year</button>" +
            "               <button type='button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>" +
            "                   <span class='caret'></span>" +
            "                   <span class='sr-only'>Toggle Dropdown</span>" +
            "               </button>" +
            "               <ul id='yearDropDown' class='dropdown-menu ddlYearMenu' role='menu' runat='server'>" +
            "               </ul>" +
            "           </div>" +
            " <button type='button' class='btn btn-primary' id='next'>Next</button>" +
                     "        <ul class='upComingEvents customUnorderedList'>" +
                   "       </ul>" +
                    "  </div>" +
                     " <div role='tabpanel' class='tab-pane' id='recurringEventsTab'>" +
                      "     <ul class='recurringEvents customUnorderedList'>" +
                       "   </ul>" +
                                            "</div> " +
                    "</div> ");

            var Months = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
            for (monthCounter = 0; monthCounter < Months.length; monthCounter++) {

                $("#monthsDropDown").append(
                                   "<li role='presentation'><a role='menuitem' tabindex='-1' href='#'>"
                                   + Months[monthCounter]
                                   + "</a></li>"
                    );
            }

            var date = new Date();
            var year = (date.getFullYear() + 2);
            for (var i = 0; i < 6; i++) {
                $("#yearDropDown").append(
                       "<li role='presentation'><a role='menuitem' tabindex='-1' href='#'>"
                                   + (year - i)
                                   + "</a></li>"
                    );
            }



        }

        function createShortenedEvents(item) {
            appendToScreen(".upComingEvents", getDisplayDate(getEventDate(item.start, false), getEventDate(item.end, true)), item.id);
        }
        function createFullEvents(item) {
            var eventDate = getEventDate(item.start);
            var currentMonth = getMonthFromString($(".ddlSelectedMonthHeading").text());
            if (eventDate.getMonth() == currentMonth && $(".ddlSelectedYearHeading").text() == eventDate.getFullYear().toString()) {
                appendToScreen(".upComingEvents", getDisplayDate(getEventDate(item.start), getEventDate(item.end)), item.id);
            }
        }

        function checkExpiredEvent(item) {
            var json = "https://www.googleapis.com/calendar/v3/calendars/" + item.organizer.email + "/events/" + item.id + "/instances?key=" + settings.key + "&alt=json";
            //  alert(json);
            var finalDate = getEventDate(item.start, false);
            $.ajax({
                url: json,
                dataType: 'json',
                type: 'get',
                cache: 'false',
                success: function (data) {
                    var calendarId = item.organizer.email;
                    $(data.items).each(function (index, item) {
                        var itemDate = new Date();
                        itemDate = getEventDate(item.start, false);

                        if (finalDate < itemDate) {
                            finalDate = itemDate;
                        }

                        //  alert(finalDate+ "   "+item.summary);
                    });
                    if (oldDate(finalDate)) {
                        for (var i = 0; i < eventIDs.length; i++) {
                            if (eventIDs[i] == item.id) {
                                $('#' + item.id).remove();
                            }

                        }
                    }
                }

            });


        }

        function getRecurringEventContentText(item) {

            var split = item.recurrence.toString().split(':');
            var options = split[1];
            split = options.split(';');

            var option1 = split[0];
            var option2 = split[1];
            var option3 = split[2];
            var option4 = split[3];
            if (split[1] === undefined) {
                option2 = null;
            }
            if (split[2] === undefined) {
                option3 = null;
            }
            if (split[3] === undefined) {
                option4 = null;
            }
            split = option1.split('=');
            var freguencyType = split[1];
            var displayText = '';

            switch (freguencyType) {
                case "DAILY":
                    if (option2 == null) {
                        displayText = "Occurs every day"; break;
                    } else {
                        split = option2.split('=');
                        switch (split[0]) {
                            case "INTERVAL":
                                var interval = split[1];
                                displayText = "Occurs every " + interval + " days";
                                break;
                            case "UNTIL":
                                checkExpiredEvent(item);
                                if (option3 == null) {
                                    displayText = "Occurs every day";
                                } else if (option3 != null) {
                                    split = option3.split('=');
                                    var interval = split[1];
                                    displayText = "Occurs every " + interval + " days";
                                }
                                break;
                            case "COUNT":
                                checkExpiredEvent(item);
                                // split = option2.split('=');
                                if (option3 == null) {
                                    displayText = "Occurs every day";
                                } else if (option3 != null) {
                                    split = option3.split('=');
                                    var interval = split[1];
                                    displayText = "Occurs every " + interval + " days";
                                }

                        }
                        break;
                    }




                case "WEEKLY":
                    if (option2 == null) {
                        var date = dayPlusOne(item);
                        displayText = "Occurs every week on " + date.format("dddd");
                    } else {
                        split = option2.split('=');
                        switch (split[0]) {
                            case "BYDAY":
                                var days = split[1].split(',');
                                var daysPerWeek = getDaysPerWeek(days);
                                displayText = "Occurs weekly on " + convertAbbreOfDayToFullDay(daysPerWeek);
                                break;
                            case "INTERVAL":
                                var interval = split[1];
                                if (option3 == null) {
                                    var date = dayPlusOne(item);
                                    displayText = "Occurs every " + interval + " weeks on " + date.format('dddd');
                                } else if (option3 != null) {
                                    var split = option3.split('=');

                                    var days = split[1].split(',');
                                    var daysPerWeek = getDaysPerWeek(days);
                                    displayText = "Occurs every " + interval + " weeks on " + convertAbbreOfDayToFullDay(daysPerWeek);
                                }

                                break;
                            case "UNTIL":
                                checkExpiredEvent(item);
                                if (option3 == null) {
                                    var date = dayPlusOne(item);
                                    displayText = "Occurs every week on " + date.format('dddd');
                                } else if (option3 != null) {
                                    split = option3.split('=');
                                    switch (split[0]) {
                                        case "INTERVAL":
                                            var interval = split[1];
                                            if (option4 == null) {
                                                var date = dayPlusOne(item);
                                                displayText = "Occurs every " + interval + " weeks on " + date.format('dddd');
                                            } else if (option4 != null) {
                                                var split = option4.split('=');
                                                var days = split[1].split(',');
                                                var daysPerWeek = getDaysPerWeek(days);
                                                displayText = "Occurs every " + interval + " weeks on " + convertAbbreOfDayToFullDay(daysPerWeek);
                                            }
                                            break;
                                        case "BYDAY":
                                            var days = split[1].split(',');
                                            var daysPerWeek = getDaysPerWeek(days);
                                            displayText = "Occurs weekly on " + convertAbbreOfDayToFullDay(daysPerWeek);
                                            break;
                                    }
                                }
                                break;
                            case "COUNT":
                                checkExpiredEvent(item);
                                split = option2.split('=');
                                if (option3 == null) {
                                    var date = dayPlusOne(item);
                                    displayText = "Occurs every week on " + date.format('dddd');
                                } else if (option3 != null) {
                                    split = option3.split('=');
                                    switch (split[0]) {
                                        case "INTERVAL":
                                            var interval = split[1];
                                            if (option4 == null) {
                                                var date = dayPlusOne(item);
                                                displayText = "Occurs every " + interval + " weeks on " + date.format('dddd');
                                            } else if (option4 != null) {
                                                split = option4.split('=');
                                                var days = split[1].split(',');
                                                var daysPerWeek = getDaysPerWeek(days);
                                                displayText = "Occurs every " + interval + " weeks on " + convertAbbreOfDayToFullDay(daysPerWeek);
                                            }
                                            break;
                                        case "BYDAY":
                                            var days = split[1].split(',');
                                            var daysPerWeek = getDaysPerWeek(days);
                                            displayText = "Occurs weekly on " + convertAbbreOfDayToFullDay(daysPerWeek);
                                            break;
                                            break;

                                    }

                                }
                                break;
                        }

                    }

                    break;
                case "MONTHLY":
                    displayText = "Occurs every month";
                    if (option2 == null) {
                        var date = dayPlusOne(item);
                        displayText = "Occurs every month on " + numeral(date.getDate()).format('0o');
                    } else {
                        split = option2.split('=');
                        switch (split[0]) {
                            case "BYDAY":
                                var day = split[1];
                                if (day[0] == '-') {
                                    var dayOfWeek = day[2] + day[3];
                                    displayText = "Occurs the last " + convertAbbreOfDayToFullDay(dayOfWeek) + " of every month";
                                } else {
                                    var dayOfWeek = day.replace(/\d+/g, '');
                                    var number = day.replace(/[^\d.]/g, '');
                                    displayText = "Occurs the " + numeral(number).format('0o') + " " + convertAbbreOfDayToFullDay(dayOfWeek) + " of every month";
                                }
                                break;
                            case "INTERVAL":
                                var interval = split[1];
                                if (option3 == null) {
                                    var date = dayPlusOne(item);
                                    displayText = "Occurs every " + interval + " months on the " + numeral(date.getDate()).format('0o');
                                } else if (option3 != null) {
                                    var split = option3.split('=');
                                    var day = split[1];
                                    if (day[0] == '-') {
                                        var dayOfWeek = day[2] + day[3];
                                        displayText = "Occurs every " + interval + " months on the last " + convertAbbreOfDayToFullDay(dayOfWeek) + " of every month";
                                    } else {
                                        var dayOfWeek = day.replace(/\d+/g, '');
                                        var number = day.replace(/[^\d.]/g, '');
                                        displayText = "Occurs every " + interval + " months on the " + numeral(number).format('0o') + " " + convertAbbreOfDayToFullDay(dayOfWeek) + " of each month";
                                    }


                                }

                                break;
                            case "UNTIL":
                                checkExpiredEvent(item);
                                if (option3 == null) {
                                    var date = dayPlusOne(item);
                                    displayText = "Occurs every month on the " + numeral(date.getDate()).format('0o');
                                } else if (option3 != null) {
                                    split = option3.split('=');
                                    switch (split[0]) {
                                        case "INTERVAL":
                                            var interval = split[1];
                                            if (option4 == null) {
                                                var date = dayPlusOne(item);
                                                displayText = "Occurs every " + interval + " months on the " + numeral(date.getDate()).format('0o');
                                            } else {
                                                split = option4.split('=');
                                                var day = split[1];
                                                if (day[0] == '-') {
                                                    var dayOfWeek = day[2] + day[3];
                                                    displayText = "Occurs every " + interval + " months on the last " + convertAbbreOfDayToFullDay(dayOfWeek) + " of every month";
                                                } else {
                                                    var dayOfWeek = day.replace(/\d+/g, '');
                                                    var number = day.replace(/[^\d.]/g, '');
                                                    displayText = "Occurs every " + interval + " months on the " + numeral(number).format('0o') + " " + convertAbbreOfDayToFullDay(dayOfWeek) + " of each month";
                                                }
                                            }
                                            break;
                                        case "BYDAY":
                                            var day = split[1];
                                            if (day[0] == '-') {
                                                var dayOfWeek = day[2] + day[3];
                                                displayText = "Occurs the last " + convertAbbreOfDayToFullDay(dayOfWeek) + " of every month";
                                            } else {
                                                var dayOfWeek = day.replace(/\d+/g, '');
                                                var number = day.replace(/[^\d.]/g, '');
                                                displayText = "Occurs the " + numeral(number).format('0o') + " " + convertAbbreOfDayToFullDay(dayOfWeek) + " of every month";
                                            }
                                            break;
                                    }
                                }
                                break;
                            case "COUNT":
                                checkExpiredEvent(item);
                                split = option2.split('=');
                                if (option3 == null) {
                                    var date = dayPlusOne(item);
                                    displayText = "Occurs every month on the " + numeral(date.getDate()).format('0o');
                                } else if (option3 != null) {
                                    split = option3.split('=');
                                    switch (split[0]) {
                                        case "INTERVAL":
                                            var interval = split[1];
                                            if (option4 == null) {
                                                var date = dayPlusOne(item);
                                                displayText = "Occurs every " + interval + " months on the " + numeral(date.getDate()).format('0o');
                                            } else {
                                                split = option4.split('=');
                                                var day = split[1];
                                                if (day[0] == '-') {
                                                    var dayOfWeek = day[2] + day[3];
                                                    displayText = "Occurs every " + interval + " months on the last " + convertAbbreOfDayToFullDay(dayOfWeek) + " of every month";
                                                } else {
                                                    var dayOfWeek = day.replace(/\d+/g, '');
                                                    var number = day.replace(/[^\d.]/g, '');
                                                    displayText = "Occurs every " + interval + " months on the " + numeral(number).format('0o') + " " + convertAbbreOfDayToFullDay(dayOfWeek) + " of each month";
                                                }

                                            }
                                            break;
                                        case "BYDAY":
                                            split = option3.split('=');
                                            var day = split[1];

                                            if (day[0] == '-') {
                                                var dayOfWeek = day[2] + day[3];
                                                displayText = "Occurs every month on the last " + convertAbbreOfDayToFullDay(dayOfWeek) + " of every month";
                                            } else {
                                                var dayOfWeek = day.replace(/\d+/g, '');
                                                var number = day.replace(/[^\d.]/g, '');
                                                displayText = "Occurs every month on the " + numeral(number).format('0o') + " " + convertAbbreOfDayToFullDay(dayOfWeek) + " of every month";
                                            }

                                            break;
                                    }

                                }
                                break;
                        }

                    }
                    break;
                case "YEARLY":
                    if (option2 == null) {
                        var date = dayPlusOne(item);
                        displayText = "Occurs once a year on " + date.format('mmmm dS');
                    } else if (option2 != null) {
                        split = option2.split('=');
                        switch (split[0]) {
                            case "INTERVAL":
                                var interval = split[1];
                                displayText = "Occurs every " + interval + " years on " + getEventDate(item.start, false).format("mmmm dS");
                                break;
                            case "UNTIL":
                                checkExpiredEvent(item);
                                if (option3 == null) {
                                    displayText = "Occurs every year on " + getEventDate(item.start, false).format("mmmm dS");

                                } else if (option3 != null) {
                                    split = option3.split('=')
                                    var interval = split[1];
                                    displayText = "Occurs every " + interval + " years on " + getEventDate(item.start, false).format("mmmm dS");
                                }

                                break;
                            case "COUNT":

                                checkExpiredEvent(item);

                                split = option2.split('=');
                                if (option3 == null) {
                                    var date = dayPlusOne(item);
                                    displayText = "Occurs once a year on " + date.format('mmmm dS');
                                } else if (option3 != null) {
                                    split = option3.split('=');
                                    var interval = split[1];
                                    displayText = "Occurs every " + interval + " years on " + getEventDate(item.start, false).format("mmmm dS");

                                }
                                break;
                        }
                    }
                    break;
                default: break;
            }

            if (item.start.dateTime != null) {
                var eventTime;
                var startTime = new Date(item.start.dateTime);
                var endTime = new Date(item.end.dateTime);
                eventTime = " | " + startTime.format('h:MM TT') + " - " + endTime.format('h:MM TT');
                displayText = displayText + eventTime;
            }

            return displayText;
        }

        function getEventDate(state, isEndTime) {
            var eventTime = '';
            var returnDate;
            if (state.date != null) {
                justDate = true;
                eventTime = new Date(state.date);
                returnDate = new Date(eventTime);
                if (!isEndTime) {
                    returnDate.setDate(eventTime.getDate() + 1);
                }
            } else if (state.dateTime != null) {
                dateAndTime = true;
                eventTime = new Date(state.dateTime);
                returnDate = new Date(eventTime);
            } else {
                eventTime = new Date().getDate();
                returnDate = new Date().getDate();
            }
            return returnDate;
        }

        function getDisplayDate(startTime, endTime) {
            var displayDate = '';
            var allDay = (endTime.getDate() - startTime.getDate()) <= 1 ? true : false;
            if (justDate && allDay) {
                displayDate = "<span class='startTime'>" + startTime.format("dddd, mmmm dS, yyyy") + "</span>";
            } else if (justDate && !compareDates(startTime, endTime)) {
                displayDate = "<span class='startTime'>" + startTime.format("dddd, mmmm dS, yyyy") + "</span> <span class='endTime'>" + " - " + endTime.format("dddd, mmmm dS, yyyy") + "</span>";
            } else if (dateAndTime && compareDates(startTime, endTime)) {
                displayDate = "<span class='startTime'>" + startTime.format("dddd, mmmm dS, yyyy") + "</span>" + ' | ' + startTime.format('h:MM TT') + ' - ' + endTime.format('h:MM TT');
            } else if (dateAndTime && !compareDates(startTime, endTime)) {
                displayDate = "<span class='startTime'>" + startTime.format("dddd, mmmm dS, yyyy") + "</span> <span class='endTime'>" + " - " + endTime.format("dddd, mmmm dS, yyyy") + "</span>" + ' | ' + startTime.format('dddd') + " " + startTime.format('h:MM TT') + ' - ' + endTime.format('dddd') + " " + endTime.format('h:MM TT');
            }

            return displayDate;
        }
        function appendToScreen(listName, content, id) {
            $(listName).append(
                       "<li id='" + id + "'><p class='pHeading'>"
                       + eventHeader
                       + "</p><p class='noBottomMargin'> "
                       + content
                       + "</p></li>"
                     );
        }
        function getDaysPerWeek(days) {
            var daysPerWeek = "";
            for (var i = 0; i < days.length; i++) {
                daysPerWeek = daysPerWeek + days[i] + ",";
            }
            daysPerWeek = daysPerWeek.replace(/,\s*$/, "");
            return daysPerWeek;
        }
    }



})(jQuery);