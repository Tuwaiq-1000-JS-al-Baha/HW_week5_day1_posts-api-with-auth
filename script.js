const postList = document.querySelector('.posts-list')
const addForm = document.querySelector('.add-form')
const erroeElement = document.querySelector('.error-element')

let posts = [] //نعرف ابمصفوفه لنستخدمها في اكثر من مكان و تكون  فارغه
getPost() // نستدعي الداله

function getPost() {
    axios.get('https://vast-chamber-06347.herokuapp.com/api/posts')
        .then(response => {
            posts = response.data
            console.log(posts)


            // لترتيب الداله بحيث تظهر العناصر بإحدث عنصر يضاف
            const postSorted = posts.sort((postA, postB) => postB.dateCreated.localeCompare(postA.dateCreated))

            //getPosts() تكون الديف مفرغه لعدم تكرار العناصر بكل مره نسندعي فيها دالة 
            postList.innerHTML = ''
           
            postSorted.forEach(post => {
                let postElement = `
                <div class="post-item">
                    <div class= "post-info-${post._id}">
                        <h3>Title: ${post.title}</h3><br>
                        <p>Body: ${post.body}</p><br>
                        <img src="${post.image}" width="200px"><br>
                        <!-- <strong>Owner: ${post.owner}</strong><br> -->
                        <button onclick = "editPost('${post._id}')">Edit</button>
                        <button onclick = "deletePost('${post._id}')">Delete</button>
                    </div>
                        <form class="edit-form-${post._id} edit-form">
                            <label>Title</label>
                            <input type="text" name="title">
                             <br>
                            <label>Body</label>
                            <textarea name="body" cols="30" rows="3"></textarea><br>
                            <br>
                            <label>Image</label>
                            <input type="url" name="image">
                            <br>
                            <!-- <label>Owner</label>
                            <input type="text" name="owner">-->
                            <button onclick="confirmEdit(event , '${post._id}')">Confirm</button>
                        </form>
                        <h3>Comments</h3>`


                        post.comments.forEach(comment => {
                            postElement +=`
                                <div class="comment">
                                    <div class="comment-info-${comment._id} comment-info">
                                        <!-- <strong> Owner: ${comment.owner}</strong> -->
                                        <p>Comment: ${comment.comment}</p>
                                        <button onclick="deleteComment('${post._id}' , '${comment._id}')">delete</button>
                                        <button onclick="editComment('${post._id}' , '${comment._id}')">Edit</button>
                                    </div>
                                    <form class="edit-formComment-${comment._id} edit-formComment" onsubmit="confirmComment(event , '${post._id}' ,  '${comment._id}')">
                                   <!--  <label>Owner:</label>
                                    <input type = "text" name="owner"> -->
                                    <br>
                                    <label>Comment</label>
                                    <textarea name="comment" cols="30" rows="3"></textarea><br>
                                    <button>Confirm</button>
                                    </form>
                                  </div> `
                        })


                            postElement += `
                            <form class = "form-comment-${post._id}" onsubmit="addComment(event , '${post._id}')"> 
                           <!-- <label>Owner:</label>
                            <input type = "text" name="owner"> -->
                            <br>
                            <label>Comment</label>
                            <textarea name="comment" cols="30" rows="3"></textarea><br>
                            <button>Add comment</button>
                            </form>


                            </div>`
                        
            postList.innerHTML += postElement

            
            // console.log(postList)
        })
    })
    // لإظهار الخطأ للمستخدم
        .catch(error => {
            const errorMessage = (error.response.data)
            // console.log(errorMessage)
            console.log(errorMessage)
        })


}
function addPosts(e) {
    //لعدم تحديث الصفحه
    e.preventDefault()

    const title = addForm.elements.title.value
    const body = addForm.elements.body.value
    const image = addForm.elements.image.value
    // const owner = addForm.elements.owner.value

    postBody = {
        title: title,
        body: body,
        image: image,
        // owner: owner
    }

    axios.post("https://vast-chamber-06347.herokuapp.com/api/posts", postBody , {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(response => {
            erroeElement.innerHTML = ''
            addForm.reset()

            getPost()


        })
        .catch(error => {
            const errorMessage = error.response.data

            console.log(errorMessage)
            erroeElement.innerHTML = errorMessage
        })
}

//edit
function editPost(id) {
    const formEdit = document.querySelector(`.edit-form-${id}`)

    console.log(posts)
    //يرجع الكلام المضاف فالتعديلات
    const postFound = posts.find(post => post._id === id)
    console.log(postFound)

    formEdit.elements.title.value = postFound.title
    formEdit.elements.body.value = postFound.body
    formEdit.elements.image.value = postFound.image
    // formEdit.elements.owner.value = postFound.owner

    formEdit.style.display = 'inline'



    const postInfo = document.querySelector(`.post-info-${id}`)
    postInfo.style.display = 'none'

}
//confirm edit button
function confirmEdit(e, id) {
    e.preventDefault()

    const formEdit = document.querySelector(`.edit-form-${id}`)

    const postBody = {
        title: formEdit.elements.title.value,
        body: formEdit.elements.body.value,
        image: formEdit.elements.image.value,
        // owner: formEdit.elements.owner.value
    }

    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, postBody, {
        headers: {
            Authorization: localStorage.token
        }
    })
        .then(function (response) {
            console.log('edit_success')

            getPost()
        })
        .catch(error => {
            console.log(error.response.data)
        })
}
function deletePost(id) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`)
        .then(response => {
            console.log('delete')

            getPost()
        })
        .catch(error => {
            console.log(error.response.data)
        })
}

function addComment(e , id){
    e.preventDefault()

    const formComment = document.querySelector(`.form-comment-${id}`)

    const commentBody = {
        comment: formComment.elements.comment.value, 
        // owner : formComment.elements.owner.value
    }
    axios.post(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment` , commentBody , {
        headers: {
            Authorization: localStorage.token
        }
    })
    .then(response => {
        console.log('add comment')
        getPost()
    })
    .catch(error => {
        console.log(error.response.data)
    })
}
function deleteComment(postId , commentId){
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`, {
        headers: {
            Authorization: localStorage.token
        }
    })
    .then(() =>{
        getPost()
    })
    .catch(error => {
        console.log(error.response.data)
    })

}


function editComment(postId , commentId){
    const commentInfo = document.querySelector(`.comment-info-${commentId}`)
    commentInfo.style.display = 'none'

    const editFormComment = document.querySelector(`.edit-formComment-${commentId}`)

    const postFound = posts.find(post => post._id === postId)

    const commentFound = postFound.comments.find(comment => comment._id === commentId)

    editFormComment.elements.comment.value = commentFound.comment
    // editFormComment.elements.owner.value = commentFound.owner

    editFormComment.style.display = "inline"

}

function confirmComment(e , postId , commentId){
    e.preventDefault()

    const editFormComment = document.querySelector(`.edit-formComment-${commentId}`)


    const commentBody = {
        comment: editFormComment.elements.comment.value, 
        // owner : editFormComment.elements.owner.value
    }

    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}` , commentBody , {
        headers: {
            Authorization: localStorage.token
        }
    })
    .then(() => {
        getPost()
    })
    .catch(error => {
        console.log(error.response.data)
    })


}