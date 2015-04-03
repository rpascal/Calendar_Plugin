$(function () {
    $('.eventList').googleCalendarList({
        'key': 'API KEY',
        'calendarIds': ["calendar ids"],
        'fullEventsWithDateSelect': false,
        'shortenedEvents': true,
        'holderName': '.eventList',
        'maxSize': 10,
        'futureEvent': true
    });
});


