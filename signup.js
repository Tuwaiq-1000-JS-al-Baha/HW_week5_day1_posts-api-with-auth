const form = document.querySelector("form")

function signUp(event){
    event.preventDefault()
   

    const firstName = form.elements.first.value
    const lastName = form.elements.last.value
    const email = form.elements.email.value
    const password = form.elements.password.value
    const  photo  = form.elements.photo.value


    const body = {
      
     firstName :firstName,
     lastName : lastName,
     email :email,
     photo: photo,
     password :password 
    }
    axios.post("https://vast-chamber-06347.herokuapp.com/api/user", body)
    .then(res => {
        console.log("singup accsse")
        window.location.href = "login.html"
    })
}

function logout(){
    localStorage.removeItem("token")
}