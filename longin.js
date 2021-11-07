const longIn = document.querySelector(".form")
function login(event) {
    event.preventDefault()
    const body = {
        email: longIn.elements.email.value,
        password: longIn.elements.password.value
    }
    axios.post(`https://vast-chamber-06347.herokuapp.com/api/user/auth`, body)
        .then(response => {
            const token = response.data
            localStorage.token = token
            window.location.href = "index.html"
        })

}