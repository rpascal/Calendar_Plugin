function getMonthFromString(mon) {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth();
}

function sortDate(a, b) {
    return getDate(a) > getDate(b) ? 1 : -1;
}

function getDate(date) {
    var startSplit = $(date).find(".startTime").text();
    startSplit = startSplit.split(',');
    var year = startSplit[2]
    var month = startSplit[1].substring(1);
    month = month.replace(/\s{2,}/g, ' ').split(' ');
    var day = month[1].trim().replace(/\D/g, '');
    month = getMonthFromString(month[0]);
    return new Date(year, month, day);

}
function todaysDate() {
    var currentDate = new Date();
    var month = currentDate.getMonth();
    var day = currentDate.getDate();
    var year = currentDate.getFullYear();
    return new Date(year, month, day);
}

function compareDates(a, b) {
    return (a.format("dd mm yyyy") == b.format("dd mm yyyy"));
}
function oldDate(date) {
    return (date <= todaysDate());
}

function dayPlusOne(item) {
    var date = new Date();
    if (item.start.dateTime != null) {
        date = new Date(item.start.dateTime);
    } else if (item.start.date != null) {
        date = new Date(item.start.date);
        var addOne = new Date(date);
        addOne.setDate(date.getDate() + 1);
        date = addOne;
    }
    return date;


}



function convertAbbreOfDayToFullDay(day) {
    var days =  day.split(',');
   var daysOfWeek = '';
   var returnText = '';
   for (var i = 0; i < days.length ; i++) {
       var day = '';
       switch (days[i]) {
           case "MO": day = "Monday"; break;
           case "TU": day = "Tuesday"; break;
           case "WE": day = "Wednesday"; break;
           case "TH": day = "Thursday"; break;
           case "FR": day = "Friday"; break;
           case "SA": day = "Saturday"; break;
           case "SU": day = "Sunday"; break;
       }
       daysOfWeek = daysOfWeek + day + ", ";
   }

   returnText = daysOfWeek.replace(/,\s*$/, "");

   //returnText = daysOfWeek.substring(0, daysOfWeek.length - 1);
   return returnText;


}


