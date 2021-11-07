const postList = document.querySelector(".post-list")
const formList = document.querySelector(".form-list")
const errorelement = document.querySelector(".error-element")
let posts = []

addposts();
function addposts() {
    axios.get(`https://vast-chamber-06347.herokuapp.com/api/posts`).then(function (response) {
        posts = response.data
        const postSorted = posts.sort((postA, postB) => postB.dateCreated.localeCompare(postA.dateCreated))
        postList.innerHTML = ""
        postSorted.forEach(function (post) {
            const title = post.title
            const body = post.body
            const image = post.image

            const id = post._id

            let newpost =
                `<div class="post-div">
         <div class="postitme postitme-${id}">
           <h2>${title}</h2>
           <p>${body}<p>
           <img src="${image}" heghit="200px" width="200px">
           <br>
           <button onclick="deletepost('${id}')">delete</button>
           <button onclick="editpost('${id}')">Edit</button>
         </div>
         <form class="form-2 form-2-${id}" >
           <label>Title:</label>
           <input type="text" name="title">
           <br>
           <label>Body:</label>
           <input type="text" name="body">
           <br>
           <label>Imag:</label>
           <input type="url" name="image">
           <br>
           <button onclick="deletepost('${id}')">Delete</button>
           <button onclick="comfirpost(event,'${id}')">Comfirm</button>
             </form>`



            post.comments.forEach(comment => {
                newpost +=
                    `<div class="commentitme">
        <div class="commentInfo-${comment._id}">
          <p>comment: ${comment.comment}</p>
          <button onclick="deletcomment('${id}','${comment._id}')">delet </button>
          <button onclick="editcomment('${id}','${comment._id}')">Edit</button>
        </div>
    <form class="commentform commentform-${comment._id}" onsubmit="confirmcomment(event,'${post._id}' ,'${comment._id}')">
          <label>coment:</label>
         <input type="text" name="comment">
         <br>
          <button>confirm comment </button>
    </form>
    </div>`
            })
            newpost += `
            <form class="form-comment form-comment-${post._id}" onsubmit="addComment(event,'${post._id}')">
       <label>coment:</label>
        <input type="text" name="comment">
        <br>
        
        <button>add</button>
       </form>
</div > `

            postList.innerHTML += newpost
        })

    })
    // .catch(error => {
    //    const errorMasage = error.response.data
    //     console.log(errorMasage)
    // })
}



addposts()
function addpost(event) {
    event.preventDefault()
    const title = formList.elements.title.value
    const body = formList.elements.body.value
    const image = formList.elements.image.value

    const postbody = {
        title: title,
        body: body,
        image: image,

    }

    axios.post(`https://vast-chamber-06347.herokuapp.com/api/posts`, postbody, {
        headers: { Authorization: localStorage.token }
    })
        .then(function (response) {
            posts = response.data

            errorelement.innerHTML = ""
            formList.reset()
            addposts()

        })
        .catch(error => {
            const errorMasage = error.response.data
            console.log(errorMasage)
            errorelement.innerHTML = errorMasage
        })

}
function deletepost(id) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, {
        headers: { Authorization: localStorage.token }
    })
        .then(function (response) {
            addposts()
        })
        .catch(error => {
            const errorMasage = error.response.data
            console.log(errorMasage)
        })
}
function editpost(id) {
    const formEdit = document.querySelector(`.form-2-${id}`)
    const postfound = posts.find(post => post._id === id)
    formEdit.elements.title.value = postfound.title
    formEdit.elements.body.value = postfound.body
    formEdit.elements.image.value = postfound.image
    formEdit.style.display = "inline"

    const postitme = document.querySelector(`.postitme-${id}`)
    postitme.style.display = "none"

}
function comfirpost(e, id) {
    e.preventDefault()
    const formEdit = document.querySelector(`.form-2-${id}`)

    const postbody = {
        title: formEdit.elements.title.value,
        body: formEdit.elements.body.value,
        image: formEdit.elements.image.value,

    }
    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, postbody, {
        headers: { Authorization: localStorage.token }
    })
        .then(function (response) {
            const data = response.data
            addposts()
        })
}

function addComment(event, id) {
    event.preventDefault()
    const formComent = document.querySelector(`.form-comment-${id}`)
    const commentbody = {
        comment: formComent.elements.comment.value,

    }
    axios.post(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment`, commentbody, {
        headers: { Authorization: localStorage.token }
    })
        .then(function () {
            console.log()
            addposts()
        })
        .catch(error => {
            console.log(error.response.data)
        })
}

function deletcomment(postId, commentId) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`, {
        headers: { Authorization: localStorage.token }
    })
        .then(response => {
            const data = response.data
            addposts()
        })
        .catch(error => {
            console.log(error.response.data)

        })

}
function editcomment(postId, commentId) {
    const commentinfo = document.querySelector(`.commentInfo-${commentId}`)
    commentinfo.style.display = "none"
    const commentForm = document.querySelector(`.commentform-${commentId}`)
    const postfound = posts.find(post => post._id == postId)
    console.log(postfound)
    const commentfound = postfound.comments.find(comment => comment._id === commentId)
    console.log(commentfound)


    commentForm.elements.comment.value = commentfound.comment
    commentForm.style.display = "inline"
}
function confirmcomment(event, postId, commentId) {
    event.preventDefault()
    const commentForm = document.querySelector(`.commentform-${commentId}`)

    console.log(commentForm)
    const commentbody = {
        comment: commentForm.elements.comment.value,

    }

    console.log(commentbody)

    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`, commentbody, {
        headers: { Authorization: localStorage.token }
    }).then(response => {
        addposts()
    })
        .catch(error => {
            console.log(error.response.data)
        })

}


