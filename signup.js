const form = document.querySelector("form")

function signup(event) {
    event.preventDefault()

    const body = {
        firstName: form.elements.first.value,
        lastName: form.elements.last.value,
        email: form.elements.email.value,
        password: form.elements.password.value,
        photo: form.elements.photo.value
    }

    axios.post("https://vast-chamber-06347.herokuapp.com/api/user", body)
        .then(response => {
            console.log('signup success');
            window.location.href = "login.html"
        })

}

function logout() {
    localStorage.removeItem("token")
}