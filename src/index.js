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

        


     
    })
})

