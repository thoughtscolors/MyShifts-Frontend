document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded in brady.js');
  // addEventListeners()
})

// const addEventListeners = () => {
//   let confirmButton = document.getElementById('confirm')
//   confirmButton.addEventListener('click', createRequestOnConfirm)
//   confirmButton.addEventListener('click', changeToPending)

//   let testButton = document.getElementById('test')
//   testButton.addEventListener('click', addToUserShiftsWhenTaken)
//   testButton.addEventListener('click', deleteUserShiftWhenTaken)
//   testButton.addEventListener('click', deleteRequestWhenTaken)
// }


const toggleStage = (event) => {
  const button = event.target
  const shiftBox = event.target.parentNode

  if(shiftBox.classList.contains('current')) {
    if (button.textContent !== "Cancel") {
      button.textContent = "Cancel"
    } else {
      button.textContent = "Release Shift"
    }

    if (shiftBox.classList.contains('staged-release')) {
      shiftBox.classList.remove('staged-release')
       } else {
       shiftBox.classList.add('staged-release')
      }
  }

  if(shiftBox.classList.contains('request')) {

    if (button.textContent !== "Cancel") {
      button.textContent = "Cancel"
    } else {
      button.textContent = "Take Shift"
    }

    if (shiftBox.classList.contains('staged-take-shift')) {
      shiftBox.classList.remove('staged-take-shift')
    } else {
      shiftBox.classList.add('staged-take-shift')
    }
  }
}

// const stageRelease = (event) => {
//   console.log('clicked', event.target);
//   let button = event.target
//   if (button.textContent !== "Cancel") {
//     button.textContent = "Cancel"
//   } else {
//     button.textContent = "Release Shift"
//   }
//   let userDiv = event.target.parentNode
//   if (userDiv.classList.contains('staged-release')) {
//     userDiv.classList.remove('staged-release')
//   } else {
//     userDiv.classList.add('staged-release')
//   }

// }

// const stageTakeShift = () => {
//   console.log('clicked');
//   let button = event.target
//   if (button.textContent !== "Cancel") {
//     button.textContent = "Cancel"
//   } else {
//     button.textContent = "Take Shift"
//   }
//   let userDiv = event.target.parentNode
//   if (userDiv.classList.contains('staged-take-shift')) {
//     userDiv.classList.remove('staged-take-shift')
//   } else {
//     userDiv.classList.add('staged-take-shift')
//   }
// }

const createRequest = (employee_id, shift_id, start, date) => {
      axios.post(`${baseURL}/shifts/requests`, {employee_id, shift_id, start, date})
      .then(res => {
        console.log('res in brady53', res)
        const request_id = res.data.result.id
        const shift_id = res.data.result.shift_id
        const start = res.data.result.start.slice(0, 5)

        console.log('yyyyyyyy', start)
        const shiftBox = document.getElementById(`${start}`)

        console.log('sssssss', shiftBox)
        shiftBox.dataset.reqid = request_id

        releaseShift(shift_id, request_id)
      })
      .catch(err => {
        console.log(err);
      })

}

// const changeToPending = () => {
//   const shifts = document.querySelectorAll('.shift')

//   shifts.forEach(shift => {
//     if (shift.classList.contains('staged')) {
//       shift.classList.remove('staged')
//         shift.classList.add('pending')

//     }
//   })
// }

const deleteRequestWhenTaken = (requestId) => {
  axios.delete(`${baseURL}/shifts/requests/${requestId}`)
  .then(res => {
    console.log(resssssssss )
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

const addToUserShiftsWhenTaken = (shift_id, start, date, request_id) => {
  console.log(shift_id);
  axios.post(`${baseURL}/shifts/user-shifts`, { shift_id, start, date, request_id })
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  })
}
