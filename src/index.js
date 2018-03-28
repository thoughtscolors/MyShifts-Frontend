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
                release.addEventListener('click', releaseShift)
  
                if(!userShiftBox.querySelector('button')) {
                  userShiftBox.appendChild(release)
                }
                
                
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

const releaseShift = (event) => {
  console.log('oooooooo')
  console.log(event.target.parentNode.id)
  let date = `${nowDate.getFullYear()}-${month}-${day}`
  const start = event.target.parentNode.id

  axios.post(`${baseURL}/shifts/requests`, {start, date, employee_id: 1, shift_id })
    .then(result => {
      const request_id = result.id
      axios.patch(`${baseURL}/shifts/user-shifts/${shift_id}`, {request_id})

    })

  
}
  
  

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

