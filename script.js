const postsDiv = document.querySelector(".posts-list")
const formAdd = document.querySelector(".form-add")
///////////get post///////////
let posts = []
getPosts()
function getPosts() {
  axios.get("https://vast-chamber-06347.herokuapp.com/api/posts").then(res => {
    posts = res.data

    const postsStor = posts.sort((productA, productB) => productB.dateCreated.localeCompare(productA.dateCreated))
    ////
    postsDiv.innerHTML = ""

    postsStor.forEach(post => {
      const title = post.title
      const body = post.body
      const image = post.image
      //const owner = post.owner
      const id = post._id
      let postsElement = `
          
          <div class="card post-info" style="width: 18rem;">
          <img src="${image}" class="card-img-top" alt="...">
           <div class="card-body">
            <h5 class="card-title"> Title: <span>${title}</span></h5>
            <p class="card-text"><span>${body}</span></p>
           
            <button onclick="deletePost('${id}')"> Delete posts </buton>
            <button onclick="editPost(this)">Edit</button>

           </div>
          
            <form class="post-form">
            <label >title</label><input type="text" name="title">
            <br>
            <label >body:</label><input type="text" name="body">
            <br>
            <Label>iamge:</Label><input type="url" name="image">
            <br>
           
            <button onclick="deletePost('${id}')"> Delete posts </buton>
            <button onclick="confirmEdit(event,this,'${id}')">confirm post</button>
            </form>
            
            <h1>comment</h1>
            <!---->
            `

      post.comments.forEach(comment => {
        postsElement += `
            <div class="comment-item">
            <div class="comment-info-${comment._id}">
            <strong>owner: ${comment.owner}</strong>
            <p>comment: ${comment.comment}</p>
            <button onclick="deleteComment('${post._id}','${comment._id}')">delet comment</button>
            <button onclick="editComment('${post._id}','${comment._id}')">edit comment</button>
            </div>
            <form class="edit-form-comment edit-form-comment-${comment._id}" onsubmit="confirmEditComment(event, '${post._id}','${comment._id}')">
            
            <label >Comment:</label>
            <textarea cols="30" rows="1" name="comment"></textarea>
            <br>
            <button >confirm</button>
          
            </form>
           
            </div>
            `
      })
      postsElement += `
           <form class="form-comment-${post._id}" onsubmit="addComment(event,'${post._id}')">
            
            <label >Comment:</label>
            <textarea cols="30" rows="1" name="comment"></textarea>
            <br>
            <button>Add comment</button>
          
            </form>
            </div>
           
           `

      postsDiv.innerHTML += postsElement
    })
  })
}

/////////////////confirmmmm//////////////
function confirmEdit(event, confirmButton, id) {
  event.preventDefault()
  const postForm = confirmButton.parentElement
  const title = postForm.elements.title.value
  const body = postForm.elements.body.value
  const image = postForm.elements.image.value
  //const owner = postForm.elements.owner.value

  const postBody = {
    title: title,
    body: body,
    image: image,
    //owner: owner,
  }

  axios
    .put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, postBody,{
      headers :{
        Authorization: localStorage.token
        }
    })
    .then(res => {
      getPosts()
    })
    .catch(error => console.log(error.res.data))
}
/////editPost/////
function editPost(editButton) {
  const postForm = editButton.parentElement.nextElementSibling
  console.log(postForm)
  postForm.style.display = "inline"

  const postInfo = editButton.parentElement
  console.log(postInfo)
  ///
  postInfo.style.display = "none"

  const title = postInfo.querySelector("h5 span").innerHTML
  const body = postInfo.querySelector(" p span").innerHTML
  //const owner = postInfo.querySelector("a ").innerHTML
  const image = postInfo.querySelector(".card-img-top img").src
  ///console.log(iamge)

  const titleInput = postForm.elements.title
  const bodyInput = postForm.elements.body
  const imageInput = postForm.elements.iamge
  //const ownerInput = postForm.elements.owner

  titleInput.value = title
  bodyInput.value = body
  imageInput.value = image
  //ownerInput.value = owner
}

////////////delete/////
function deletePost(id) {
  console.log(id)
  axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`,{
    headers :{
      Authorization: localStorage.token
      }
  })
  .then(res => {
    getPosts()
  })
}

////////// post add//////
function addPost(event) {
  event.preventDefault()

  const title = formAdd.elements.title.value
  const body = formAdd.elements.body.value
  const image = formAdd.elements.image.value
  //const owner = formAdd.elements.owner.value

  const postBody = {
    title: title,
    body: body,
    image: image,
   // owner: owner,
  }

  axios.post("https://vast-chamber-06347.herokuapp.com/api/posts", postBody,{
    headers :{
      Authorization: localStorage.token
      }
  })
  .then(response => {
    const data = response.data

    getPosts()
  })
}

////////addd commenttt
function addComment(event, id) {
  event.preventDefault()

  const formComment = document.querySelector(`.form-comment-${id}`)

  const commentBody = {
    comment: formComment.elements.comment.value,
    //owner: formComment.elements.owner.value,
  }

  axios.post(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment`, commentBody,{
    headers :{
      Authorization: localStorage.token
      }
  })
  .then(res => {
    console.log("added comment")
    getPosts()
  })
  /*.catch(error => {
console.log(error.res.data)

})*/
}
////delet commmmmmmment//////
function deleteComment(postId, commentId) {
  axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`,{
    headers :{
      Authorization: localStorage.token
      }
  })
  .then(res => {
    console.log("delet comment")
    getPosts()
  })
}
////edit comment
function editComment(postId, commentId) {
  const commentInfo = document.querySelector(`.comment-info-${commentId}`)
  commentInfo.style.display = "none"

  const editFormComment = document.querySelector(`.edit-form-comment-${commentId}`)

  const postFound = posts.find(post => post._id === postId)

  const commentFound = postFound.comments.find(comment => comment._id === commentId)

  editFormComment.elements.comment.value = commentFound.comment
  //editFormComment.elements.owner.value = commentFound.owner

  editFormComment.style.display = "inline"
}

////////confirm comment
function confirmEditComment(event, postId, commentId) {
  event.preventDefault()

  const editFormComment = document.querySelector(`.edit-form-comment-${commentId}`)
  console.log(editFormComment)
  const commentBody = {
    comment: editFormComment.elements.comment.value,
   // owner: editFormComment.elements.owner.value,
  }

  axios
    .put(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`, commentBody,{
      headers :{
        Authorization: localStorage.token
        }
    })
    .then(res => {
      console.log("comment edit")
      getPosts()
    })
    .catch(error => {
      console.log(error.res.data)
    })
}