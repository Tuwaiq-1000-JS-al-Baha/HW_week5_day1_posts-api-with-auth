

const form =document.querySelector("form")

function sinin(event){
    event.preventDefault()

        const email=form.email.value
        const password=form.password.value

        const body ={

            email:email,
            password:password
        }
     
        axios.post ("https://vast-chamber-06347.herokuapp.com/api/user/auth"  ,userBody)
        .then(response =>{
            const token =response.data

            localStorage.token=token

            window.location.href="index.html"

        }
            )

        function  logout(){
localStorage.removeItem("token")
        }
}