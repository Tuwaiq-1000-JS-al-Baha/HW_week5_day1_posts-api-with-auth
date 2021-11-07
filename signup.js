const form = document.querySelector('.form')
function signuo(event) {
    event.preventDefault()

    const body = {
        firstName: form.elements.first.value,
        lastName: form.elements.last.value,
        photo: form.elements.photo.value,
        email: form.elements.email.value,
        password: form.elements.password.value
    }
    axios.post(`https://vast-chamber-06347.herokuapp.com/api/user`, body).then(response => {
        window.location.href = "longin.html"

    })
}
function longout(){
    localStorage.removeItem("token")
}