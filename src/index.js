const baseURL = 'http://localhost:3000'

document.addEventListener('DOMContentLoaded', () => {

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

