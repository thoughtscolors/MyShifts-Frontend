const baseURL = 'http://localhost:3000'

document.addEventListener('DOMContentLoaded', renderPage(email))

let nowDate = new Date();
let day = `0${nowDate.getDate()}`.slice(-2)
let month = `0${nowDate.getMonth()+1}`.slice(-2)
let date = `${nowDate.getFullYear()}-${month}-${day}`

const renderPage = (email) => {
  console.log('this email === ', email);
console.log('rendering page');
  let nowDate = new Date();
  let day = `0${nowDate.getDate()}`.slice(-2)
  let month = `0${nowDate.getMonth()+1}`.slice(-2)

  let date = `${nowDate.getFullYear()}-${month}-${day}`

  let scheduleHeader = document.querySelector('.schedule-header')
  scheduleHeader.innerHTML = date
console.log('xxxxxx')
  // get all requests with nested employees on load
  axios.get(`${baseURL}/shifts/requests`)
  .then(result => {
console.log('rrrrrrresult', result)
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
    })
  })
}

const releaseShift = (shift_id, request_id) => {
  console.log('oooooooo')
  //console.log(event.target.parentNode.id)
  //let date = `${nowDate.getFullYear()}-${month}-${day}`

      axios.patch(`${baseURL}/shifts/user-shifts/${shift_id}`, {request_id})
       .then(result => {
         console.log('result in releaseShift', result)
       })

}



let columnRight = document.querySelector('#col-right').children

console.log('righttttt', columnRight)



const confirm = () => {

  const allShiftBoxes = document.querySelector('#col-right').children

  for(let i = 0; i < allShiftBoxes.length; i++) {

    let start = allShiftBoxes[i].id
      let employee_id = allShiftBoxes[i].dataset.employeeid
      let shift_id = allShiftBoxes[i].dataset.shiftid
      let shiftContentBox = allShiftBoxes[i].firstChild.nextSibling
      let shiftContent = shiftContentBox.innerHTML
      let shiftPeriod = shiftContent.slice(-10)
      let shiftButton = allShiftBoxes[i].lastChild
    if(allShiftBoxes[i].classList.contains('staged-release')) {
      // let start = allShiftBoxes[i].id
      // let employee_id = allShiftBoxes[i].dataset.employeeid
      // let shift_id = allShiftBoxes[i].dataset.shiftid
      // let shiftContentBox = allShiftBoxes[i].firstChild.nextSibling
      // let shiftContent = shiftContentBox.innerHTML
      // let shiftPeriod = shiftContent.slice(-10)
      // let shiftButton = allShiftBoxes[i].lastChild

      createRequest(employee_id, shift_id, start, date)

      allShiftBoxes[i].classList.remove('staged-release')
      allShiftBoxes[i].classList.remove('current')
      allShiftBoxes[i].classList.add('request')
      shiftContentBox.innerHTML = `Justin: ${shiftPeriod}`
      shiftButton.innerHTML = 'Take Shift'

      console.log('dddddddddd', shiftContent)

    } else if (allShiftBoxes[i].classList.contains('staged-take-shift')) {
      //let start = allShiftBoxes[i].id
      let request_id = allShiftBoxes[i].dataset.reqid
     // let shift_id = allShiftBoxes[i].dataset.shiftid
      let new_request_id = 0

      deleteRequestWhenTaken(request_id)
      addToUserShiftsWhenTaken(shift_id, start, date, new_request_id)


      allShiftBoxes[i].classList.remove('staged-take-shift')
      allShiftBoxes[i].classList.remove('request')
      allShiftBoxes[i].classList.add('current')
      allShiftBoxes[i].dataset.reqid = 0
      allShiftBoxes[i].dataset.employeeid = 1
      // const shiftContentBox = allShiftBoxes[i].firstChild.nextSibling
      // const shiftContent = shiftContentBox.innerHTML
      // let shiftPeriod = shiftContent.slice(-10)
      shiftContentBox.innerHTML = `Your Shift: ${shiftPeriod}`
      shiftButton.innerHTML = 'Release Shift'
    }
  }

}

