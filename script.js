const postsDiv = document.querySelector(".posts-list")
const formAdd = document.querySelector(".form-add")

let posts=[]
getposts()

function getposts() {



    axios.get("https://vast-chamber-06347.herokuapp.com/api/posts").then(Response => {
         posts = Response.data
        const postsSorted = posts.sort((postA, postB) => postB.dateCreated.localeCompare(postA.dateCreated))

        console.log("postsSorted:", postsSorted)
        postsDiv.innerHTML = ""


        postsSorted.forEach(post => {

            const title = post.title
            const body = post.body
            const image = post.image
            const id = post._id

        let postElement = `<div class="post-item">
        <div class="post-info">
        <h2>Title:<span>${title}</span><h2>
        <h4>Body:<span>${body}</span></h4>
        <img src="${image}" widht=100px height=200px">
        <button onclick="deletePost('${id}')">Delete post</button>
        <button onclick="editPost(this)">Edit</button>
        </div>

        <form class="post-form">
        <label>title:</label><input type="text" name="title">
        <br>
        <label>body:</label><input type="text" name="body">
        <br>
        <label>image:</label><input type="url" name="image">
        <br>
       

        <button type="submit">add post</button>
<br>
<button onclick="deletePost"('${id}')">Delete post</button>
<button onclick="confirmEdit"(event, this, '${id}')">Confirm</button>

</form>

           <h3>Comment</h3>
           `
          post.comments.forEach(comment =>{
               postElement+=`
               <div class="comment-item">
               <div class="comment-info-${comment._id}"> 
               <strong>Owner:${comment.owner}</strong>
               <p>Comment:${comment.comment}</p>
               <button onclick="deleteComment('${post._id}','${comment._id}')">DeleteComment</button>
               <button onclick="editComment('${post._id}','${comment._id}')">EditComment</button>
               </div>

               <form class="edit-form-comment edit-form-comment-${comment._id}"onsubmit="confirmEditComment(event,'${post._id}','${comment._id}')">
               <label>Owner:</label>
               <input type="text" name="owner">
               <br>
               <label>Comment:</label>
               <textarea name="comment"cols="30" rows"1"></textarea>
               <br>
              
               <button>confirm</button>
               </form>
              </div>
               `
           })

               
           
              postElement+=`
              <form class="edit-form-comment${post._id} "onsubmit="addComment(event,'${post._id}')">
        <label>Owner</label>
        <input type="text" name="owner">
        <br>
        <label>Comment:</label>
        <textarea name="comment"cols="30" rows"1"></textarea>
        <br>
       
        <button>Add comment</button>
        </form>
        </div>
              
              `

            postsDiv.innerHTML += postElement
        });
    })

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
        headers: {
            Authorization:localStorage.token
        }
    })

        getposts()
    }
function editPost(editButton) {
    const postForm = editButton.parentElement.nextElementSibling
    postForm.style.display = "inline"

    const PostInfo = editButton.parentElement
    PostInfo.style.display = "none"

    const title = PostInfo.querySelector("h2 span").innerHTML
    const body = PostInfo.querySelector("h4 span").innerHTML
    const image = PostInfo.querySelector("img").src
   



    const titleInput = postForm.elements.title
    const bodyInput = postForm.elements.body
    const imageInput = postForm.elements.image
    

    titleInput.value = title
    bodyInput.value = body
    imageInput.value = image
   
}

function deletePost(id) {
    console.log(id)
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`)
        .then(Response => {
            getposts()
        })
}
function addpost(event) {
    event.preventDefault()
    const title = formAdd.elements.title.value
    const body = formAdd.elements.body.value
    const image = formAdd.elements.image.value
    



    const postBody = {
        title: title,
        body: body,
        image: image,

    }
    axios.post("https://vast-chamber-06347.herokuapp.com/api/posts", postBody, {
        headers: {
            Authorization:localStorage.token
        }
    })  
            getposts()
        }

function addComment(event,id){
    event.preventDefault()
    const formComment= document.querySelector(`.edit-form-comment${id}`)
    const commentBody = {
        comment:formComment.elements.comment.value,
         
    }
    axios.post(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment`,commentBody)
    .then(Response =>{
        console.log("added comment")
        getposts()
    })

        .catch(error =>{
            console.log(error.Response.data)
        })

}
function deleteComment(postId,commentId){
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`)
    .then(Response => {
        console.log("comment deleted")
        getposts()
    })
    .catch(error =>{
        console.log(error.Response.data)
    })
}

function editComment(postId,commentId){
    const commentInfo = document.querySelector(`.comment-info-${commentId}`)
    commentInfo.style.display="none"
    const editformComment=document.querySelector(`.edit-form-comment-${commentId}`)
    const postFound = posts.find(post=>post._id===postId)
    const commentFound = postFound.comments.find( comment=> comment._id === commentId)
    
     
     editformComment.elements.comment.value= commentFound.comment
     editformComment.style.display="inline"
}
function confirmEditComment(event,postId,commentId){
    event.preventDefault()
    const editformComment = document.querySelector(`.edit-form-comment-${commentId}`)
    const commentBody = {
        comment:editformComment.elements.comment.value,
        
    }


    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`,commentBody)
    .then(Response=>{
        console.log("comment edited")
        getposts()
    })
        .catch(error=>{
            console.log(error.Response.data)
                })
}