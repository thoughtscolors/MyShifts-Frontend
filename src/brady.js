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

const createRequestOnConfirm = () => {
  const date = document.querySelector('.schedule-header').textContent
  const shifts = document.querySelectorAll('.shift')

  shifts.forEach(shift => {
    if (shift.classList.contains('staged')) {
      const shift_id = shift.dataset.shiftId
      const start = shift.id
      console.log(shift_id, start);

      axios.post(`${baseURL}/shifts/requests`, {employee_id, shift_id, start, date})
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err);
      })
    }
  })
}

const deleteRequestWhenShiftTaken = (requestId) => {
  axios.delete(`${baseURL}/shifts/requests/${requestId}`)
  .then(res => {
    console.log(res))
  })
  .catch(err => {
    console.log(err);
  })
}

const deleteUserShiftWhenTaken = (shift_id) => {
  axios.delete(`${baseURL}/shifts/user-shifts/${shift_id}`)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  })
}
