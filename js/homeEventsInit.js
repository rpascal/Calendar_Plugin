$(function () {
    $('.eventList').googleCalendarList({
        'key': 'AIzaSyCIwgW_o0spPcW92j7zM2tBo20cSlaHe5k',
        'calendarIds': ["89t4rmh7d5abnqbdppbspq7k1g@group.calendar.google.com","jo8fgk2hrrqsgr0b2ujckpn5ac@group.calendar.google.com"],
        'fullEventsWithDateSelect': false,
        'shortenedEvents': true,
        'holderName': '.eventList',
        'maxSize': 10,
        'futureEvent': true
    });
});