const confirmButton = document.querySelector('#confirm')
confirmButton.onclick = confirm


  // JUSTIN
  // get all requests with nested employees when mousedown is on calendar
 // document.addEventListener('mousedown', () => {
    // axios.get(`${baseURL}/shifts/requests`)
    // .then(result => {
    //   // timeout for promise to catch up
    //   setTimeout(() => {
    //     //let thisDate = document.querySelector('.schedule-header')
    //     let shift1000 = document.getElementById('10:00')
    //     let shift1400 = document.getElementById('14:00')
    //     let shift1800 = document.getElementById('18:00')
    //     let userInShift1000 = false
    //     let userInShift1400 = false
    //     let userInShift1800 = false

    //     // empty the divs
    //     shift1000.innerHTML = ``
    //     shift1400.innerHTML = ``
    //     shift1800.innerHTML = ``
    //     shift1000.style.backgroundColor = `#fafafa`
    //     shift1400.style.backgroundColor = `#fafafa`
    //     shift1800.style.backgroundColor = `#fafafa`

    //     // filter the requests for the current date
    //     const ofDayRequest = result.data.result.filter(request => request.date.slice(0, 10) === date)

    //     ofDayRequest.forEach(request => {
    //       request.employees.forEach(employee => {
    //         let shiftText = document.createElement('span')
    //         let releaseTakes = document.createElement('button')
    //         let name = employee.first_name

    //         shiftText.textContent = name
    //         shiftText.classList.add('shift-text')
    //         shiftText.setAttribute('data-employeeId', employee.id)

    //         // add button with text type and name
    //         releaseTakes.textContent = 'Take Shift'
    //         releaseTakes.setAttribute('type', 'button')
    //         releaseTakes.setAttribute('name', 'button')

    //         // add name, shift time, and employee id to element
    //         if (request.start.slice(0, 5) === shift1000.id && !userInShift1000) {
    //           let start = shift1000.id
    //           let end = `${Number(start.slice(0, 2)) + 4}${start.slice(2)}`
    //           shiftText.textContent += ` ${start} - ${end}`
    //           shift1000.style.backgroundColor = '#4ec4cf'
    //           // add to div
    //           if (!userInShift1000) {
    //             shift1000.insertBefore(shiftText, shift1000.childNodes[0])
    //             shift1000.insertBefore(releaseTakes, shift1000.childNodes[1])
    //             userInShift1000 = true
    //           } else {
    //             shift1000.appendChild(shiftText)
    //             shift1000.appendChild(releaseTakes)
    //           }
    //         } else if (request.start.slice(0, 5) === shift1400.id && !userInShift1400) {
    //           let start = shift1400.id
    //           let end = `${Number(start.slice(0, 2)) + 4}${start.slice(2)}`
    //           shiftText.textContent += ` ${start} - ${end}`
    //           shift1400.style.backgroundColor = '#4ec4cf'
    //           // add to div
    //           if (!userInShift1400) {
    //             shift1400.insertBefore(shiftText, shift1400.childNodes[0])
    //             shift1400.insertBefore(releaseTakes, shift1400.childNodes[1])
    //             userInShift1400 = true
    //           } else {
    //             shift1400.appendChild(shiftText)
    //             shift1400.appendChild(releaseTakes)
    //           }
    //         } else if (request.start.slice(0, 5) === shift1800.id && !userInShift1800) {
    //           let start = shift1800.id
    //           let end = `${Number(start.slice(0, 2)) + 4}${start.slice(2)}`
    //           shiftText.textContent += ` ${start} - ${end}`
    //           shift1800.style.backgroundColor = '#4ec4cf'
    //           // add to div
    //           if (!userInShift1800) {
    //             shift1800.insertBefore(shiftText, shift1800.childNodes[0])
    //             shift1800.insertBefore(releaseTakes, shift1800.childNodes[1])
    //             userInShift1800 = true
    //           } else {
    //             shift1800.appendChild(shiftText)
    //             shift1800.appendChild(releaseTakes)
    //           }
    //         }
    //       })
    //     })
    //   }, 200)
    // })
  // })
  // JUSTIN
