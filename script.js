const posts = document.querySelector(".allPosts")
const form = document.querySelector(".addform")
let items = []
getPosts()

function getPosts(){
axios.get("https://vast-chamber-06347.herokuapp.com/api/posts")
.then(function (response) {
     items = response.data

    posts.innerHTML = ""

    items.forEach(function (item) {


    const title = item.title
    const body = item.body
    // const owner = item.owner
    const image = item.image
    const id = item._id
    


    let allPosts = `
    <div class"allitems">
    <div class="forminfo">
    <h3 class="title-class">The Title is : <span>${title}</span></h3>
    <h3 class="body-class">The Body is : <span>${body}</span></h3>
   
    <img src="${image}" height="300px" width="300px">
    <br>
    <button onclick="btndelete('${id}')">Delete </button>
    <button onclick="btnedit(this)">Edit </button>
    </div>

    <form onsubmit="btnedit(event)" class="editform">
    <label>Title: </label><input type="text" name="title">
    <br>
    <label>Body: </label><input type="text" name="body">
    <br>
   
    <br>
    <label>Image: </label><input type="url" name="image">
    <br>
    <button onclick="btndelete('${id}')">Delete </button>
    <br>
    <button onclick="btnconfirm(event,this,'${id}')">confirm</button>
</form>
    
    `
    item.comments.forEach(comment=>{
        allPosts+= `
        <div class="comment-edit-${comment._id}">
        
        <p>comment:${comment.comment}</p>
        <button onclick="deletbtncom('${id}','${comment._id}')">delete</button>
        <button onclick="editbtncon('${id}','${comment._id}')">Edit</button>
        </div>
        <form class="form-comment-edit form-comment-edit-${comment._id}" onsubmit="confirmcomment(event,'${id}','${comment._id}')">
        
        <textarea name="comment" cols="30" rows="1"></textarea><br>
        <button>confirm</button>
    </form>
      
        
        `
    })

    allPosts+=`
    <form class="form-comment-${id}" onsubmit="addcomment(event,'${id}')">
   
    <textarea name="comment" cols="30" rows="1"></textarea><br>
    <button>add comment</button>
</form>
</div>

    `

    posts.innerHTML += allPosts
})
})
}
function btnadd(event){
    event.preventDefault()

    const title = form.elements.title.value
    const body = form.elements.body.value
    // const owner = form.elements.owner.value
    const image = form.elements.image.value

    const postsBody = {
        title : title ,
        body : body ,
        // owner : owner ,
        image : image
    }

    axios.post("https://vast-chamber-06347.herokuapp.com/api/posts" , postsBody ,{
        headers: {
            Authorization:localStorage.token
        }
    })
    .then(function (response) {
        getPosts()
    })

    
}

function btndelete(id) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`,{
        headers: {
            Authorization:localStorage.token
        }
    })
    .then(function (response) {
        getPosts()
    })
}

function btnedit(edit) {
    const formedit = edit.parentElement.nextElementSibling
    console.log(formedit)
    formedit.style.display = "inline"
    const forminfo = edit.parentElement
    forminfo.style.display = "none"

    const title = forminfo.querySelector(".title-class span").innerHTML
    const body = forminfo.querySelector(".body-class span").innerHTML
    // const owner = forminfo.querySelector(".owner-class span").innerHTML
    const image = forminfo.querySelector("img").src


    const inputtitle = formedit.elements.title
    const inputbody = formedit.elements.body
    // const inputowner = formedit.elements.owner
    const inputimage= formedit.elements.image


    inputtitle.value = title
    inputbody.value = body
    // inputowner.value = owner
    inputimage.value = image 

}
function btnconfirm (event , confirm , id){
    event.preventDefault()

    const btnConfirm = confirm.parentElement

    const title = btnConfirm.elements.title.value
    const body = btnConfirm.elements.body.value  
    // const owner = btnConfirm.elements.owner.value
    const image = btnConfirm.elements.image.value


    const postBody = {
        title : title ,
        body : body ,
        // owner : owner ,
        image : image
    }
    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}` , postBody, {
        headers: {
            Authorization:localStorage.token
        }
    })

    .then(function (response) {
        getPosts()
    })
}
function addcomment(event,id){
    event.preventDefault()

    const formComment = document.querySelector(`.form-comment-${id}`)
    console.log(formComment)
    const commentBody = {
        comment:formComment.elements.comment.value,
        // owner: formComment.elements.owner.value
        
    } 
    axios.post(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment`, commentBody,{
        headers: {
            Authorization:localStorage.token
        }
    })
    .then(response=>{
        getPosts()
    })
}

function deletbtncom(id,commentId){
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment/${commentId}`,{
        headers: {
            Authorization:localStorage.token
        }
    })
    .then(response=>{
        getPosts()
    })
}

function editbtncon(postId,commentId){
    const commentInfo = document.querySelector(`.comment-edit-${commentId}`)
    commentInfo.style.display="none"

    const editformComment = document.querySelector(`.form-comment-edit-${commentId}`)
    const postFound = items.find(post=>post._id===postId)
    const commentFound = postFound.comments.find(Comment=>Comment._id===commentId)
    // editformComment.elements.owner.value=commentFound.owner
    editformComment.elements.comment.value=commentFound.comment
    editformComment.style.display="inline"
}

function confirmcomment(event,id,commentId){
    event.preventDefault()
    const editformComment = document.querySelector(`.form-comment-edit-${commentId}`)

    const commentBody = {
        comment:editformComment.elements.comment.value,
        // owner:editformComment.elements.owner.value
    }
    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment/${commentId}`,commentBody, {
        headers: {
            Authorization:localStorage.token
        }
    })
    .then(response=>{
        console.log("com edit")
        getPosts()
    })
}
function logout(){
    localStorage.removeItem("token")
}




