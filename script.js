const PostsDiv = document.querySelector(".posts-list")
const postsAdd = document.querySelector(".posts-add")
const errorElement = document.querySelector(".error-element")


let posts = []
getPosts()
// GET POST //////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getPosts() {
    axios.get("https://vast-chamber-06347.herokuapp.com/api/posts")
        .then(response => {
            posts = response.data
            const PostsSorted = posts.sort((postA, postB) => postB.dateCreated.localeCompare(postA.dateCreated))
            /* empty the array in the list becuae input agine*/
            PostsDiv.innerHTML = ""

            PostsSorted.forEach(post => {
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
                let PostsElement = `
                <div class="post-item">
                <div class="postinfo">
                    <h2>title:</h2>
                    <h3>${title}</h3>
                    <img src="${image}" width="200px" weidth="200px">
                    <h2>body:</h2>
                    <p>${body}</p>
                    <button onclick="deletePost('${id}')"> delete post</button>
                    <button onclick="editPost(this)"> Edit post </button>
                </div>
                <form onsubmit="addPost(event)" class="edit-form">
                    <label>title:</label>
                    <input type="text" name="title">
                    <br>
                    <label>image:</label>
                    <input type="url" name="image">
                    <br>
                    <label>body:</label>
                    <input type="text" name="body"> </br>
                    <br>
                    <button onclick="deletPost('${id}')"> Delet post </button>
                    <button onclick="confirmpost(event,this,'${id}')"> confirm post </button>
                </form>`

                post.comments.forEach(comment => {
                    PostsElement += `
         <div class="commentitems">
        <div class = "comment-info-${comment._id}" >
        <p>Comment: ${comment.comment} </p>
        <button onclick = "deleteComment('${id}' ,'${comment._id}')">Delete comment </button>
        <button onclick = "editComment('${id}' ,'${comment._id}')">Edit comment </button>
        </div>
        
       <form class="edit-form-comment edit-form-comment-${comment._id}" onsubmit="confirmEditComment(event, '${id}' , '${comment._id}')">
       <label>body:</label>
       <input type="text" name="comment">
       <button>Confirm</button>
       </form>
       </div>
        `
    })
                PostsElement += ` 
      <form class="form-comment-${id}" onsubmit="addComment(event, '${post._id}')">
      
      <label>body:</label>
      <input type="text" name="comment">
        <br>
        <button>Add comment </button>
        </form>
        </div> `
                PostsDiv.innerHTML += PostsElement
            })
        })
        .catch(error => {
            const errorMessage = error.response.data
            console.log(errorMessage)
        })
}

//ADD POST//////////////////////////////////////////////////////////////////////////////////////////
function addPosts(event) {
    event.preventDefault()
    const title = postsAdd.elements.title.value
    const body = postsAdd.elements.body.value
    const image = postsAdd.elements.image.value

    const postBody = {
        title: title,
        body: body,
        image: image,
    }
    /* console.log(postBody)*/
    axios.post("https://vast-chamber-06347.herokuapp.com/api/posts", postBody, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            const data = response.data
            getPosts()
        })
}
//Delet///////////////////////////////////////////////////////////////////////////////////////////////////////
function deletePosts(id) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            getPosts()
        })
        .catch(error => {
            const errorMessage = error.response.data
            console.log(errorMessage)

        })  
}
//EDIT POST//////////////////////////////////////////////////////////////////////////////////////////////////////
function editPosts(editButton) {
    const PostesForm = editButton.parentElement.nextElementSibling
    PostesForm.style.display = "inline"

    const postinfo = editButton.parentElement
    postinfo.style.display = "none"

    const title = postinfo.querySelector("h2 span").innerHTML
    const body = postinfo.querySelector("h4 span").innerHTML
    const image = postinfo.querySelector("img").src

    const titleInput = PostesForm.elements.title
    const bodyInput = PostesForm.elements.body
    const imageInput = PostesForm.elements.image

    titleInput.value = title
    bodyInput.value = body
    imageInput.value = image
}
//CONFIRM EDIT////////////////////////////////////////////////////////////////////////////////////////////
function confirmEdit(event, confirmButton, id) {
    event.preventDefault()
    const PostesForm = confirmButton.parentElement

    /* Get Information Form  */
    const title = PostesForm.elements.title.value
    const body = PostesForm.elements.body.value
    const image = PostesForm.elements.image.value

    const postBody = {
        title: title,
        body: body,
        image: image,
    }

    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, postBody, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            getPosts()
        })
        .catch(error => {
            const errorMessage = error.response.data
            console.log(errorMessage)

        })
}



//ADD COMMENT//////////////////////////////////////////////////////////////////////////////////////////////////////////
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
            getPosts()
        })
        .catch(error => {
            console.log(error.response.data)
        })
}
//////Delete comment////////////////////////////////////////////////////////////////////////////////////////////////
function deleteComment(postId, commentId) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            console.log("comment deleted")
            getPosts()

        })
        .catch(error => {
            console.log(error.response.data)
        })
}

//Edit COMMENT////////////////////////////////////////////////////////////////////////////////////////////////////////
function editComment(postId, commentId) {
    const commentInfo = document.querySelector(`.comment-info-${commentId}`)
    commentInfo.style.display = "none"

    const editFormComment = document.querySelector(`.edit-form-comment-${commentId}`)
    const postFound = posts.find(post => post._id === postId)

    const commentFound = postFound.comments.find(comment => comment._id === commentId) 
       editFormComment.elements.comment.value = commentFound.comment

    editFormComment.style.display = "inline"
}

//confirm COMMENT/////////////////////////////////////////////////////////////////////////////////////////////////////
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
            getPosts()
        })
        .catch(error => {
            console.log(error.response.data)
        })
}

function logout() {
    localStorage.removeItem(".token")
}