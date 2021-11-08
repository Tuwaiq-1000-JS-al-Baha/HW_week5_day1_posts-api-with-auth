const postsDiv = document.querySelector(".postsList")
const form = document.querySelector(".add")
const errorElement = document.querySelector(".errorElement")
let posts = []

getPosts()

// get posts
function getPosts() {
    axios.get("https://vast-chamber-06347.herokuapp.com/api/posts")
        .then(response => {
            posts = response.data
            console.log(posts);

            const postsSorted = posts.sort((postA, postB) => postB.dateCreated.localeCompare(postA.dateCreated));
            postsDiv.innerHTML = ""
            postsSorted.forEach(post => {
                const title = post.title
                const body = post.body
                const image = post.image
                const owner = post.owner
                const id = post._id


                let postElement = `
                <div class="postItem">
                    <div class = "post">
                        <h1> <span> ${title} </span> </h1>
                        <p> <span> ${body} </span> </p>
                        <img src="${image}" height="200px"> <br>
                        <button onclick="editPost(this)"> Edit </button> <br>
                        <button onclick="deletepost('${id}')"> Delete </button>
                    </div>
                    <form class="editForm">
                        <label> Title </label> <input type="text" name="title"> <br>
                        <label> Body </label> <input type="text" name="body"> <br>
                        <label> image </label> <input type="url" name="image"> <br>
                        <button onclick="confirmEdit(event, this, '${id}')"> Confirm </button>
                        </form>
                        <h3> Comments: </h3>
                
                `
                post.comments.forEach(comment => {
                    postElement += `
                    <div class="commentItem"> 
                    <div class="commentInfo commentInfo-${comment._id}"> 
                    <p> Comment: ${comment.comment}</p>
                    <button onclick="deleteComment('${post._id}' , '${comment._id}')"> Delete comment </button> 
                    <button onclick="editcomment( '${post._id}','${comment._id}')"> Edit Comment </button>
                    <br>
                    </div>
                    <form class="editComment editComment-${comment._id}">
                    <label> Comment : </label>
                    <input type="text" name="comment">
                    <button onclick="confirmcomment(event, '${post._id}','${comment._id}')"> confirm </button>
                    </form>
                    </div>
                    `

                })

                postElement += `
                    <form class="formComment-${post._id}" onsubmit="addComment(event, '${post._id}')"> 
                        <br>    
                        <label> Comment : </label>
                        <input type="text" name="comment">
                        <button> Add Comment </button> 
                    </form>
            
                 </div> `

                postsDiv.innerHTML += postElement


            });
        })
}

// ---------------- POSTs Side -----------------------
// add post
function addPost(event) {
    event.preventDefault()

    const title = form.elements.title.value
    const body = form.elements.body.value
    const image = form.elements.image.value

    const postsBody = {
        title: title,
        body: body,
        image: image
    }
    axios.post("https://vast-chamber-06347.herokuapp.com/api/posts", postsBody, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            const data = response.data
            console.log(data);

            getPosts()
        })
        .catch(error => {
            const errorMessege = error.response.data
            errorElement.innerHTML = errorMessege
        })
}

// edit post button 
function editPost(editButton) {
    const editForm = editButton.parentElement.nextElementSibling
    editForm.style.display = "inline"
    const post = editButton.parentElement
    post.style.display = "none"

    const title = post.querySelector("h1 span").innerHTML
    const body = post.querySelector("p span").innerHTML
    const image = post.querySelector("img").src

    const titleInput = editForm.elements.title

    const bodyInput = editForm.elements.body
    const imageInput = editForm.elements.image

    titleInput.value = title
    bodyInput.value = body
    imageInput.value = image

}

// confirm post button (Put)
function confirmEdit(event, confirmButton, id) {
    event.preventDefault()

    const editForm = confirmButton.parentElement

    const title = editForm.elements.title.value
    const body = editForm.elements.body.value
    const image = editForm.elements.image.value

    const postBody = {
        title: title,
        body: body,
        image: image
    }

    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, postBody, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            getPosts()
        })
}

//  delete Post
function deletepost(id) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            getPosts()
        })
}


// -------------------- Comments Side ---------------------
// add comment
function addComment(event, id) {
    event.preventDefault()
    const formComment = document.querySelector(`.formComment-${id}`)

    const commentBody = {
        comment: formComment.elements.comment.value,

    }
    axios.post(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment`, commentBody, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {

            getPosts()
        })
        .catch(error => {
            console.log(error.response.data)
        })
}





// edit comment 
function editcomment(postId, commentId) {
    const commentInfo = document.querySelector(`.commentInfo-${commentId}`)
    commentInfo.style.display = "none"

    const editformcomment = document.querySelector(`.editComment-${commentId}`)

    const postFound = posts.find(post => post._id === postId)
    const commentFound = postFound.comments.find(comment => comment._id === commentId)
    editformcomment.elements.comment.value = commentFound.comment

    editformcomment.style.display = "inline"

}
// confirm edit  (PUT)
function confirmcomment(event, postId, commentId) {
    event.preventDefault()
    const editformcomment = document.querySelector(`.editComment-${commentId}`)
    const commentBody = {
        comment: editformcomment.elements.comment.value
    }
    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`, commentBody, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            getPosts()
        })


}

// delete comment 
function deleteComment(postid, commentid) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${postid}/comment/${commentid}`, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            getPosts()
        })
}

function logout() {
    localStorage.removeItem("token")
}