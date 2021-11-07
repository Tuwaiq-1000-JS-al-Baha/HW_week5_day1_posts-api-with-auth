const elementList = document.querySelector(".element-list")
const form = document.querySelector(".form")

let elements = []

// -------------------- get elements -------------------//
getElements()

function getElements() {

  axios.get("https://vast-chamber-06347.herokuapp.com/api/posts")
  .then(response => {
 
       elements = response.data

      const elementSorted = elements.sort((elementA , elementB) => 
      elementB.dateCreated.localeCompare(elementA.dateCreated))
      
      elementList.innerHTML = ""

      elementSorted.forEach(element => {
         
        const title = element.title 
        const body = element.body
        const owner = element.owner
        const img = element.image
        const id = element._id

        let postElements = `
     <div class="elementItem">
        <div class="element-info">
          <h2> title : <span>${title}</span></h2>
          <h3> body : <span>${body}</span></h3>
          <p> owner :  <span>${owner}</span></p>
          <img src="${img}" height="200px" >
        
          <button onclick="deleteElement('${id}')"> DELETE ELEMENT </button>
          <button onclick="editElement(this)"> EDIT ELEMENT </button>
        </div>

        <form class="edit-form">
          <label> TITLE </label> <input type="text" name="title">
          <br>
          <br>
          <label> BODY </label> <input type="text" name="body">
          <br>
          <br>
          <label> OWNER </label> <input type="text" name="owner">
          <br>
          <br>
          <label> IMAGE </label> <input type="url" name="image">
          <br>
          <br>
          <button onclick="deleteElement('${id}')"> DELETE ELEMENT </button>
          <button onclick="confirmElement(event , this , '${id}')"> CONFIRM </button>
        </form>
        <h3>Comments</h3>
        `
        element.comments.forEach(comment => {
            postElements += `
     <div class="comment-item">
        <div class="comment-info-${comment._id}">
            <strong> owner = ${comment.owner}</strong>
            <p>comment:${comment.comment}</p>
            <button onclick="deleteComment ('${element._id}' , '${comment._id}')"> DELETE COMMENT</button>
            <button onclick="editComment ('${element._id}' , '${comment._id}')"> EDIT COMMENT</button>
        
            </div>  
            
         <form class="edit-form-comment edit-form-comment-${comment._id}" onsubmit="confirmEditComment (event, '${element._id}' , '${comment._id}')">
            <label> OWNER : </label> <input type="text" name="owner">
            <br>
            <br>
            <label> COMMENT: </label> <textarea name="comment" cols="30" rows="1"></textarea>
            <br>
            <br>
            <button> CONFIRM </button>  
          </form>
     </div>

            `

        })

        postElements += `
         <form class="form-comment-${id}" onsubmit="addComment (event, '${id}')">
         <label> OWNER : </label> <input type="text" name="owner">
         <br>
         <br>
         <label> COMMENT: </label> <textarea name="comment" cols="30" rows="1"></textarea>
         <br>
         <br>
         <button> ADD COMMENT </button>

         </form>
        </div>

        `

        elementList.innerHTML += postElements

        
      })
      
  })

}


// --------------- add a new element ---------------------//

function addElements(event) {
    event.preventDefault()

    const title = form.elements.title.value
    const body = form.elements.body.value
    const owner = form.elements.owner.value
    const image = form.elements.image.value
 
    const elementBody = {
        title : title,
        body : body,
        owner : owner,
        image : image,
        
    }
    axios.post("https://vast-chamber-06347.herokuapp.com/api/posts" , elementBody, {
        headers : {
            Authorization: localStorage.token
        }
    })
    .then(response => {
        const data = response.data

        getElements()
    })
    .catch(error => console.log(error.response.data))
}


// ----------------------- delete elements ----------------//

function deleteElement(id) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}`, {
        headers : {
            Authorization: localStorage.token
        }
    })
    .then(response => {
        getElements()
    })
    
    .catch(error => console.log(error.response.data))
}


//------------------ edit element ---------------------//

function editeElement(editButton) {

    const elementForm = editButton.parentElement.nextElementSibling
   elementForm.style.display = "inline"

    const elementInfo = editButton.parentElement
    elementInfo.style.display="none"

    const title = elementInfo.querySelector("h2 span").innerHTML
    const body = elementInfo.querySelector("h3 span").innerHTML
    const owner = elementInfo.querySelector("p span").innerHTML
    const image = elementInfo.querySelector("img").src

    const titleInfo = elementForm.elements.title
    const bodyInfo = elementForm.elements.body
    const ownerInfo = elementForm.elements.owner
    const imageInfo = elementForm.elements.image


    titleInfo.value = title
    bodyInfo.value = body
    ownerInfo.value = owner
    imageInfo.value = image

}

//--------------------- confirm edit---------------------//

function confirmElement(event, confirmButton, id) {
    event.preventDefault()

    const elementForm = confirmButton.parentElement

    const title = elementForm.elements.title.value
    const body = elementForm.elements.body.value
    const owner = elementForm.elements.owner.value
    const image = elementForm.elements.image.value

    const elementBody = {
        title : title,
        body : body,
        owner : owner,
        image : image,
    }

    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}` , elementBody, {
        headers : {
            Authorization: localStorage.token
        }
    })
    .then(response => {
        getElements()
    })
    .catch(error => console.log(error.response.data))
}

//------------------------ add comment ---------------------------//

function addComment(event, id) {
    event.preventDefault()

    const formComment = document.querySelector(`.form-comment-${id}`)

    const commentBody = {
        comment: formComment.elements.comment.value,
        owner: formComment.elements.owner.value,
    }

    axios.post(`https://vast-chamber-06347.herokuapp.com/api/posts/${id}/comment` , commentBody, {
        headers : {
            Authorization: localStorage.token
        }
    })
    .then(response => {
        console.log("add comment");
        getElements()
    })
    
    .catch(error => console.log(error.response.data))
}

function deleteComment(postId, commentId) {
    axios.delete(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}`, {
        headers : {
            Authorization: localStorage.token
        }
    })
    .then(response => {
        console.log("comment deleted");
        getElements()
    })
    .catch(error => {
        console.log(error.response.data);
    })
}

//---------------------- confirm coment -------------------//

function confirmEditComment(event, postId, commentId) {
    
    event.preventDefault()

    const editFormComment = document.querySelector(`.edit-form-comment-${commentId}`)

    const commentBody = {
        comment: editFormComment.elements.comment.value,
        owner: editFormComment.elements.owner.value,
    }
    axios.put(`https://vast-chamber-06347.herokuapp.com/api/posts/${postId}/comment/${commentId}` , commentBody)
     .then(response => {
         console.log("comment edited");
         getElements()
     })
     .catch(error=> {
         console.log(error.response.data);
     })
}


//----------------------- edit comment ------------------//

function editComment(postId, commentId) {
    
    const commentInfo = document.querySelector(`.comment-info-${commentId}`)
    commentInfo.style.display = "none"

    const editFormComment = document.querySelector(`.edit-form-comment-${commentId}`)
    
    const elementFound = elements.find(element => element._id === postId)
     
    const commentFound = elementFound.comments.find(comment => comment._id === commentId )

    editFormComment.elements.owner.value = commentFound.owner
    editFormComment.elements.comment.value = commentFound.comment

    editFormComment.style.display = "inline"
}



