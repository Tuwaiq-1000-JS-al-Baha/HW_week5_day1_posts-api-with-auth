function signUp(event) {
    event.preventDefault()

    const form = document.querySelector("form")

    const userBody = {
        firstName: form.elements.firstName.value,
        lastName: form.elements.lastName.value,
        photo: form.elements.photo.value,
        email: form.elements.email.value,
        password: form.elements.password.value,
    }
    axios.post("https://vast-chamber-06347.herokuapp.com/api/user", userBody)
        .then(response => {
            console.log("signup success")

            window.location.href = "index.html"
        })

}
function logout() {
    localStorage.removeItem("token")
}