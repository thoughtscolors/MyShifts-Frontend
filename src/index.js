const baseURL = 'http://localhost:3000'

document.addEventListener('DOMContentLoaded', () => {

  let nowDate = new Date();
  let day = `0${nowDate.getDate()}`.slice(-2)
  let month = `0${nowDate.getMonth()+1}`.slice(-2)
  let date = `${nowDate.getFullYear()}-${month}-${day}`

  let scheduleHeader = document.querySelector('.schedule-header')
  scheduleHeader.innerHTML = date

  // get all requests with nested employees on load
  axios.get(`${baseURL}/shifts`)
    .then(result => {
      let currentDate  = document.querySelector('#current-date').innerHTML.slice(-10)
      let shift1000 = document.getElementById('10:00')
      let shift1400 = document.getElementById('14:00')
      let shift1800 = document.getElementById('18:00')

      // empty the divs
      shift1000.innerHTML = ``
      shift1400.innerHTML = ``
      shift1800.innerHTML = ``
      shift1000.style.backgroundColor = `#fafafa`
      shift1400.style.backgroundColor = `#fafafa`
      shift1800.style.backgroundColor = `#fafafa`

      // filter the requests for the current date
      const ofDayRequest = result.data.result.filter(request => request.date.slice(0, 10) === currentDate)

      ofDayRequest.forEach(request => {
        request.employees.forEach(employee => {
          let shiftText = document.createElement('span')
          let releaseTakes = document.createElement('button')
          let name = employee.first_name

          shiftText.textContent = name
          shiftText.classList.add('shift-text')
          shiftText.setAttribute('data-employeeId', employee.id)

          // add button with text type and name
          releaseTakes.textContent = (employee.id === 1) ? 'Release Shift' : 'Take Shift'
          releaseTakes.setAttribute('type', 'button')
          releaseTakes.setAttribute('name', 'button')

          // add name, shift time, and employee id
          if (request.start.slice(0, 5) === '10:00') {
            shiftText.textContent += ' 10:00 - 14:00'
            shift1000.style.backgroundColor = (employee.id === 1) ? '#fa4832' : '#4ec4cf'
            // add to div
            shift1000.appendChild(shiftText)
            shift1000.appendChild(releaseTakes)
          } else if (request.start.slice(0, 5) === '14:00') {
            shiftText.textContent += ' 14:00 - 18:00'
            shift1400.style.backgroundColor = (employee.id === 1) ? '#fa4832' : '#4ec4cf'
            // add to div
            shift1400.appendChild(shiftText)
            shift1400.appendChild(releaseTakes)
          } else if (request.start.slice(0, 5) === '18:00') {
            shiftText.textContent += ' 18:00 - 22:00'
            shift1800.style.backgroundColor = (employee.id === 1) ? '#fa4832' : '#4ec4cf'
            // add to div
            shift1800.appendChild(shiftText)
            shift1800.appendChild(releaseTakes)
          }
        })
      })
    })

  axios.get(`${baseURL}/shifts/user-shifts`)
    .then(result => {
      console.log('result!!!!', result)

      let currentDate  = document.querySelector('#current-date').innerHTML.slice(-10)
      console.log('ccccccc', currentDate)
    })

  // get all requests with nested employees when mousedown is on calendar
  document.addEventListener('mousedown', () => {
    axios.get(`${baseURL}/shifts`)
      .then(result => {
        // timeout for promise to catch up
        setTimeout(() => {
          let thisDate = document.querySelector('.schedule-header')
          let shift1000 = document.getElementById('10:00')
          let shift1400 = document.getElementById('14:00')
          let shift1800 = document.getElementById('18:00')

          // empty the divs
          shift1000.innerHTML = ``
          shift1400.innerHTML = ``
          shift1800.innerHTML = ``
          shift1000.style.backgroundColor = `#fafafa`
          shift1400.style.backgroundColor = `#fafafa`
          shift1800.style.backgroundColor = `#fafafa`

          // filter the requests for the current date
          const ofDayRequest = result.data.result.filter(request => request.date.slice(0, 10) === thisDate.innerHTML)

          ofDayRequest.forEach(request => {
            request.employees.forEach(employee => {
              let shiftText = document.createElement('span')
              let releaseTakes = document.createElement('button')
              let name = employee.first_name

              shiftText.textContent = name
              shiftText.classList.add('shift-text')
              shiftText.setAttribute('data-employeeId', employee.id)

              // add button with text type and name
              releaseTakes.textContent = (employee.id === 1) ? 'Release Shift' : 'Take Shift'
              releaseTakes.setAttribute('type', 'button')
              releaseTakes.setAttribute('name', 'button')

              // add name, shift time, and employee id
              if (request.start.slice(0, 5) === '10:00') {
                shiftText.textContent += ' 10:00 - 14:00'
                shift1000.style.backgroundColor = (employee.id === 1) ? '#fa4832' : '#4ec4cf'
                // add to div
                shift1000.appendChild(shiftText)
                shift1000.appendChild(releaseTakes)
              } else if (request.start.slice(0, 5) === '14:00') {
                shiftText.textContent += ' 14:00 - 18:00'
                shift1400.style.backgroundColor = (employee.id === 1) ? '#fa4832' : '#4ec4cf'
                // add to div
                shift1400.appendChild(shiftText)
                shift1400.appendChild(releaseTakes)
              } else if (request.start.slice(0, 5) === '18:00') {
                shiftText.textContent += ' 18:00 - 22:00'
                shift1800.style.backgroundColor = (employee.id === 1) ? '#fa4832' : '#4ec4cf'
                // add to div
                shift1800.appendChild(shiftText)
                shift1800.appendChild(releaseTakes)
              }
            })
          })
        }, 100)
      })
  })
})
