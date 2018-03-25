//<![CDATA[
$(function() {
    $('#wrapper .version strong').text('v' + $.fn.pignoseCalendar.version);

let nowDate = new Date();
let day = `0${nowDate.getDate()}`.slice(-2)
let month = `0${nowDate.getMonth()+1}`.slice(-2)
let todayDate = `${nowDate.getFullYear()}-${month}-${day}`
let currentDate = document.querySelector('#current-date')
currentDate.innerHTML = `Today's ${todayDate}`

    function onClickHandler(date, obj) {
        /**
         * @date is an array which be included dates(clicked date at first index)
         * @obj is an object which stored calendar interal data.
         * @obj.calendar is an element reference.
         * @obj.storage.activeDates is all toggled data, If you use toggle type calendar.
         * @obj.storage.events is all events associated to this date
         */
  // console.log('wwwww', date[0]._i)
  // console.log('qqqqqqq', obj)
        var $calendar = obj.calendar;
        var $box = $calendar.parent().siblings('.box').show();
        let box = document.querySelector('.box')
        let shifts = document.querySelector('#shifts')
        var text = ``;

        if(date[0] !== null) {
            text += date[0].format('YYYY-MM-DD');
        }

        if(date[0] !== null && date[1] !== null) {
            text += ' ~ ';
        } else if(date[0] === null && date[1] == null) {
            text += 'nothing';
        }

        if(date[1] !== null) {
            text += date[1].format('YYYY-MM-DD');
        }
// console.log('tttttt', text)
// console.log('blurb = ', );
const scheduleHeader = document.querySelector('.schedule-header')
scheduleHeader.innerHTML = text

    }

    // Default Calendar
    $('.calendar').pignoseCalendar({
        select: onClickHandler
    });

    // This use for DEMO page tab component.
    $('.menu .item').tab();
});
//]]>
