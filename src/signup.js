const baseURL = 'http://localhost:3000'

document.addEventListener('DOMContentLoaded', () => {
  $('.tab a').on('click', function (e) {
  e.preventDefault();
  console.log('eeeeee', e)
  $(this).parent().addClass('active');
  console.log('what is this', this)
  $(this).parent().siblings().removeClass('active');
  
  var href = $(this).attr('href');
  $('.forms > form').hide();

  console.log($('.forms > form'))
  $(href).fadeIn(500);
});

const signupButton = document.querySelector('#sign-up')
signupButton.onclick = signup

})

const signup = (event) => {
  event.preventDefault()
  console.log(event.target.parentNode)
  const signupForm = event.target.parentNode

  const first_name = document.querySelector('#first-name').value
  const last_name = document.querySelector('#last-name').value
  const email = document.querySelector('#email-signup').value
  const password = document.querySelector('#password-signup').value

  axios.post(`${baseURL}/signup`, {first_name, last_name, email, password})
    .then(result => {
console.log('xxxxxxx', result)
      
    })
    .catch(err => {
      console.log(err)
    })

}





