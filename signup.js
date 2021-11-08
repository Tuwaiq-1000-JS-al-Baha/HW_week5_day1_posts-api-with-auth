function signup(event) {
    event.preventDefault()

    const form = document.querySelector(".signupform")

    const usreBody = {
        firstName: form.elements.first.value,
        lastName: form.elements.last.value,
        photo: form.elements.photo.value,
        email: form.elements.email.value,
        password: form.elements.pass.value,
    }
    axios.post("https://vast-chamber-06347.herokuapp.com/api/user", usreBody)
        .then(response => {
            console.log("signup succes");

            window.location.href = "login.html"

        })
}
function logout() {
    localStorage.removeItem("token")
}