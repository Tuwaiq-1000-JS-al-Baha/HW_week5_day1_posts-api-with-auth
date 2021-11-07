const form= document.querySelector("form")
function signup(event){
    event.preventDefault()
    const firstName=form.elements.First.value
    const LastName=form.elements.Last.value
    const email=form.elements.email.value
    const password=form.elements.password.value
    const Photo=form.elements.Photo.value
    const body={
        firstName:firstName,
        lastName:LastName,
        email:email,
        password:password,
        photo:Photo,

    }
    axios.post("https://vast-chamber-06347.herokuapp.com/api/user",body).then(response => {
        window.location.href="index.html"
        
    })
}