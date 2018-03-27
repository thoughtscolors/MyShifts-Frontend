const baseURL = 'http://localhost:3000'

document.addEventListener('DOMContentLoaded', () => {
  renderPage()
})

const renderPage = () => {

  let nowDate = new Date();
  let day = `0${nowDate.getDate()}`.slice(-2)
  let month = `0${nowDate.getMonth()+1}`.slice(-2)
  let date = `${nowDate.getFullYear()}-${month}-${day}`

  let scheduleHeader = document.querySelector('.schedule-header')
  scheduleHeader.innerHTML = date

  // get all requests with nested employees on load
  axios.get(`${baseURL}/shifts/requests`)
  .then(result => {

    // filter the requests for the current date
    const ofDayRequest = result.data.result.filter(request => request.date.slice(0, 10) === date)

    ofDayRequest.forEach(request => {

      request.employees.forEach(employee => {

        let name = employee.first_name

        axios.get(`${baseURL}/shifts/user-shifts`)
          .then(userShifts => {
            const allShifts  = userShifts.data.result
            allShifts.forEach(shift => {
              if(shift.date.slice(0, 10) === date && shift.request_id === 0  ) {
                let startTime = `${shift.start}`.slice(0, 5)
                let endTime = Number(startTime.slice(0,2)) + 4
                let userShiftBox = document.getElementById(`${shift.start}`.slice(0, 5))
                let shiftContent = userShiftBox.querySelector('.shift-text')
                let release = document.createElement('button')

                shiftContent.innerHTML = `Your shift: ${startTime}-${endTime}:00`
                userShiftBox.style.backgroundColor = 'red'
                release.innerHTML = 'Release Shift'

                userShiftBox.appendChild(release)

              } else {
                let requestTime = request.start.slice(0, 5)
                let requestEndTime = Number(requestTime.slice(0,2)) + 4
                let requestBox = document.getElementById(`${requestTime}`)
                let requestContent = requestBox.querySelector('.shift-text')
                let take = document.createElement('button')

                  requestContent.innerHTML = `${name}: ${requestTime}-${requestEndTime}:00`
                  requestBox.style.backgroundColor = 'blue'
                  take.innerHTML = 'Take Shift'
                if(!requestBox.querySelector('button')) {
                  requestBox.appendChild(take)
                }
              }
            })
          })
      })
    })
  })
}
