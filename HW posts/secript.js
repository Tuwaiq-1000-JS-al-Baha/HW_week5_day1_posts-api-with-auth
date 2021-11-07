const postsDiv = document.querySelector(".postsList")
const form = document.querySelector(".addPost")
let posts


getPosts()


function getPosts() {
    axios.get("https://vast-chamber-06347.herokuapp.com/api/posts/")
        .then(response => {
            posts = response.data

            postsDiv.innerHTML = " "

            posts.forEach(post => {
                const title = post.title
                const body = post.body
                const image = post.image
                const id = post._id

                let postElement =
                    `
            <div class="postitem">
            <div class="postInfo">
                    <h2>Title: <span> ${title} </span> </h2>
                    <h5> body: <span>${body}</span> </h5>
                    <img src="${image}" height="100px"> <br>
                    <button onclick="editPost(this)"> Edit </button>
                        <button onclick="deletepost('${id}')"> Delete </button>
                    
                </div>
                <form  class="Postform">
                <label> Title </label> <input type="text" name="title"> <br>
                <label> Body</label> <input type="text" name="body"> <br>
                <label> Image </label> <input type="url" name="image"> <br>
                <button onclick="confirmEdit(event, this, '${id}')"> Confirm </button>

            </form>
            <h3>comments:</h3>
            </div>`

                post.comments.forEach(comment => {

                    postElement += `
    <div class="comment-item">
    <div class="comment-info-${comment._id}">
    <strong>Comment:${comment.comment}</strong>
    <button onclick="deleteComment('${post._id}','${comment._id}')">delete comment</button>
    <button onclick="eidtComment('${post._id}','${comment._id}')">eidt comment</button>
    </div>
    <form class="edit-form-comment edit-form-comment-${comment._id}" onsubmit="confirmEditComment(event,'${post._id}','${comment._id}')">
<label>comment:</label>
<textarea name="comment" cols="30"rows="1"></textarea>
<br>
<button>Confirm</button>
</form>

</div>`

                })
                postElement += `
  <form class="form-comment-${post._id}"onsubmit="addComment(event,'${post._id}')">
 
<label>comment:</label>
<textarea name="comment" cols="30"rows="1"></textarea>
<br>
<button>addcomment</button>
</form>

</div>`
                postsDiv.innerHTML += postElement

            })
        })
}
//add a post
function addPost(event) {
    event.preventDefault()
    const title = form.elements.title.value
    const body = form.elements.body.value
    const image = form.elements.image.value
    



    const postBody = {
        title: title,
        body: body,
        image: image,
    
    }
    axios.post("https://vast-chamber-06347.herokuapp.com/api/posts/", postBody,{
        headers:{
            Authorization:localStorage.token}
    })
        .then(response => {


            const data = response.data

            postsDiv.innerHTML = ""



            getPosts()
        })
    //  .catch(error => console.log(error.response.data))
}


//update a post
function editPost(editButton) {

    const postForm = editButton.parentElement.nextElementSibling
    postForm.style.display = "inline"
    const postInfo = editButton.parentElement
    postInfo.style.display = "none"

    const title = postInfo.querySelector("h2 span").innerHTML
    const body = postInfo.querySelector("h5 span").innerHTML
    const image = postInfo.querySelector("img").src


    const titleInput = postForm.elements.title
    const bodyInput = postForm.elements.body
    const imageInput = postForm.elements.image
    

    titleInput.value = title
    bodyInput.value = body
    imageInput.value = image

}

function confirmEdit(event, confirmButton, id) {
    event.preventDefault()
    const postForm = confirmButton.parentElement

    const title = postForm.elements.title.value
    const body = postForm.elements.body.value
    const image = postForm.elements.image.value
    

    const postBody = {
        title: title,
        body: body,
        image: image,
        
    }

    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, postBody,{
           headers:{
           Authorization:localStorage.token}
       }).then(response => {
        getPosts()
    })
// .catch(error => console.log(error.response.data))
}

//delet a post
function deletepost(id) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`)
        .then(response => {
            getPosts()
        })
    // .catch(error => console.log(error.response.data))
}

//add comment
function addComment(event, id) {
    event.preventDefault()

    const formComment = document.querySelector(`.form-comment-${id}`)

    const commentBody = {
        comment: formComment.elements.comment.value,
        

    }
    axios.post(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment`, commentBody)
        .then(response => {
            getPosts()
        })
        .catch(error => {
            console.log(error.response.data)

        })
}

function deleteComment(postId, commentId) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`)
        .then(response => {
            getPosts()
        })
        .catch(error => {
            console.log(error.response.data)

        })

}


function eidtComment(postId, commentId) {
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
        comment:editFormComment.elements.comment.value,
    

    }
    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`,commentBody)
        .then(response => {
            getPosts()
        })
        .catch(error => {
            console.log(error.response.data)

        })

}
function logout() {
    localStorage.removeItem("token")
    console.log("seccess")
}