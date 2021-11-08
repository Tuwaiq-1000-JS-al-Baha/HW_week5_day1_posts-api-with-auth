const postsList = document.querySelector(".list-post")
const addForm = document.querySelector(".add-form")
const errorElement = document.querySelector(".error-element")
let posts = []
getPosts()
function getPosts() {
  axios.get("https://vast-chamber-06347.herokuapp.com/api/posts").then(response => {
    // console.log(response)
    posts = response.data
    //console.log(posts)
    const postsSorted = posts.sort((postA, postB) => postB.dateCreated.localeCompare(postA.dateCreated))
    console.log("post sorted:", postsSorted)
    postsList.innerHTML = ""
    postsSorted.forEach(post => {
      let postElement = `
   <div class="post-item"> <!-- الديف الكبيرهههه فتحتها هنا وتقفيلتها تحت اخر شي   -->
    <div class="post-info-${post._id}">
        <strong>owner:${post.owner}</strong>
        <h3>title:${post.title}</h3>
        <img src="${post.image}" width="200px" weidth="200px">
        <p>body:${post.body}</p>
        <button onclick="deletePost('${post._id}')"> delete</button>
            <button onclick="editPost('${post._id}')"> Edit</button>
    </div>
    <form class="edit-form edit-form-${post._id}">
        <label>title:</label>
        <input type="text" name="title">
        <br>
        <label>image:</label>
        <input type="url" name="image">
        <br>
        <label>body:</label>
        <textarea name="body" cols="30" rows="3"></textarea>
        <br>
        <label>owner:</label>
        <input type="text" name="owner">
        <br>
        <p class="error-element"></p>
        <button onclick="confirmEdit(event,'${post._id}')"> confirm </button>
    </form>

    
    <h1>Conmment:</h1>
    `

      post.comments.forEach(comment => {//هنا حطينا كومنت  لكل id
        postElement += `
        <div class="comment-item">  
        <div class="comment-info-${comment._id}">   
        <strong>owner:${comment.owner}</strong>
        <p>Comment:${comment.comment}</p>
        <button onclick="deleteComment('${post._id}','${comment._id}')">delete comment</button>
        <button onclick="editComment('${post._id}','${comment._id}')">Edit comment</button>

</div>
        <form class="edit-form-comment edit-form-comment-${comment._id}"onsubmit="confirmEditComment( event,'${post._id}','${comment._id}')">
        <label>owner:</label>
        <input type="text" name="owner">
        <br>
        <label>Comment:</label>
        <textarea name="comment"  cols="30" rows="1"></textarea>
        <br>
             <button > confirm</button>
             </form>
            
       </div> 
       `



      })

      
  ////سوينا المكان الفورم للكومنت 
      postElement += `   
   <form class="form-comment-${post._id}"onsubmit="addComment( event,'${post._id}')">
   <label>owner:</label>
        <input type="text" name="owner">
        <br>
        <label>Comment:</label>
        <textarea name="comment"  cols="30" rows="1"></textarea>
        <br>
        <button> Add comment</button>
        </form>
        </div>
        `

      postsList.innerHTML += postElement
    })
  })
  /**  .catch(error=>{
            const errorMessage=error.response.data
            console.log(errorMessage)
        })*/
}
/*-----------------------POST---------------------------*/
function addPost(event) {
  event.preventDefault()

  const title = addForm.elements.title.value
  const body = addForm.elements.body.value
  const image = addForm.elements.image.value
  const owner = addForm.elements.owner.value
  const postBody = {
    title: title,
    body: body,
    image: image,
    owner: owner,
  }
  axios
    .post("https://vast-chamber-06347.herokuapp.com/api/posts", postBody,{
        headers:{
          
            Authorization:localStorage.token
        }
        })
    .then(response => {
      console.log("added post")
      errorElement.innerHTML = ""
      addForm.rest()
      getPosts()
    })
    .catch(error => {
      console.log(error.response.data)
    })
}
/*----------------------------EDITE------------------------------*/
function editPost(id) {
  const formEdit = document.querySelector(`.edit-form-${id}`)
  console.log(posts)
  const postFound = posts.find(post => post._id === id)
  console.log(postFound)
  formEdit.elements.title.value = postFound.title
  formEdit.elements.body.value = postFound.body
  formEdit.elements.owner.value = postFound.owner
  formEdit.elements.image.value = postFound.image
  formEdit.style.display = "inline"
  const postInfo = document.querySelector(`.post-info-${id}`)
  postInfo.style.display = "none"
}
/*------------------------CONFIRM------put-------------------------------*/
function confirmEdit(event, id) {
  event.preventDefault()
  const formEdit = document.querySelector(`.edit-form-${id}`)
  const postBody = {
    ///هنا ثابتهنفس الي في بوست مان
    title: formEdit.elements.title.value,
    body: formEdit.elements.body.value,
    image: formEdit.elements.image.value,
    owner: formEdit.elements.owner.value,
  }
  axios
    .put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, postBody,{
        headers:{
          
            Authorization:localStorage.token
        }
        })
    
    .then(response => {
      getPosts()
    })
    .catch(error => {
      console.log(error.response.data)
    })
}
/*------------------------DELETE-----------------------------------------*/
function deletePost(id) {
  console.log(id)
  axios
    .delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`,{
        headers:{
          
            Authorization:localStorage.token
        }
        })
    .then(response => {
      getPosts()
    })
    .catch(error => {
      console.log(error.response.data)
    })
}

/// بالاي دي عشان اعرف اضيف على اي (اي idدي) عند ي كثير نستخرج القيم عشان نضيفها في الكومنت

function addComment(event, id) {
  event.preventDefault()

  const formComment = document.querySelector(`.form-comment-${id}`)

  const commentBody = {
    comment: formComment.elements.comment.value,
    owner: formComment.elements.owner.value,
  }

  axios
    .post(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment`, commentBody)
    .then(response => {
      console.log("added comment")
      getPosts()
    })
    .catch(error => {
      console.log(error.response.data)
    })
}


function deleteComment(postId,commentId){
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/ ${commentId}`)
    .then (response=>{
        console.log("comment deleted")
        getPosts()
    })
   .catch(error =>{
    console.log(error.response.data)
   })
}
 


function editComment(postId,commentId){
const commentInfo=document.querySelector(`.comment-info-${commentId}`)
commentInfo.style.display="none"

const editFormComment=document.querySelector(`.edit-form-comment-${commentId}`)

const postFound =posts.find(post=>post._id===postId)

const commentFound=postFound.comments.find(comment=>comment._id===commentId)

editFormComment.elements.owner.value=commentFound.owner
editFormComment.elements.comment.value=commentFound.comment

editFormComment.style.display="inline"
}


//////
function confirmEditComment(event,postId,commentId){
    event.preventDefault()

        const editFormComment=document.querySelector(`.edit-form-comment-${commentId}`)
        const commentBody = {
            comment:editFormComment.elements.comment.value,
            owner:editFormComment.elements.owner.value

     }
    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`,commentBody)
    .then(response=>{
        console.log("comment edited")
        getPosts()
    })
   
    .catch(error=>{
        console.log(error.response.data)
    })
    }


   