const posts = document.querySelector(".allPosts")
const form = document.querySelector(".addform")
const errorElements = document.querySelector(".error-element")

let items = []

getPosts()

function getPosts(){
axios.get("https://vast-chamber-06347.herokuapp.com/api/posts")
.then(function (response) {
     items = response.data

    posts.innerHTML = ""

    items.forEach(function (item) {


    let allElements = `
    <div class=all-items>
    <div class="forminfo-${item._id}">
    <h3 class="title-class">The Title is : <span>${item.title}</span></h3>
    <h3 class="body-class">The Body is : <span>${item.body}</span></h3>
    <img src="${item.image}" height="300px" width="300px">
    <br>
    <button onclick="btndelete('${item._id}')">Delete </button>
    <button onclick="btnedit('${item._id}')">Edit </button>
    </div>
    <form class=form-comment-${item._id} onsubmit="commentselect(event,'${item._id}')">
    <label>cooment comment </label> <input type="text" name="comment">
    <button>Select</button>
    </form>

    <form onsubmit="btnedit(event)" class="editform editform-${item._id}">
    <label>Title: </label><input type="text" name="title">
    <br>
    <label>Body: </label> <textarea name="body" cols="30" rows="10"></textarea>
    <br>
    <label>Image: </label><input type="url" name="image">
    <br>
    <button onclick="btndelete('${item._id}')">Delete </button>
    <br>
    <button onclick="btnconfirm(event,'${item._id}')">confirm</button>
    </form>

    
    `
    item.comments.forEach (function (comment) {
        allElements += `
        <div class="comment-item comment-item-${comment._id}">
        <h2>comment is ${comment.comment}</h2>
        <button onclick="deletecomment('${item._id}' , '${comment._id}')">Delete</button>
        <button onclick="editcomment('${item._id}','${comment._id}')">Edit</button>
        </div>

        <form class="confirm-form editform-${comment._id}" onsubmit="confirmcomment(event , '${item._id}' , '${comment._id}')">
        <label>comment : </label>
        <input type="text" name="comment">
        <br>
        <button>Confirm</button>
        </form>
        
        `
    })
    allElements.innerHTML += "</div>"

    posts.innerHTML += allElements
})
 


})
.catch(function (error) {
    const errorMessage = error.response.data
    console.log(errorMessage)
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

    axios.post("https://vast-chamber-06347.herokuapp.com/api/posts" , postsBody , {
        headers : {
            Authorization : localStorage.token
        }
    })
    .then(function (response) {
        errorElements.innerHTML =""
        form.reset()
        getPosts()
    })
    .catch(function (error) {
        console.log(error.response.data)
    })

    
}

function btndelete(id) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}` , {
        headers : {
            Authorization : localStorage.token
        }
    })
    .then(function (response) {
        getPosts()
    })
    .catch(function (error) {
        console.log(error.response.data)
    })
}

function btnedit(id) {
    const formEdit = document.querySelector(`.editform-${id}`)
    formEdit.style.display = "inline"
    const postInfo = document.querySelector(`.forminfo-${id}`)
    postInfo.style.display = "none"
    const postFound = items.find(function (posts) {
        return posts._id === id
    })
    formEdit.elements.title.value = postFound.title
    formEdit.elements.body.value = postFound.body
    // formEdit.elements.owner.value = postFound.owner
    formEdit.elements.image.value = postFound.image

  
    


}
function btnconfirm (event , id){
    event.preventDefault()
    const formEdit = document.querySelector(`.editform-${id}`)

    const postBody = {
        title : formEdit.elements.title.value ,
        body : formEdit.elements.body.value ,
        // owner : formEdit.elements.owner.value ,
        image : formEdit.elements.image.value
    }
    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}` , postBody , {
        headers : {
            Authorization : localStorage.token
        }
    })
    .then(function (response) {
        getPosts()
    })
    .catch(function (error) {
        console.log(error.response.data)
    })
}
function commentselect(event , id){
    event.preventDefault()

    const formComment = document.querySelector(`.form-comment-${id}`)

    const commentBody = {
        // owner : formComment.elements.owner.value ,
        comment : formComment.elements.comment.value
    }
    axios.post(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment` , commentBody , {
        headers : {
            Authorization : localStorage.token
        }
    })
    .then(function (response) {
        getPosts()
    })
    .catch(function (error) {
        console.log(error.response.data)
    })
}
function deletecomment (postid , commentid) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${postid}/comment/${commentid}` , {
        headers : {
            Authorization : localStorage.token
        }
    })
    .then(function (response) {
        getPosts()
    })
    .catch(function (error) {
        console.log(error.response.data)
    })
}
function editcomment(postid , commentid) {
    const formifo = document.querySelector(`.comment-item-${commentid}`)
    formifo.style.display = "none"
    const commentinfo = document.querySelector(`.editform-${commentid}`)
    commentinfo.style.display = "inline"
    const postFound = items.find(function (post) {
        return post._id === postid
    })  

    const commentFound = postFound.comments.find(function (comment) {
      return comment._id === commentid
     
})
    // commentinfo.elements.owner.value = commentFound.owner
    commentinfo.elements.comment.value = commentFound.comment

}
function confirmcomment(event , postid , commentid){
    event.preventDefault()
    const commentinfo = document.querySelector(`.editform-${commentid}`)

    const commentBody = {
        // owner : commentinfo.elements.owner.value ,
        comment : commentinfo.elements.comment.value 
    }
    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${postid}/comment/${commentid}` , commentBody , {
        headers : {
            Authorization : localStorage.token
        }
    })
    .then(function (response) {
        getPosts()
    })
    .catch(function (error) {
        console.log(error.response.data)
    })


}

function logout() {
    localStorage.removeItem('token')
}

