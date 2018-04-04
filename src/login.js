document.querySelector("#log-in").addEventListener("click", (event) => {
  event.preventDefault();
  const loginEmail = document.querySelector("#email-login");
  const attemptPass = document.querySelector("#password-login");
  const alert = document.querySelector(".alert");

  axios.post(`${baseURL}/login`, {
    email: loginEmail.value,
    password: attemptPass.value
  })
  .then(result => {
    alert.style.display = "none";

    const token = result.headers.authorization;
    localStorage.setItem("authorization", JSON.stringify(token));

    // load page of schedule
    location.assign("schedule.html");
  })
  .catch(error => {
    alert.style.display = "block";
  })
})
