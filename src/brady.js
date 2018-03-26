document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded in brady.js');
  addEventListeners()
})

const addEventListeners = () => {
  let confirmButton = document.getElementById('confirm')
  confirmButton.addEventListener('click', createRequestOnConfirm)

  let testButton = document.getElementById('test')
  testButton.addEventListener('click', addToUserShiftsWhenTaken)
}

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
      const shift_id = shift.dataset.shiftid
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
  renderPage()
}

const deleteRequestWhenShiftTaken = (requestId) => {
  axios.delete(`${baseURL}/shifts/requests/${requestId}`)
  .then(res => {
    console.log(res)
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

const addToUserShiftsWhenTaken = (shift_id) => {
  console.log(shift_id);
  axios.post(`${baseURL}/shifts/user_shifts/${shift_id}`)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  })
}
