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

    // JUSTIN
    // clears elements color, textContent, and button for new data to fill
    document.querySelectorAll('.shift').forEach(shift => {
      shift.classList = ''
      shift.classList.add('shift')
      shift.style.backgroundColor = ''
      shift.querySelector('.shift-text').textContent = ''
      if (shift.querySelectorAll('button')) {
        shift.querySelectorAll('button').forEach(button => {
          shift.removeChild(button)
        })
      }
    })

    // get all requests with nested employees on load
    axios.all([
      axios.get(`${baseURL}/shifts/requests`),
      axios.get(`${baseURL}/shifts/user-shifts`)
    ])
    .then(axios.spread((getRequests, getUserShifts) => {
      // filter the requests for the current date
      const ofDayRequest = getRequests.data.result.filter(request => request.date.slice(0, 10) === scheduleHeader.textContent)

      ofDayRequest.forEach(request => {

        request.employees.forEach(employee => {
          let name = employee.first_name

          const allShifts  = getUserShifts.data.result
          allShifts.forEach(shift => {
            if(shift.date.slice(0, 10) === scheduleHeader.textContent && shift.request_id === 0  && (!document.getElementById(`${shift.start}`.slice(0, 5)).querySelector('.shift-text').textContent)) {

              let startTime = `${shift.start}`.slice(0, 5)
              let endTime = Number(startTime.slice(0,2)) + 4
              let userShiftBox = document.getElementById(`${shift.start}`.slice(0, 5))
              let shiftContent = userShiftBox.querySelector('.shift-text')

              let releaseButton = document.createElement('button')
              releaseButton.addEventListener('click', toggleStage)
              userShiftBox.setAttribute('data-shiftid', shift.shift_id)
              userShiftBox.setAttribute('data-employeeid', 1)
              userShiftBox.setAttribute('data-reqid', 0)
              userShiftBox.classList.add('current')
              shiftContent.innerHTML = `Your shift: ${startTime}-${endTime}:00`
              releaseButton.innerHTML = 'Release Shift'

              if(!userShiftBox.querySelector('button')) {
                userShiftBox.appendChild(releaseButton)
              }

              if (userShiftBox.classList.contains('staged-release')) {
                userShiftBox.classList.remove('staged-release')
              }

            } else {
              let requestTime = request.start.slice(0, 5)
              let requestEndTime = Number(requestTime.slice(0,2)) + 4
              let requestBox = document.getElementById(`${requestTime}`)
              let requestContent = requestBox.querySelector('.shift-text')
              let takeButton = document.createElement('button')

              takeButton.addEventListener('click', toggleStage)
              requestBox.setAttribute('data-reqid', request.id)
              requestBox.setAttribute('data-shiftid', request.shift_id)
              requestBox.setAttribute('data-employeeid', employee.id)
              requestBox.classList.add('request')
              requestContent.innerHTML = `${name}: ${requestTime}-${requestEndTime}:00`
              takeButton.innerHTML = 'Take Shift'

              if(!requestBox.querySelector('button')) {
                requestBox.appendChild(takeButton)
              }

              if (requestBox.classList.contains('staged-take-shift')) {
                requestBox.classList.remove('staged-take-shift')
              }
            }
          })
        })
      })
    }))
    // JUSTIN
  }

  // Default Calendar
  $('.calendar').pignoseCalendar({
      select: onClickHandler
  });

  // This use for DEMO page tab component.
  $('.menu .item').tab();
});
//]]>
