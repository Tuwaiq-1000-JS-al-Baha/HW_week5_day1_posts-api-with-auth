const postList = document.querySelector(".posts-list")
const addForm = document.querySelector(".add-form")
const errorElement = document.querySelector('.error-element')
let posts = []
let comments = []




getPosts()

function getPosts() {
    axios.get("https://vast-chamber-06347.herokuapp.com/api/posts")
        .then(Response => {
            posts = Response.data



            const postsDate = posts.sort((postA, postB) => (postB.dateCreated.localeCompare(postA.dateCreated)))
            postList.innerHTML = ""
            posts.forEach(function (post) {



                let postElement = `
                <div class="postElement">
            <div class="post-info-${post._id}">
            
            <h3>title: ${post.title}</h3>
            <p>body: ${post.body}</span></p>
            <img src = "${post.image}" width=100px height=100px alt='avatar'>
            <button onclick="deletePosts('${post._id}')">Delete</button>
            <button onclick="editPosts(${post._id})">Edit</button>
            </div>
            
            <form class="edit-form edit-form-${post._id}">
        
            <label>Title:</label>
            <input type="text" name="title">
                <br>
                <label>Body:</label>
                <input type="text" name="body">
                <br>
                <label>Image:</label>
                <input type="url" name="image">
                <br>
                <label>Owner:</label>
                <input type="type" name="owner">
                <br>
                <p class='error-element'></p>
                <button onclick="confirmPosts(event, '${post._id}')">Confirm</button>
            </form>

           <h3>Comment:</h3>
            `
                post.comments.forEach(comment => {
                    postElement += `
                    <div class='comment-item'>
                <div class="comment-info-${comment._id}">
                
                <p>Comment: ${comment.comment}</p>
                <button onclick="deleteComment('${post._id}', '${comment._id}')">Delete comment</button>
                <button onclick="editComment('${post._id}', '${comment._id}')">Edit Comment</button>
                </div>

                <form class="edit-form-comment edit-form-comment-${comment._id}" onsubmit="confirmEditComment(event, ${post._id}, ${comment._id})">
    
                <label>Comment:</label>
                <br>
                <textarea name="comment" cols="30" row="1"></textarea>
                <br>
                <button>Confirm</button>
            </form>
                </div>
                `
                })

                postElement += `
            <form class="form-comment form-comment-${post._id}" onsubmit="addComment(event, '${post._id}')">
            
                <label>Comment:</label>
                <br>
                <textarea name="comment" cols="30" row="1"></textarea>
                <br>
                <button>Add Comment</button>
            </form>

            </div>
            `

                postList.innerHTML += postElement
            })
        })
        .catch(error => {
            console.log(error.response.data);
        })
}


function addPosts(e) {
    e.preventDefault()

    const title = addForm.elements.title.value
    const body = addForm.elements.body.value
    const image = addForm.elements.image.value





    const postsBody = {
        title: title,
        body: body,
        image: image,





    }


    axios.post("https://vast-chamber-06347.herokuapp.com/api/posts", postsBody, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            const allData = response.data

            console.log('added post');

            errorElement.innerHTML = ''
            addForm.reset()

            getPosts()
        })
        .catch(error => {
            console.log(error.response.data);
        })


}

function deletePosts(id) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            console.log('delete success');
            getPosts()
        })
        .catch(error => {
            console.log(error.response.data);
        })

}

function editPosts(postId) {
    const formPosts = document.querySelector(`.edit-form-${id}`)
    formPosts.style.display = 'inline'
    const postsInfo = document.querySelector(`.post-info-${id}`)
    postsInfo.style.display = 'none'

    const postFound = posts.find(post => post._id === id)




    formPosts.elements.title.value = postFound.title
    formPosts.elements.body.value = postFound.body
    formPosts.elements.image.value = postFound.image
    //formPosts.elements.owner.value = postFound.owner



}

function confirmPosts(e, id) {
    e.preventDefault()
    const formPosts = document.querySelector(`.edit-form-${id}`)



    const postsBody = {
        title: formPosts.elements.title.value,
        body: formPosts.elements.body.value,
        image: formPosts.elements.image.value,
        //owner: formPosts.elements.owner.value

    }

    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, postsBody, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(function (response) {
            console.log('edit success');
            getPosts()
        })
        .catch(error => {
            console.log(error.response.data);
        })

}


function addComment(e, id) {
    e.preventDefault()
    const formComment = document.querySelector(`.form-comment-${id}`)

    const commentBody = {
        // owner: formComment.elements.owner.value,
        comment: formComment.elements.comment.value
    }

    axios.post(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment`, commentBody, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            console.log('added comment')
        })
        .catch(error => {
            console.log(error.response.data)
        })
}

function deleteComment(postId, commentId) {

    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            console.log('comment deleted')
        })
        .catch(error => {
            console.log(error.response.data)
        })
}

function editComment(postId, commentId) {

    const commentInfo = document.querySelector(`.comment-info-${commentId}`)
    commentInfo.style.display = 'none'

    const editFormComment = document.querySelector(`.edit-form-comment-${commentId}`)

    const postFound = posts.find(post => post._id === postId)

    console.log(postFound);

    const commentFound = postFound.comments.find(comment => comment._id === commentId)


    //editFormComment.elements.owner.value = commentFound.owner
    editFormComment.elements.comment.value = commentFound.comment

    editFormComment.style.display = 'inline'

}


function confirmEditComment(e, postId, commentId) {
    e.preventDefault()

    const editFormComment = document.querySelector(`.edit-form-comment-${postId}`)
    console.log(editFormComment);

    const commentBody = {
        // owner: editFormComment.elements.owner.value,
        comment: editFormComment.elements.comment.value
    }
    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`, commentBody, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            console.log('comment edited')
            getPosts()
        })
        .catch(error => {
            console.log(error.response.data);
        })
}

