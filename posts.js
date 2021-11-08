const formAdd = document.querySelector(".formAdd")
const postsDiv = document.querySelector(".PostList")

let posts = []

getPosts()

////////////////////////////دالة get
function getPosts() {
  axios.get("https://vast-chamber-06347.herokuapp.com/api/posts").then(response => {
    posts = response.data

    const postsSorteds = posts.sort((postA, postB) => postB.dateCreated.localeCompare(postA.dateCreated))
    // console.log("posts sorted:",postsSorteds)
    postsDiv.innerHTML = ""

    postsSorteds.forEach(post => {
      const title = post.title
      const body = post.body
      const image = post.image

      const id = post._id

      let postsElement = `
 <div class ="post-item">
      <div class="post-info">
          <h2> title :<span>${title}</span></h2>
          <h4> body :<span>${body}</span></h4>
          <img src="${image}" height="200px">
         
        
          <button onclick="deletePost('${id}')"> Delete post </buton>
          <button onclick="editPost(this)">Edit</button>
      </div>
          <form class ="post-form">
          <label>Title:</label>
          <input type="text" name="title">
          <br>
          <label>Body:</label>
          <textarea name="body" cols="30" rows="3"></textarea>
          <br>
          <label>Image:</label>
          <input type="url" name="image">
          <br>
          <button onclick="deletePost('${id}')"> Delete post </buton>
          <button onclick="confirmEdit(event,this,'${id}')">  Confirm </button>
          
          </form>
          <h3> commments:</h3>
          `
      post.comments.forEach(comment => {
        postsElement += `
              <div class="comment-item">
               <div class="comment-info-${comment._id}">
                 
                  <p> comment:${comment.comment}</p>
                  <button onclick ="deletComment('${post._id}','${comment._id}')">Delet comment</button>
                  <button onclick ="editComment('${post._id}','${comment._id}')">Edit comment</button>
               </div>
               <form class ="edit-form-comment edit-form-comment-${comment._id}"onsubmit="confirmEditComment(event,'${post._id}','${comment._id}')">
                 <label>owner:</label>
                 
                 <label>comment:</label>
                 <textarea name ="comment" cols="30" rows="1"></textarea>
                 <button>confirm</button>
               </form>
             </div> `
      })
      postsElement += `
              <form class ="form-comment-${post._id}"onsubmit="addComment (event,'${post._id}')">
              
              
              <label>comment:</label>
              <textarea name ="comment" cols="30" rows="1"></textarea>

              <br>
              <button>add comment</button>
              
              </form>
              </div>
              
              `

      postsDiv.innerHTML += postsElement
    })
  })
}

////////////////////////////التعديل تاكيد//////////////////////
function confirmEdit(event, confirmButton, id) {
  event.preventDefault()

  const postForm = confirmButton.parentElement

  const title = postForm.elements.title.value
  const body = postForm.elements.body.value

  const image = postForm.elements.image.value

  const postBody = {
    title: title,
    body: body,
    owner: owner,
    image: image,
  }

  axios
    .put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, postBody , {
      headers: {
        Authorization: localStorage.token,
      },
    })
    .then(response => {
      getPosts()
    })
    .catch(error => {
      console.log(error.response.data)
    })
}

//////////////////////////////////تعديل///////////////////////////////////
function editPost(editButton) {
  const postForm = editButton.parentElement.nextElementSibling
  console.log(postForm)
  postForm.style.display = "inline"

  const postInfo = editButton.parentElement
  postInfo.style.display = "none"

  const title = postInfo.querySelector("h2 span").innerHTML
  const body = postInfo.querySelector("h4 span").innerHTML

  const image = postInfo.querySelector("img").src

  const titleInput = postForm.elements.title
  const bodyInput = postForm.elements.body

  const imageInput = postForm.elements.image

  titleInput.value = title
  bodyInput.value = body

  imageInput.value = image
}

///////////////////الحذف ////////////////////////
function deletePost(id) {
  console.log(id)
  axios
    .delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, {
      headers: {
        Authorization: localStorage.token,
      },
    })
    .then(response => {
      getPosts()
    })
    .catch(error => {
      console.log(error.response.data)
    })
}
//////////////////////////////الاضافه////////////////////////////////

function addPost(event) {
  event.preventDefault()

  const title = formAdd.elements.title.value
  const body = formAdd.elements.body.value

  const image = formAdd.elements.image.value

  const postBody = {
    title: title,
    body: body,

    image: image,
  }
  axios
    .post("https://vast-chamber-06347.herokuapp.com/api/posts", postBody , {
      headers: {
        Authorization: localStorage.token,
      },
    })
    .then(response => {
      const post = response.data
      console.log(post)
      getPosts()
    })
    .catch(error => {
      console.log(error.response.data)
    })
}
/////////comment//////////
function addComment(event, id) {
  event.preventDefault()

  const formComment = document.querySelector(`.form-comment-${id}`)
  const commentBody = {
    comment: formComment.elements.comment.value,
  }
  axios
    .post(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment`, commentBody , {
      headers: {
        Authorization: localStorage.token,
      },
    })
    .then(response => {
      console.log("add comment")
      getPosts()
    })
    .catch(error => {
      console.log(error.response.data)
    })
}
function deletComment(postId, commentId) {
  axios
    .delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}` , {
      headers: {
        Authorization: localStorage.token,
      },
    })
    .then(response => {
      console.log("comment deleted")
      getPosts()
    })
    .catch(error => {
      console.log(error.response.data)
    })
}

function confirmEditComment(event, postId, commentId) {
  event.preventDefault()
  const edditFormComment = document.querySelector(`.edit-form-comment-${commentId}`)
  console.log(edditFormComment) //

  const commentBody = {
    comment: edditFormComment.elements.comment.value,
  }
  axios
    .put(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`, commentBody , {
      headers: {
        Authorization: localStorage.token,
      },
    })
    .then(response => {
      console.log("comment edited")
      getPosts()
    })
    .catch(error => {
      console.log(error.response.data)
    })
}

function editComment(postId, commentId) {
  const commentInfo = document.querySelector(`.comment-info-${commentId}`)
  commentInfo.style.display = "none"

  const edditFormComment = document.querySelector(`.edit-form-comment-${commentId}`)
  const postfound = posts.find(post => post._id === postId)
  const commentFound = postfound.comments.find(comment => comment._id === commentId)

  edditFormComment.elements.comment.value = commentFound.comment
  edditFormComment.style.display = "inline"
}
