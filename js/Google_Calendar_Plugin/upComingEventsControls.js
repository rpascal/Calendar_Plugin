function createControls(callBack) {

    $(".ddlSelectedMonthHeading").text(new Date().format('mmmm'));
    $(".ddlSelectedYearHeading").text(new Date().format('yyyy')); 
    //alert(getMonthFromString($(".ddlSelectedMonthHeading").text()));

    function dateTransition(num) {
   
        var d = new Date();
        d.setDate(15);
        d.setMonth(num);
      //  alert(d);
        var oldMonth = $(".ddlSelectedMonthHeading").text();
        $(".ddlSelectedMonthHeading").text(d.format('mmmm'));
        if (d.getMonth() == 11 && (getMonthFromString(oldMonth) == 0 )) {
            $(".ddlSelectedYearHeading").text((parseInt($(".ddlSelectedYearHeading").text()) - 1).toString());
        }
        if (d.getMonth() == 0 && (getMonthFromString(oldMonth) ==11)) {
            $(".ddlSelectedYearHeading").text((parseInt($(".ddlSelectedYearHeading").text()) + 1).toString());
        }
        callBack();
    }

    $("#next").click(function () {
     
        dateTransition(getMonthFromString($(".ddlSelectedMonthHeading").text()) + 1);
    });
    $("#back").click(function () {
        //alert(getMonthFromString($(".ddlSelectedMonthHeading").text()) - 1);
        dateTransition(getMonthFromString($(".ddlSelectedMonthHeading").text()) - 1);
    });

    //alert('here');
    callBack();
   // alert('here2');
    //function loopJsons() {
    //    $('.eventList').googleCalendarList({
    //        'key': 'AIzaSyCIwgW_o0spPcW92j7zM2tBo20cSlaHe5k',
    //        'calendarIds': ["89t4rmh7d5abnqbdppbspq7k1g@group.calendar.google.com", "jo8fgk2hrrqsgr0b2ujckpn5ac@group.calendar.google.com"],
    //        'fullEventsWithDateSelect': true,
    //        'shortenedEvents': false,
    //        'futureEvent': false,
    //         'skipCreatingUnorderedList': true

    //    });

    //}
}


$(function () {

    $(".ddlMonthMenu li a").click(function () {

        $(".ddlSelectedMonthHeading").text($(this).text());
        $(".ddlSelectedMonthHeading").val($(this).text());
        loopJsons();

    });


});
$(function () {
    $(".ddlYearMenu li a").click(function () {

        $(".ddlSelectedYearHeading").text($(this).text());
        $(".ddlSelectedYearHeading").val($(this).text());
        loopJsons();

    });
});


