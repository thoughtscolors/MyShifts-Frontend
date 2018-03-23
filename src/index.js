const baseURL = 'http://localhost:3000'

document.addEventListener('DOMContentLoaded', () => {

  console.log('DOMContentLoaded');

  // --------------------------------------------------------
  // we will add event listeners to the buttons from the db info here,
  // can't do it to static buttons, just testing
  let releaseButton = document.getElementById('test1')
  releaseButton.addEventListener('click', stageRelease)

  let takeButton = document.getElementById('test2')
  takeButton.addEventListener('click', stageTakeShift)

  let confirmButton = document.getElementById('confirm')
  confirmButton.addEventListener('click', confirmRelease)
  // ---------------------------------------------------------

  let nowDate = new Date();
  let day = `0${nowDate.getDate()}`.slice(-2)
  let month = `0${nowDate.getMonth()+1}`.slice(-2)
  let date = `${nowDate.getFullYear()}-${month}-${day}`

  let scheduleHeader = document.querySelector('.schedule-header')
  scheduleHeader.innerHTML = date

  axios.get(`${baseURL}/shifts/user-shifts`)
    .then(result => {
      console.log('result!!!!', result)

      let currentDate  = document.querySelector('#current-date').innerHTML.slice(-10)
      console.log('ccccccc', currentDate)

      let allShifts = result.data.result

      allShifts.forEach(shift => {
        console.log('shift id', shift.shift_id)
        axios.get(`${baseURL}/shifts/${shift.shift_id}`)
          .then(shiftInfo => {
            let shiftDate = shiftInfo.data.result.date.slice(0, 10)
            console.log('shiftInfo ====>', shiftInfo)
            if( shiftDate === date) {
              let shiftStart = shiftInfo.data.result.start.slice(0, 5)
              let shiftEnd = Number(shiftStart.slice(0, 2)) + 2
              let shiftBox = document.getElementById(`${shiftStart}`)
              let shiftContent = shiftBox.querySelector('.shift-text')
              console.log('ssssssss', shiftContent)
              shiftContent.innerHTML = `Your shift: ${shiftStart}-${shiftEnd}:00`
              shiftBox.style.backgroundColor = '#F7493B'
              document.getElementById('take-shift').innerHTML = 'Release!'
            }
           }
          )
      })
    })
})

const employee_id = 1;

const stageRelease = () => {
  console.log('clicked');
  let button = event.target
  if (button.textContent !== "Cancel") {
    button.textContent = "Cancel"
  } else {
    button.textContent = "Release Shift"
  }
  let userDiv = event.target.parentNode
  userDiv.classList.toggle("staged")
}

const stageTakeShift = () => {
  console.log('clicked');
  let button = event.target
  if (button.textContent !== "Cancel") {
    button.textContent = "Cancel"
  } else {
    button.textContent = "Take Shift"
  }
  let userDiv = event.target.parentNode
  userDiv.classList.toggle("staged")
}

const confirmRelease = () => {
  const date = document.querySelector('.schedule-header').textContent
  const shifts = document.querySelectorAll('.shift')

  shifts.forEach(shift => {
    if (shift.classList.contains('staged')) {
      const shift_id = shift.dataset.shiftId
      const start = shift.id
      console.log(shift_id, start);

      axios.all([
        axios.delete(`${baseURL}/shifts/user-shifts/${shift_id}`),
        axios.post(`${baseURL}/shifts/requests`, {employee_id, shift_id, start, date})
      ])
         .then(axios.spread((res1, res2) => {
         console.log(res1, res2)
      }))

    }
  })
}
//   axios.post(
//     .then(res => {
//       console.log(res);
//     })


// const confirmRequest = () => {
//   let shift_id = 3
//   axios.post(`${baseURL}/shifts/requests`, {
//       user_id,
//       shift_id
//     })
//      .then(res2 => {
//        console.log(res1, res2);
//      })
//      .catch(err => {
//        console.log(err);
//      })
// }
