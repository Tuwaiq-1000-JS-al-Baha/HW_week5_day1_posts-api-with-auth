const postDive = document.querySelector(".posts-list");
const form = document.querySelector(".addPost");
let posts = []

getposts();

function getposts() {
  axios.get("https://vast-chamber-06347.herokuapp.com/api/posts")
    .then(function (response) {
       posts = response.data;
    

      postDive.innerHTML = "";
      posts.forEach(function (post) {

        const title = post.title;
        const body = post.body;
        // const owner = post.owner;
        const image = post.image;
        const id = post._id;

        let postElement = `
        <div class="post-item">
        <div class="post-info">
        <h2>Title:<span>${title}</span></h2>
        <p class="body-class">Body:<span>${body}</span></p>
       
        <img src="${image}" width="200px">
        
        <button onclick="deletePost('${id}')">Delete post</button>
        <button onclick="editPost(this)">Edit</button>
        </div>
        <form class="post-form">
        
        <label>Title:</label><input type="text" name="title">
        <br>
        <label>Body:</label><input type="text" name="body">
        <br>
       
        <label>Image:</label><input type="url" name="image">
        <br>
        <button onclick="deletePost('${id}')">Delete post</button>
        <button onclick="confirmEdit(event, this,'${id}')">confirm</button>

        </form>
        <h3>Comments:</h3>
      `
       
     
post.comments.forEach(comment=>{
  postElement +=`
  <div class="comment-item">
  <div class="comment-info-${comment._id}">
  
  <p>Comment: ${comment.comment} </p>
  <button onclick="deleteComment('${post._id}','${comment._id}')"> Delete comment</button>
  <button onclick="editComment('${post._id}','${comment._id}')"> Edit comment</button>

  </div>
  <form class="edit-form-comment edit-form-comment-${comment._id}" onsubmit="confirmEditComment(event , '${post._id}','${comment._id}')">
        
        <label>Comment:</label>
        <textarea name="comment" cols="30" rows="1"></textarea>
        <br>
       
        <button>Confirm</button>
        </form>
  </div>
  `
})

postElement +=`
<form class="form-comment-${post._id}"onsubmit="addComment(event , '${id}')">
      
        <label>Comment:</label>
        <textarea name="comment" cols="30" rows="1"></textarea>
        <br>
       
        <button >Add comment</button>
        </form>
        </div>`
        postDive.innerHTML += postElement;

      
      
      });
    })


     }

function editPost(editButton) {
  const postForm = editButton.parentElement.nextElementSibling;
  console.log(postForm );
  postForm.style.display = "inline";

  const postinfo = editButton.parentElement;
  postinfo.style.display = "none";

  const title = postinfo.querySelector("h2 span").innerHTML;
  const body = postinfo.querySelector(".body-class span").innerHTML;
  // const owner = postinfo.querySelector(".owner-class span").innerHTML;
  const image = postinfo.querySelector("img").src;

  const titleInput = postForm.elements.title;
  const bodyInput = postForm.elements.body;
  // const ownerInput = postForm.elements.owner;
  const imageInput = postForm.elements.image;

  titleInput.value = title;
  bodyInput.value = body;
  // ownerInput.value = owner;
  imageInput.value = image;
}

function confirmEdit(event, confirmButton, id) {
  event.preventDefault();
  const postForm = confirmButton.parentElement;

  const title = postForm.elements.title.value;
  const body = postForm.elements.body.value;
  // const owner = postForm.elements.owner.value;
  const image = postForm.elements.image.value;

  const postBody = {
    title : title,
    body : body,
    // owner : owner,
    image : image,
  }

  axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, postBody,{
    headers:{
      Authorization:localStorage.token
    }
  })
  .then((response) => {
    getposts()
  });
}

function addPost(event) {
  event.preventDefault();
  console.log("submit");
  const title = form.elements.title.value;
  const body = form.elements.body.value;
  // const owner = form.elements.owner.value;
  const image = form.elements.image.value;

  const postBody = {
    title: title,
    body: body,
    // owner: owner,
    image: image,
  }
  axios
    .post("https://vast-chamber-06347.herokuapp.com/api/posts", postBody,{
      headers:{
        Authorization:localStorage.token
      }
    })
    .then((response) => {
      
      getposts();
    })
  }


 function addComment (event,id){
   event.preventDefault()

  const formComment =document.querySelector(`.form-comment-${id}`)
  const commentBody = {
    comment:formComment.elements.comment.value,
    // owner:formComment.elements.owner.value
  
  }
  axios.post(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment`, commentBody,{

  })
    .then(response =>{
      console.log("add comment")
      getposts()
    })
  

// .catch(error =>{
//   console.log(error.response.data);
//   })
 }
function deleteComment(postId , commentId){
  axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`)
  .then(response=>{
    console.log("comment deleted");
    getposts()
  })
}

function confirmEditComment(event,postId,commentId){
  event.preventDefault()

  const  editFormComment=document.querySelector(`.edit-form-comment-${commentId}`)
  const commentBody={
    comment:editFormComment.elements.comment.value,
    // owner:editFormComment.elements.owner.value
  }
  axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`,commentBody)
  .then(response=>{
    console.log("comment deleted");
    getposts()
  })
}


function editComment(postId, commentId){
  const commentInfo =document.querySelector(`.comment-info-${commentId}`)
  commentInfo.style.display="none"

  const editFormComment= document.querySelector(`.edit-form-comment-${commentId}`)
  const postFound = posts.find(post =>post._id===postId)
  const commentFound=postFound.comments.find(comment => comment._id===commentId)
          editFormComment.elements.comment.value= commentFound.comment
          //  editFormComment.elements.owner.value = commentFound.owner
           editFormComment.style.display="inline"
}