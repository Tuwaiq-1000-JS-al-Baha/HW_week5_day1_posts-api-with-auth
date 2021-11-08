function signin(event) {
    event.preventDefault()

    const form = document.querySelector(".form")

    const infoBody = {
        email : form.elements.email.value ,
        password : form.elements.password.value
    }

    axios.post("https://vast-chamber-06347.herokuapp.com/api/user/auth" , infoBody)
    .then(function (response) {
        const item = response.data

        localStorage.token = item
        window.location.href = "index.html"
    })

}
function logout() {
    localStorage.removeItem("token")
}