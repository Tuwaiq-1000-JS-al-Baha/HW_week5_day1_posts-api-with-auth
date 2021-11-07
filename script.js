const PostsDiv = document.querySelector(".post-list")
const form = document.querySelector(".form-add")
let posts=[]
getPost()
const token=response.data
localStorage.token=token
function getPost() {
    axios.get("https://vast-chamber-06347.herokuapp.com/api/posts").then(function (response) {
        posts = response.data
        const postsSorted = posts.sort((postA, postB) => postB.dateCreated.localeCompare(postA.dateCreated))
        console.log("postssorted", postsSorted)
        PostsDiv.innerHTML = ""
        posts.forEach(function (post) {
            const title = post.title
            const body = post.body
            const image = post.image
            const owner = post.owner
            const id = post._id
            let postElement = ` 
            <div class="post-Item">
              <div class = "post-info">
                <h1> title:<span>${title}</span> </h1>
                <h4> Body:<span>${body}</span> </h4>
                <img src="${image}"height="300px">
                <p> owner:<span>${owner}</span></p>
                <button onclick="deletepost('${id}')"> Delete post </button>
                <button onclick="editPost(this)"> Edit </button>
                </div>
            <form class="post-Form">
                        <label> Title </label> <input type="text" name="title"> <br>
                        <label> Body </label> <input type="text" name="body"> <br>
                        <label> image </label> <input type="url" name="image"> <br>
                        <label> owner </label> <input type="text" name="owner"> <br>
                        <button onclick="deletepost('${id}')">Delete post</button>
                        <button onclick="confirmEdit(event, this, '${id}')"> Confirm </button>
                        </form>
                      <h3>Comments:</h3>
                      
                       `
            post.comments.forEach(function (comment) {
                postElement += `
                        <div class="comment-item"> 
                         <div class="comment-info-${comment._id}">
                        <strong>Owner:${comment.owner}</strong>
                        <p>Comment:${comment.comment}</p>
                        <button onclick="deleteComment('${id}','${comment._id}')"> Delete comment</button>
                        <button onclick="editComment('${id}','${comment._id}')"> Edit comment</button>
                        </div>
                        <form class="edit-form-comment edit-form-comment-${comment._id}" onsubmit="confirmEditComment(event,'${id}','${comment._id}')">
                         <label> owner: </label>
                         <input type="text" name="owner"> 
                         <br>
                         <label>Comment: </label> 
                         <textarea name="comment" cols="30" rows="1"> </textarea>
                         <br>
                         <button>  Confirm </button>
                         </form>
                         </div>
                    
                        `
            })
            postElement += `
                       <form class="form-comment-${id}" onsubmit="addComment(event,'${id}')">
                       <label> owner: </label>
                        <input type="text" name="owner"> 
                        <br>
                        <label>Comment: </label> 
                        <textarea name="comment" cols="30" rows="1"> </textarea>
                        <br>
                        <button> Add comment </button>
                        </form>
                        </div>
                       `

            PostsDiv.innerHTML += postElement
        })
    })

}
//Add post button
function addPost(event) {
    event.preventDefault()
    const title = form.elements.title.value
    const body  = form.elements.body.value
    const image = form.elements.image.value
    const owner = form.elements.owner.value
    const postsBody = {
        title: title,
        body: body,
        image: image,
        owner: owner,

    }
    axios.post("https:vast-chamber-06347.herpostsokuapp.com/api/post", postsBody,{
        headers: {Authorization:localStorage.token}
    })

        .then(function (response) {
            const data = response.data
            console.log(data);
            getPost()

        })
        .catch(function(error){
           console.log(error.response.data)
        })
   // document.write("Add has been done")
}
//  Confirm put button 
function confirmEdit(event, confirmButton, id) {
    event.preventDefault()
    const postForm = confirmButton.parentElement
    const title = postForm.elements.title.value
    const body = postForm.elements.body.value
    const image = postForm.elements.image.value
    const owner = postForm.elements.owner.value

    const postBody = {
        title: title,
        body: body,
        image: image,
        owner: owner
    }
    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, postBody,{
        headers: {Authorization:localStorage.token}})

        .then(function (response) {
            getPost()
        })

    //document.write("Update has been done")
}
// edit post button 
function editPost(editButton) {
    const editForm = editButton.parentElement.nextElementSibling
    editForm.style.display = "inline"
    const postInfo = editButton.parentElement
    postInfo.style.display = "none"

    const title = postInfo.querySelector("h1 span").innerHTML
    const body = postInfo.querySelector("h4 span").innerHTML
    const image = postInfo.querySelector("img").src
    const owner = postInfo.querySelector("p span").innerHTML


    const titleInput = editForm.elements.title
    const bodyInput = editForm.elements.body
    const imageInput = editForm.elements.image
    const ownerInput = editForm.elements.owner


    titleInput.value = title
    bodyInput.value = body
    imageInput.value = image
    ownerInput.value = owner
}

//  Delete Post
function deletepost(id) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`,{
        headers: {Authorization:localStorage.token}})
        .then(function (response) {
            getPost()
        })
    //document.write("Delete has been done")
}
function addComment(event, id) {
    event.preventDefault()
    const formComment = document.querySelector(`.form-comment-${id}`,)
    const commentBodey = {
        comment: formComment.elements.comment.value,
        owner: formComment.elements.owner.value,
    }
    axios.post(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment`, commentBodey,{
        headers: {Authorization:localStorage.token}})
        .then(response => {
            console.log("added comment")
            getPost()
        })
        .catch(error => {
            console.log(error.response.data)
        })

}
function deleteComment(postId, commentId) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`,{
        headers: {Authorization:localStorage.token}})

        .then(response => {
            console.log("comment deleted")
            getPost()
        })
        .catch(error => {
            console.log(error.response.data)
        })
}
function confirmEditComment(event, postId, commentId) {
    event.preventDefault()
    const editFormComment = document.querySelector(`.edit-form-comment-${commentId}`)
    const commentBodey = {
        comment: editFormComment.elements.comment.value,
        owner: editFormComment.elements.owner.value
    }
    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`, commentBodey,{
        headers: {Authorization:localStorage.token}})

        .then(response => {
            console.log("comment edited")
            getPost()
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
    const CommentFound = postFound.comments.find(comment => comment._id === commentId)
    editFormComment.elements.owner.value = CommentFound.owner
    editFormComment.elements.comment.value = CommentFound.comment
    editFormComment.style.display = "inline"



}