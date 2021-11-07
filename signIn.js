function signIn(e){
    e.preventDefault()

    const form = document.querySelector('form')
    const userBody = {

      
        email: form.elements.email.value , 
        password : form.elements.password.value , 
        
    }
axios.post('https://vast-chamber-06347.herokuapp.com/api/user/auth' , userBody)
    .then(response => {
        console.log("signup success")

        const token = response.data

            localStorage.token = token
        window.location.href = "index.html"
    })
}

function logOut(){
    localStorage.removeItem("token")
}