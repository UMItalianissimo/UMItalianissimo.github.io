// Client ID and API key from the Developer Console
var CLIENT_ID = '651655525617-pm3j2o1bncoi2b9n0ss840h0gbvdaotq.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDrjJQo6BKW9zMLSOOy4NW15jnPF1MxB9Y';
var CALENDAR_ID = 'umich.edu_nafpvsdump5t4evj124vs8lcd0@group.calendar.google.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

/**
*  On load, called to load the auth2 library and API client library.
*/
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        'calendarId': CALENDAR_ID,
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    })
    .then(function(response) {
        var events = response.result.items;

        if (events.length > 0) {
            // find the first event and print the name and time to "next event" block
            var nextEvent = events[0];
            var dateTime = parseTime(nextEvent);
            var location = nextEvent.location;

            $("#next_event > .info").append("<p class='sub'>" + nextEvent.summary +
                "</p><p class='sub'>" + dateTime.date + "</p><p class='sub'>" +
                dateTime.time + "</p>"
            );

            if (location != undefined) {
                $("#next_event > .info").append("<p class='sub'>" + location + "</p>");
            }

        } else {
            $("#next_event > .info").append("<p class='sub'>TBA</p>");
        }
    })
    .then(function() {
        // once the events are finished being listed, resize the blocks
        resize();
    });
}

/**
*  Initializes the API client library and sets up sign-in state
*  listeners.
*/
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        listUpcomingEvents();
    });
}

function resize() {
    // sets top margin of each ".info" block to vertically align it in parent
    $(".info").each(function() {
        var margin = ($(".info_block").height() - $(this).height()) / 2;
        $(this).css('margin-top', margin + 'px');
    })
};

/*
 * time to parse the stupid RFC dateTime notation and make it
 * humanly readable :D
 */
function parseTime(event) {

    // input format: YEAR-MONTH-DAYTHOUR:MINUTE:SECOND-TIMEZONE
    // splits into [date, time]
    var start = event.start.dateTime.split("T");
    var end = event.end.dateTime.split("T");
    // produces [year, month, day]
    var date = start[0].split("-");
    // this is the date in its final form!
    var processedDate = date[1] + "/" + date[2] + "/" + date[0];

    // just takes the start time, we don't need time zone
    var startTime = start[1].split("-")[0];
    var endTime = end[1].split("-")[0];

    // split by hr/min/sec
    startTime = startTime.split(":");
    endTime = endTime.split(":");

    var start_period = "am";
    var end_period = "am";

    // convert to 12-hr time
    if (startTime[0] > 12) {
        startTime[0] -= 12;
        start_period  = "pm";
    }
    if (endTime[0] > 12) {
        endTime[0] -= 12;
        end_period  = "pm";
    }

    // finally put the time together in format <6:00pm-8:00pm>
    processedTime = startTime[0] + ":" + startTime[1] + start_period +
        "-" + endTime[0] + ":" + endTime[1] + end_period;

    // return an object with the date and time
    return { "date": processedDate, "time": processedTime };
}

$(document).ready(function(){
    console.log("finding events");
    handleClientLoad();

    $(window).resize(function(){
        resize();
    });
});
