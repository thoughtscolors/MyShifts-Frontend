const baseURL = 'http://localhost:3000'
let nowDate = new Date();
let day = `0${nowDate.getDate()}`.slice(-2)
let month = `0${nowDate.getMonth()+1}`.slice(-2)
let date = `${nowDate.getFullYear()}-${month}-${day}`
let userName
let userId

const currentDate = document.querySelector('#current-date')


document.addEventListener('DOMContentLoaded', () => {
  renderPage()
})

const renderPage = () => {

console.log('rendering page');
const token = JSON.parse(localStorage.getItem('authorization'))
const scheduleHeader = document.querySelector('.schedule-header')
scheduleHeader.textContent = date


// get all logged in employee's shifts
axios.get(`${baseURL}/shifts`, { headers: { authorization: token }})
  .then(userShifts => {
    const ofDayShift = userShifts.data.filter(shift => shift.date.slice(0, 10) === date)
    userName = userShifts.data[0].first_name
    userId = userShifts.data[0].employee_id
    currentDate.innerHTML = `Hi ${userName} Today's ${date}`


    ofDayShift.forEach(shift => {
      let startTime = `${shift.start}`.slice(0, 5)
      let endTime = Number(startTime.slice(0,2)) + 4
      let userShiftBox = document.getElementById(startTime)
      let shiftContent = userShiftBox.querySelector('.shift-text')
      let releaseButton = document.createElement('button')
      releaseButton.addEventListener('click', toggleStage)
      userShiftBox.setAttribute('data-shiftid', shift.shift_id)
      userShiftBox.setAttribute('data-employeeid', shift.employee_id)
      userShiftBox.classList.add('current')
      shiftContent.innerHTML = `Your shift: ${startTime}-${endTime}:00`
      releaseButton.innerHTML = 'Release Shift'

      if(!userShiftBox.querySelector('button')) {
        userShiftBox.appendChild(releaseButton)
      }

      if (userShiftBox.classList.contains('staged-release')) {
        userShiftBox.classList.remove('staged-release')
      }
    })

    // get all requests with nested employees on load
  axios.get(`${baseURL}/requests`)
    .then(result => {

      // filter the requests for the current date
      const ofDayRequest = result.data.result.filter(request => request.date.slice(0, 10) === date)

      ofDayRequest.forEach(request => {
        let requestTime = request.start.slice(0, 5)
        let requestEndTime = Number(requestTime.slice(0,2)) + 4
        let requestBox = document.getElementById(`${requestTime}`)
        let requestContent = requestBox.querySelector('.shift-text')
        let takeButton = document.createElement('button')
        let name = request.employees[0].first_name

        const employeeidInShiftBox = requestBox.dataset.employeeid

        if(employeeidInShiftBox !== request.employee_id ) {
          takeButton.addEventListener('click', toggleStage)
          requestBox.setAttribute('data-reqid', request.id)
          requestBox.setAttribute('data-shiftid', request.shift_id)
          requestBox.setAttribute('data-employeeid', request.employee_id)
          requestBox.classList.add('request')
          if(requestBox.classList.contains('current')) {
            requestBox.classList.remove('current')
          }
          requestContent.innerHTML = `${name}: ${requestTime}-${requestEndTime}:00`
          takeButton.innerHTML = 'Take Shift'

          if(!requestBox.querySelector('button')) {
            requestBox.appendChild(takeButton)
          } else {
            requestBox.querySelector('button').innerHTML = 'Take Shift'
          }

          if (requestBox.classList.contains('staged-take-shift')) {
            requestBox.classList.remove('staged-take-shift')
          }
        }
      })
    })
  })
}


let columnRight = document.querySelector('#col-right').children


const confirm = () => {
  console.log('userName', userName)
  const allShiftBoxes = document.querySelector('#col-right').children

  for(let i = 0; i < allShiftBoxes.length; i++) {

    let start = allShiftBoxes[i].id
      let employee_id = allShiftBoxes[i].dataset.employeeid
      let shift_id = allShiftBoxes[i].dataset.shiftid
      let shiftContentBox = allShiftBoxes[i].firstChild.nextSibling
      let shiftContent = shiftContentBox.innerHTML
      let shiftPeriod = shiftContent.slice(-11)
      let shiftButton = allShiftBoxes[i].lastChild
    if(allShiftBoxes[i].classList.contains('staged-release')) {

      createRequest(employee_id, shift_id, start, date)

      allShiftBoxes[i].classList.remove('staged-release')
      allShiftBoxes[i].classList.remove('current')
      allShiftBoxes[i].classList.add('request')
      shiftContentBox.innerHTML = `${userName}: ${shiftPeriod}`
      shiftButton.innerHTML = 'Take Shift'

    } else if (allShiftBoxes[i].classList.contains('staged-take-shift')) {

      let request_id = allShiftBoxes[i].dataset.reqid
      let new_request_id = 0

      deleteRequestWhenTaken(request_id)
      updateEmployeesShifts(employee_id, shift_id, userId)

      allShiftBoxes[i].classList.remove('staged-take-shift')
      allShiftBoxes[i].classList.remove('request')
      allShiftBoxes[i].classList.add('current')
      allShiftBoxes[i].dataset.reqid = 0
      allShiftBoxes[i].dataset.employeeid = userId
      shiftContentBox.innerHTML = `Your Shift: ${shiftPeriod}`
      shiftButton.innerHTML = 'Release Shift'
    }
  }
}

const confirmButton = document.querySelector('#confirm')
confirmButton.onclick = confirm
