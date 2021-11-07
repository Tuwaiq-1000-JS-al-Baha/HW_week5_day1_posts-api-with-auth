const postDiv = document.querySelector(".post")
const postAdd = document.querySelector(".add")
let posts = []


getPosts()

function getPosts() {
    axios.get("https://vast-chamber-06347.herokuapp.com/api/posts")
        .then(res => {
            posts = res.data
            console.log(posts)

            const postsSorteds = posts.sort((postA, postB) => postB.dateCreated.localeCompare(postA.dateCreated))
            postDiv.innerHTML = ""
            posts.forEach(post => {

                const title = post.title
                const body = post.body
                const image = post.image
                //console.log(image)

                comments = post.comments
                //console.log(comments)
                const id = post._id


                let postItem =
                    `<div class="bigPost">
                        <div class="old-Post">
                            <h3> title :<span> ${title}</span> </h3>
                            
                            <p> body :<span> ${body}</span></p>
                            <img src="${image}" height="200px">
                            <button onclick="deletePost('${id}')"> delete</button>
                            <button onclick="editPost(this)"> Edit</button>
                            <br>
                            
                        </div>
                        <form class="new-Post">
                            <label> title </label> <input type="text" name="title">
                            <br>
                            <label>body</label><input type="text" name="body">
                            <br>
                            <label> image</label> <input type="url" name="image">
                            <br>
                            
                            <button onclick="deletePost('${id}')"> delete</button>
                            <button onclick="confirmEdit(event,this,'${id}')"> confirm </button>
                        </form>
                        <h3> Comments:</h3>`


                comments.forEach(comment => {
                    postItem += `
                            <div class="comment-item">
                            <div class="comment-info-${comment._id}">
                            <p> Comment:${comment.comment}</p>
                            <button onclick="deleteComment('${id}','${comment._id}')">Delete comment</button>
                           <button onclick="editComment('${id}','${comment._id}')">Edit comment</button>
                          </div>
                            <form class="edit-form-comment edit-form-comment-${comment._id}" onsubmit="confirmEditComment(event,'${id}','${comment._id}')">
                           
                                <lable>Comment:</lable>
                                <textarea name="comment" cols="30" rows="1"></textarea>
                                <br>
                                <button>confirm</button>
                            </form> 
                              
                    
                            </div>`
                })

                postItem += `
                        <form class="form-comment-${id}" onsubmit="addComment(event,'${id}')">
                        
                        <lable>Comment:</lable>
                        <textarea name="comment" cols="30" rows="1"></textarea>
                        <br>
                        <button>Add comment</button>
                        </form> 
                    
                        </div>`


                postDiv.innerHTML += postItem

            });
        })
}


//confirm comment

function confirmEditComment(event, postId, commentId) {
    event.preventDefault()

    const editFormComment = document.querySelector(`.edit-form-comment-${commentId}`)
    const commentBody = {
        comment: editFormComment.elements.comment.value
    }

    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`, commentBody, {
        headers: {
            authorization: localStorage.token
        }
    })
        .then(response => {
            console.log(" comment edited ")
            getPosts()
        })
        .catch(error => {
            console.log(error.response.data)
        })


}

// edit comments

function editComment(postId, commentId) {
    console.log(postId)

    const commentInfo = document.querySelector(`.comment-info-${commentId}`)
    commentInfo.style.display = "none"

    const editFormComment = document.querySelector(`.edit-form-comment-${commentId}`)
    //console.log(editFormComment)

    const postFound = posts.find(post => post._id === postId)
    console.log(postFound)

    const commentFound = postFound.comments.find(comment => comment._id === commentId)


    editFormComment.elements.comment.value = commentFound.comment


    editFormComment.style.display = "inline"



}


// delet comments

function deleteComment(id, commentId) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment/${commentId}`, {
        headers: {
            authorization: localStorage.token
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

//add comments

function addComment(event, id) {
    event.preventDefault()

    const formComment = document.querySelector(`.form-comment-${id}`)
    const commentBody = {
        comment: formComment.elements.comment.value,
    }

    axios.post(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment`, commentBody, {
        headers: {
            authorization: localStorage.token
        }
    })
        .then(response => {
            console.log("added comment ")
            getPosts()
        })
        .catch(error => {
            console.log(error.response.data)
        })


}



//add post in pot list :

function addPost(event) {
    event.preventDefault()
    const title = postAdd.elements.title.value
    //console.log(title)
    const body = postAdd.elements.body.value
    const image = postAdd.elements.image.value
    //console.log(image)


    const postBody = {
        title: title,
        body: body,
        image: image

    }


    axios.post("https://vast-chamber-06347.herokuapp.com/api/posts", postBody, {
        headers: {
            authorization: localStorage.token
        }
    })
        .then(res => {
            const posts = res.data
            console.log(posts)
            getPosts()

        })

}


// edit post in post list (editing post only )
function editPost(editButton) {
    const newPost = editButton.parentElement.nextElementSibling
    //console.log(newPost)
    newPost.style.display = "inline"
    const oldPost = editButton.parentElement
    oldPost.style.display = "none"
    console.log(oldPost)



    const title = oldPost.querySelector("h3 span").innerHTML
    const body = oldPost.querySelector("p span").innerHTML
    const image = oldPost.querySelector("img").src
    console.log(title)
    console.log(image)


    const titleInput = newPost.elements.title
    const bodyInput = newPost.elements.body
    const imageInput = newPost.elements.image



    titleInput.value = title
    bodyInput.value = body
    imageInput.value = image

}

// confirm use method put 


function confirmEdit(event, confirmButton, id) {
    event.preventDefault()

    const newPost = confirmButton.parentElement

    const title = newPost.elements.title.value
    const body = newPost.elements.body.value
    const image = newPost.elements.image.value


    const postBody = {
        title: title,
        body: body,
        image: image

    }
    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, postBody, {
        headers: {
            authorization: localStorage.token
        }
    })
        .then(res => {
            getPosts()
        })



}


//delete post 
function deletePost(id) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, {
        headers: {
            authorization: localStorage.token
        }
    })
        .then(res => {
            getPosts()
        })

}
// remove token 
function logout() {
    localStorage.removeItem("token")
}