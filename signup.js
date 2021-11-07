

function signup(event) {
    event.preventDefault()

    const form = document.querySelector("form")



    const body = {
        firstName: form.elements.first.value,
        lastName: form.elements.last.value,
        photo: form.elements.photo.value,
        email: form.elements.email.value,
        password: form.elements.password.value

    }

    axios.post("https://vast-chamber-06347.herokuapp.com/api/user", body)
        .then(response => {
            console.log("signup succses")
            // window.location.href = "index.html"
        })
}

function logout() {
    localStorage.removeItem("token")
}