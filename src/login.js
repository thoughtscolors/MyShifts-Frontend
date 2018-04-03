document.querySelector("#log-in").addEventListener("click", (event) => {
  event.preventDefault();
  console.log(event.target);
  const loginEmail = document.querySelector("#email-login");
  const attemptPass = document.querySelector("#password-login");
  const alert = document.querySelector(".alert");

  // location.assign('schedule.html');
  // localStorage.setItem("", JSON.stringify())


  axios.post(`${baseURL}/login`, {
    email: loginEmail.value,
    password: attemptPass.value
  })
  .then(result => {
    console.log('result in login.js = ', result);
    alert.style.display = "none";
    // renderPage(loginEmail);
  })
  .catch(error => {
    console.log('error in login.js = ', error.response);
    alert.style.display = "block";
  })
})
// if successful renderPage(email)
