const postsList = document.querySelector(".posts-list")
const addForm = document.querySelector(".add-form")
const errorElement = document.querySelector(".error-element")

let posts = []

getPosts()
function getPosts() {
    axios.get("https://vast-chamber-06347.herokuapp.com/api/posts")
        .then(response => {
posts=response.data

            const postsSorted = posts.sort((postA, postB) => postB.dateCreated.localeCompare(postA.dateCreated));

            postsList.innerHTML = ""

            postsSorted.forEach(post => {

                let postElemant = `
                <div class="post-item">
                    <div class = "post-info-${post._id}">
                    <strong>Owner:${post.owner}</strong>
                        <h3> Title: ${post.title} </h3>
                        <p> Body: ${post.body}</p>
                        <img src="${post.image}" height="200px">
                        <button onclick="editPost('${post._id}')"> Edit </button>
                        <button onclick="deletepost('${post._id}')"> Delete </button>
                    </div>
                    <form class="edit-form-${post._id}">
                        <label> Title </label>
                         <input type="text" name="title">
                          <br>
                        <label> Owner </label>
                         <input type="text" name="owner"> 
                         <br>
                        <label> Body </label>
                         <input type="text" name="body">
                          <br>
                        <label> Image </label> 
                        <input type="url" name="image">
                         <br>
                        <button onclick="confirmEdit(event,'${post._id}')"> Confirm </button>
                        </form>

                        <h3>Comment:</h3> `
                post.comments.forEach(comment => {
                    postElemant += `

                    <div class="comment-item">
             <div class="comment-info-${comment._id}">
            <strong>Owner:${comment.owner}</strong>
            <p>Comment:${comment.comment}</p>
            <button onclick="deleteComment('${post._id}','${comment._id}')">Delete comment</button>
            <button onclick="editComment('${post._id}','${comment._id}')">Edit comment</button>

            </div>
            <form class="edit-form-comment edit-form-comment-${comment._id}" onsubmit="confirmEditComment(event,'${post._id}','${comment._id}')">
 
                <label>comment:</label>
                <textarea name="comment" cols="30" rows="1"></textarea>
                <br> 
                <button>Confirm</button>
                </form>
         </div>
           `
           
                })
                postElemant += `
      <form class="form-comment-${post._id}" onsubmit="addComment(event, '${post._id}')">
               
                <textarea name="comment" cols="30" rows="1"></textarea>
                <br> 
                <button>Add comment</button>
                </form>
                </div>
                    `
                    postsList.innerHTML += postElemant
            })
            
        })
}

function addPost(event) {
    event.preventDefault()

    const title = addForm.elements.title.value
    // const owner = addForm.elements.owner.value
    const body = addForm.elements.body.value
    const image = addForm.elements.image.value
    
    const postBody = {
        title: title,
        // owner: owner,
        body: body,
        image: image
    }
    axios.post("https://vast-chamber-06347.herokuapp.com/api/posts", postBody)
        .then(response => {

            // posts=response.data

            console.log("added post")

          
            getPosts()
        })


}

// edit post button 
function editPost(id) {
    const formEdit = document.querySelector(`.edit-form-${id}`)

    console.log(posts)
    const postFound = posts.find(post => post._id === id)
    console.log(postFound)

    formEdit.elements.title.value = postFound.title
    formEdit.elements.body.value = postFound.body
    // formEdit.elements.owner.value = postFound.owner
    formEdit.elements.image.value = postFound.image

    formEdit.getElementsByClassName.display = "inline"

    const postInfo = document.querySelector(`.post-info-${id}`)
    postInfo.style.display = "none"
}
function confirmEdit(event, id) {
    
    event.preventDefault()

    const formEdit = document.querySelector(`.edit-form-${id}`)

    const postBody = {

        title: formEdit.elements.title.value,
        body: formEdit.elements.body.value,
        // owner: formEdit.elements.owner.value,
        image: formEdit.elements.image.value,
    }
    console.log(postBody)

    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, postBody,)
        .then(response => {
            console.log("edit success")
            getPosts()
        })
        .catch(error => {
            console.log(error.response.data)
        })
}
function deletepost(id) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`)
        .then(response => {
            console.log("delete success")
            getPosts()

        })
        .catch(error => {
            console.log(error.response.data)
        })

}

function addComment(event, id) {
    event.preventDefault()

    const formComment = document.querySelector(`.form-comment-${id}`)
    const commentBody = {

        comment: formComment.elements.comment.value,
        // owner: formComment.elements.owner.value
    }
    axios.post(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment`, commentBody)
        .then(response => {
            console.log("added comment")
            getPosts()
        })
        .catch(error => {
            console.log(error.response.data)
        })
}

function deletComment(postId,commentId){
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`)
    .then(response=>{

      console.log("comment deleted")
      getPosts()
    })
    .catch(error => {
      console.log(error.response.data)
    })
  }

  function confirmEditComment(event,postId,commentId){
event.preventDefault()

const editFormComment=document.querySelector(`.edit-form-comment-${commentId}`)

    const commentBody ={
        // comment:editFormComment.elements.comment.value,
        owner: editFormComment.elements.owner.value

    }
    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`,commentBody)
    .then(response=>{

      console.log("comment edited")
      getPosts()
    })

  }


  function editComment(postId,commentId){

const commentInfo =document.querySelector(`.comment-info-${commentId}`)
commentInfo.style.display="none"

const editFormComment=document.querySelector(`.edit-form-comment-${commentId}`)

const postFound=posts.find(post => post._id ===postId)

const commentFound = postFound.comments.find(comment => comment._id === commentId)

editFormComment.elements.owner.value=commentFound.owner
editFormComment.elements.comment.value=commentFound.comment

editFormComment.style.display="inline"


  }








