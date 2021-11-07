const postsDiv = document.querySelector(".posts-list")
const formAdd = document.querySelector(".form-add")
const errorElement = document.querySelector(".error-element")

let posts
getPosts()
function getPosts() {
    axios.get("https://vast-chamber-06347.herokuapp.com/api/posts")
        .then(response => {
            posts = response.data // تعطينا جميع البيانات في posts


            const postsSorted = posts.sort((postA, postB) => postB.dateCreated.localeCompare(postA.dateCreated))

            postsDiv.innerHTML = ""

            postsSorted.forEach(post => {

                let postElement = `
                <div class="post-item">
                <div class="post-info-${post._id}"> 
                <h3 class="h3-title">${post.title}</h3>
                <br>
                <h3 class="h3-body">${post.body}</h3>
                <br>
                <img src="${post.image}" width="200px">
                <br>
                <button onclick="editBtn('${post._id}')">Edit</button>
                <button onclick="deleteBtn('${post._id}')">Delete</button>
                </div>
                <form class="post-form post-form-${post._id}">
                <label>Title:</label><input type="text" name="title">
                <br>
                <label>Body:</label><input type="text" name="body">
                <br>
                <label>Image:</label><input type="url" name="image">
                <br>
                <button onclick="confirmEdit(event, '${post._id}')">confirm</button>
                </form>
                <h3>Comment:</h3>
                `
                post.comments.forEach(comment => {
                    postElement += `
                    <div class="comment-item">
                    <div class="comment-info-${comment._id}">
                    <p>Comment:${comment.comment}</p>
                    <button onclick="deleteComment('${post._id}', '${comment._id}')">Delete</button>
                    <button onclick="editComment('${post._id}', '${comment._id}')">Edit</button>
                    </div>
                    <form class="edit-form-comment edit-form-comment-${comment._id}" onsubmit="confirmEditComment(event, '${post._id}', '${comment._id}')">
                    <label>Comment:</label>
                    <textarea name="comment" cols="30" rows="1"> </textarea>
                    <br>
                    <button>Confirm</button>
                    </form>
                    </div>`
                })
                postElement += `
                <form class="form-comment-${post._id}" onsubmit="addComment(event, '${post._id}')">
                <label>Comment:</label>
                <textarea name="comment" cols="30" rows="1"> </textarea>
                <br>
                <button>Add comment</button>
                </form>
                
                
                </div>
                `

                postsDiv.innerHTML += postElement
            })
        })
        .catch(error => {
            const errorMessage = error.response.data
            console.log(errorMessage)
        })
}

function addPosts(event) {
    event.preventDefault() // عشان ماتتحدث الصفحة

    const title = formAdd.elements.title.value
    const body = formAdd.elements.body.value
    const image = formAdd.elements.image.value


    const postbody = {
        title: title,
        body: body,
        image: image,
    }

    axios.post(`https://vast-chamber-06347.herokuapp.com/api/posts`, postbody, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            console.log("added post")
            errorElement.innerHTML = ""
            formAdd.reset()

            getPosts()

        })
        .catch(error => {
            const errorMessage = error.response.data
            console.log(errorMessage)
            errorElement.innerHTML = errorMessage
        })


}

function editBtn(id) {

    const formEdit = document.querySelector(`.post-form-${id}`)
    console.log(formEdit)

    const postFound = posts.find(post => post._id === id)

    console.log(postFound)

    formEdit.elements.title.value = postFound.title
    formEdit.elements.body.value = postFound.body
    formEdit.elements.image.value = postFound.image

    formEdit.style.display = "inline"

    const postInfo = document.querySelector(`.post-info-${id}`)

    postInfo.style.display = "none"
}

function confirmEdit(event, id) {
    event.preventDefault()

    const formEdit = document.querySelector(`.post-form-${id}`)


    const postbody = {
        title: formEdit.elements.title.value,
        body: formEdit.elements.body.value,
        image: formEdit.elements.image.value,
    }

    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, postbody, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            console.log("edit success")
            getPosts()

        })
        .catch(error => {
            console.log(error.response.data)
        })
}

function deleteBtn(id) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            console.log("delete success")
            getPosts()

        })
        .catch(error => {
            console.log(error.response.data)
        })

}


//comments

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
}

function deleteComment(postId, commentId) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            console.log("delete comment")

            getPosts()
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
            console.log(" comment edit")
            getPosts()
        })
        .catch(error => {
            console.log(error.response.data)
        })
}
