function signUp(e){
    e.preventDefault()

    const form = document.querySelector('form')
    const userBody = {

        firstName : form.elements.firstName.value , 
        lastName : form.elements.lastName.value , 
        email: form.elements.email.value , 
        password : form.elements.password.value , 
        photo : form.elements.photo.value
    }
axios.post('https://vast-chamber-06347.herokuapp.com/api/user' , userBody)
    .then(response => {
        console.log("signup success")

        window.location.href = "signIn.html"
    })
    .catch(error => {
        console.log(error.response.data)
    })
}

function logOut(){
    localStorage.removeItem("token")
}