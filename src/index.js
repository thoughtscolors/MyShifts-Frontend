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

});

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
      const shift_id = shift.id
      const start = shift.dataset.start
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

//   axios.post(
//     .then(res => {
//       console.log(res);
//     })
}

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
