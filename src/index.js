document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM LOADED");
  fetch('http://localhost:3000/api/v1/notes')
  .then(res => res.json())
  .then(renderData)
  const sidenav = document.querySelector('.sidenav')
  sidenav.addEventListener('click', renderNote)
  document.querySelector('#new-note-button').addEventListener('click', popForm)
  document.querySelector('.new-note-form').addEventListener('submit', createNote)
  const infoDiv = document.querySelector('.info')
  infoDiv.addEventListener('click', removeOrEditNote)
  const editForm = document.querySelector('.edit-note-form')
  editForm.addEventListener('submit', edit)

})
// creates the side bar
function renderData(data) {
  data.forEach(renderAnchor)
}

function renderAnchor(note) {
  const sidenav = document.querySelector('.sidenav')
  const titleA = document.createElement('a')
  titleA.innerText = note.title
  titleA.dataset.id = note.id
  sidenav.appendChild(titleA)
}


// when anchors on sidebard are clicked, render html in center of page for anchor

function renderNote(event) {
  if (event.target.tagName === 'A') {
    const linkId = event.target.dataset.id
    fetch(`http://localhost:3000/api/v1/notes/${linkId}`)
    .then(res => res.json())
    .then(note)
  }
}

function note(data) {
  const infoDiv = document.querySelector('.info')
  infoDiv.innerText = ''
  infoDiv.dataset.id = data.id
  const title = document.createElement('h2')
  title.innerText = data.title
  const noteBody = document.createElement('p')
  noteBody.innerText = data.body
  const deleteNote = document.createElement('button')
  deleteNote.innerText = 'Delete Note'
  const editNote = document.createElement('button')
  editNote.innerText = 'Edit'
  infoDiv.appendChild(title)
  infoDiv.appendChild(noteBody)
  infoDiv.appendChild(editNote)
  infoDiv.appendChild(deleteNote)
}


function popForm(event) {
  const toggle = document.querySelector('.container')
  const infoDiv = document.querySelector('.info')
  const editForm = document.querySelector('.edit-container')
  const className = toggle.querySelector('form').className
  infoDiv.innerText = ''
  // if (className === "new-note-form") {
  //   editForm.style.display = "none"
  // } else
  if (toggle.style.display === "block") {
    toggle.style.display = "none"
  } else {
    toggle.style.display = "block"
  }
}


// add create feature

function createNote(event) {
  event.preventDefault()
  const titleInput = event.target.title.value
  const bodyInput = event.target.body.value
  fetch('http://localhost:3000/api/v1/notes', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      title: titleInput,
      body: bodyInput
    })
  })
  .then(res => res.json())
  .then(noteAnchorSlap)

}

function noteAnchorSlap(data) {
  note(data)
  renderAnchor(data)

}
// edit note


// delete note
function removeOrEditNote(event) {
  if (event.target.innerText === 'Delete Note') {
    const noteId = event.target.parentNode.dataset.id
    fetch(`http://localhost:3000/api/v1/notes/${noteId}`, {
      method: "DELETE"
    })
    .then(data => {
      event.target.parentNode.remove()
      let a = document.querySelector(`[data-id='${noteId}']`)
      a.remove()
    })

  }
  if (event.target.innerText === 'Edit') {
    let noteId = document.querySelector('.note-id')
    const titleV = document.querySelector('#title-text')
    const bodyV = document.querySelector('#body-text')
    const titleInput = event.target.parentElement.children[0].innerText
    const bodyInput = event.target.parentElement.children[1].innerText
    noteId.value = event.target.parentNode.dataset.id
    titleV.value = titleInput
    bodyV.value = bodyInput

  }
}
const editForm = document.querySelector('.edit-note-form')
function edit(event) {
  event.preventDefault()
  let noteId = document.querySelector('.note-id').value
  const titleV = document.querySelector('#title-text')
  const bodyV = document.querySelector('#body-text')
  fetch(`http://localhost:3000/api/v1/notes/${noteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: titleV.value,
      body: bodyV.value
    })
  }).then(r => r.json()).then(data => {
    let a = document.querySelector(`[data-id='${noteId}']`)
    let div = document.querySelector('.info')
    div.children[0].innerText = titleV.value
    a.innerText = titleV.value
    div.children[1].innerText = bodyV.value
    editForm.reset()
  })
}

// const tInput = event.target.parentElement.children[0].innerText
// const bInput = event.target.parentElement.children[0].innerText
