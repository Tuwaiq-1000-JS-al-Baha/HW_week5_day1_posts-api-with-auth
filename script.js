const postList = document.querySelector(".posts-list")
const addForm = document.querySelector(".add-form")
const errorElement = document.querySelector(".error-element")
let posts
getposts()

function getposts() {
    axios.get("https://vast-chamber-06347.herokuapp.com/api/posts")
        .then(response => {
            posts = response.data

            const postSorted = posts.sort((postA, postB) => postB.dateCreated.localeCompare(postA.dateCreated))
            console.log(postSorted)


            postList.innerHTML = ""
            posts.forEach(post => {
                const title = post.title
                const image = post.image
                const body = post.body
                const id = post._id
                const comments = post.comments
                console.log(comments)
                comments.forEach(comment => {
                    comment = comments.comment


                    const postComments = `
                    <div>
                    <p>${comment}</p>
                   
                    </div>
                    `
                    console.log(postComments)
                })
                let postElement = `
                <div class="post-element">
                <div class="post-info">
                <h1>${title}</h1>
                <img src="${image}" height="200px"/>
                <p>${body}</p>
                <button onclick="deletPost('${id}')"> Delet post </button>
                <button onclick="editPost(this)"> Edit post </button>
                </div>
                <form onsubmit="addPost(event)" class="edit-form">
        <label>title:</label>
        <input type="text" name="title"> </br>
        <label>image:</label>
        <input type="url" name="image"> </br>
        <label>body:</label>
        <input type="text" name="body"> </br>
     
        <button onclick="deletPost('${id}')"> Delet post </button>
        <button onclick="ConfirmPost(event, this, '${id}')"> Confirm post </button>
    </form>
            
                `

                post.comments.forEach(comment => {
                    postElement += `
                    <div class="comment-item">
                    <div class="comment-info-${comment._id}">
                   
                    <p>${comment.comment}</p>
                    <button onclick="deleteComment('${id}', '${comment._id}')">Delet Comment</button>
                    <button onclick="editComment('${id}', '${comment._id}')">Edit Comment</button>
                    </div>
                        <form class="edit-form-comment edit-form-comment-${comment._id}" onsubmit= "confirmEditComment(event, '${id}', '${comment._id}')">
                      
                <label>body:</label>
                <input type="text" name="comment"> </br>
                <button> confirm</button>
                        </form>
                    </div>
                    `
                })
                postElement += `
                <form class=" form-comment-${id}" onsubmit="addComment(event, '${post._id}')">
                
        <label>body:</label>
        <input type="text" name="comment"> </br>
        <button> Add comment</button>

                </form>

                </div>
                `
                postList.innerHTML += postElement

            })

        })
        .catch(error => {
            const errorMessage = error.response.data
            console.log(errorMessage)
        })
}

function addPost(e) {
    e.preventDefault()
    const title = addForm.elements.title.value
    const image = addForm.elements.image.value
    const body = addForm.elements.body.value
    const postBody = {
        title: title,
        image: image,
        body: body,

    }
    axios.post("https://vast-chamber-06347.herokuapp.com/api/posts", postBody, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            const data = response.data
            getposts()
        })
        .catch(error => {
            const errorMessage = error.response.data
            console.log(errorMessage)
            errorElement.innerHTML = errorMessage
        })
}



function deletPost(id) {


    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            getposts()

        })

        .catch(error => {
            const errorMessage = error.response.data
            console.log(errorMessage)

        })
}


function editPost(editButton) {
    const editForm = editButton.parentElement.nextElementSibling
    editForm.style.display = "inline"

    const postInfo = editButton.parentElement
    postInfo.style.display = "none"

    const title = postInfo.querySelector("h1").innerHTML
    const image = postInfo.querySelector("img").src
    const body = postInfo.querySelector("p").innerHTML



    const titleInput = editForm.elements.title
    const imageInput = editForm.elements.image
    const bodyInput = editForm.elements.body



    titleInput.value = title
    imageInput.value = image
    bodyInput.value = body

}


function ConfirmPost(event, confirmButton, id) {

    const editForm = confirmButton.parentElement

    const title = editForm.elements.title.value
    const image = editForm.elements.image.value
    const body = editForm.elements.body.value


    const postBody = {
        title: title,
        image: image,
        body: body,

    }
    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, postBody, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            getposts()

        })
        .catch(error => {
            const errorMessage = error.response.data
            console.log(errorMessage)

        })
}


function addComent(addComentButton, id) {
    const post = addComentButton.parentElement
    console.log(post)
    console.log(id)

    const comments = addComentButton.parentElement.nextElementSibling
    console.log(comment)
}


function addComment(event, id) {
    event.preventDefault()

    const formComment = document.querySelector(`.form-comment-${id}`)


    const commentBody = {
        comment: formComment.elements.comment.value,

    }

    axios.post(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment`, commentBody, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            console.log("added comment")
            getposts()
        })
        .catch(error => {
            console.log(error.response.data)
        })
}


function deleteComment(postId, commentId) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            console.log("comment deleted")
            getposts()
        })
        .catch(error => {
            console.log(error.response.data)
        })
}


function editComment(postId, commentId) {
    const commentInfo = document.querySelector(`.comment-info-${commentId}`)
    commentInfo.style.display = "none"

    const editFormComment = document.querySelector(`.edit-form-comment-${commentId}`)

    const postFound = posts.find(post => post._id === postId)
    const commentFound = postFound.comments.find(comment => comment._id === commentId)

    editFormComment.elements.comment.value = commentFound.comment


    editFormComment.style.display = "inline"
}

function confirmEditComment(event, postId, commentId) {
    event.preventDefault()

    const editFormComment = document.querySelector(`.edit-form-comment-${commentId}`)

    const commentBody = {
        comment: editFormComment.elements.comment.value,

    }

    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`, commentBody, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            console.log("comment edited")
            getposts()
        })
        .catch(error => {
            console.log(error.response.data)
        })
}

function logout() {
    localStorage.removeItem(".token")
}