const form = document.querySelector(".formsignup")

function signup(event) {
    event.preventDefault()

    const form = document.querySelector(".formsignup")

    const infoBody = {
        firstName : form.elements.first.value ,
        lastName : form.elements.last.value ,
        email : form.elements.email.value ,
        password : form.elements.password.value ,
        photo : form.elements.img.value
    }
    axios.post("https://vast-chamber-06347.herokuapp.com/api/user" , infoBody)
    .then(function (response) {
        window.location.href ="login.html"
    })
}
function logout() {
    localStorage.removeItem("token")
} 