function login(event) {
    event.preventDefault()

    const form = document.querySelector("form")

    const body = {
        email: form.elements.email.value,
        password: form.elements.password.value
    }
    axios.post("https://vast-chamber-06347.herokuapp.com/api/user/auth", body)
        .then(response => {

            const token = response.data
            localStorage.token = token
            window.location.href = "index.html"
        })
}

function logout() {
    localStorage.removeItem(".token")
} 
