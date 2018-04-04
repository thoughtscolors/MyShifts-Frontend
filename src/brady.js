document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded in brady.js');

})




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

const createRequest = (employee_id, shift_id, start, date) => {
      axios.post(`${baseURL}/requests`, {employee_id, shift_id, start, date})
        .then(res => {
          console.log('res in brady53', res)
          const request_id = res.data.result.id
          const shift_id = res.data.result.shift_id
          const start = res.data.result.start.slice(0, 5)
          const shiftBox = document.getElementById(`${start}`)
          shiftBox.dataset.reqid = request_id

        })
        .catch(err => {
          console.log(err);
        })

}

const deleteRequestWhenTaken = (requestId) => {
  axios.delete(`${baseURL}/requests/${requestId}`)
    .then(res => {
      console.log(res )
    })
    .catch(err => {
      console.log(err);
    })
}

const updateEmployeesShifts = (employee_id, shift_id, userId) => {

  axios.patch(`${baseURL}/shifts`, {employee_id, shift_id, userId})
    .then(result => {

      console.log('result in updateEmployeesShifts',result)
    })

}

const logOut = () => {
  localStorage.clear()
  location.assign('index.html')
}
