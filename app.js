import { load, save, loginWithGoogle, onUserStateChange, isLogged } from './firebase.js'
import { monthsUntil, createDeleteButton, createEditButton, generateUniqueId } from './helper.js'

const modal = document.getElementById('modal')
const modal2 = document.getElementById('modal2')
const openBtn = document.getElementById('openModalBtn')
const openBtn2 = document.getElementById('openModalBtn-2')
const closeBtn = document.getElementById('closeModalBtn')
const closeBtn2 = document.getElementById('closeModalBtn2')
const form = document.getElementById('itemForm')
const form2 = document.getElementById('itemForm2')

let cluster = {}
let inventory, itemId, editing

async function init() {
  document.getElementById('login-btn').addEventListener('click', loginWithGoogle)

  openBtn.addEventListener('click', () => {
    editing = false
    modal.style.display = 'flex'
  })

  openBtn2.addEventListener('click', () => {
    modal2.style.display = 'flex'
  })

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none'
  })

  closeBtn2.addEventListener('click', () => {
    modal2.style.display = 'none'
  })

  form.addEventListener('submit', submitEventHandler)
  form2.addEventListener('submit', submitEventHandler2)

  if (isLogged()) {
    login()
  } else {
    console.log("No hay usuario logueado")
    onUserStateChange(login)
    showLoginModal()
  }
}

async function login() {
  console.log('Logged!')
  hideLoginModal()
  try {
    cluster = await load()
    renderCluster()
  } catch (error) {
    console.error(error)
  }
}

function renderCluster() {
  openBtn.style.display = 'none'
  const container = document.getElementById('cluster-container')
  container.innerHTML = ''

  Object.keys(cluster).forEach(k => {
    const div = document.createElement('div')

    div.id = k
    div.classList.add('inventory')

    div.innerHTML = cluster[k].name
    div.addEventListener('click', () => loadItems(k))

    container.appendChild(div)
  })
}

function loadItems(id) {
  openBtn.style.display = ''
  inventory = id
  const container = document.getElementById('inventory-container')
  container.innerHTML = ''

  itemList()
    .forEach(([k, v]) => {
      const item = createItem(k, v.name, v.expire)
      container.appendChild(item)
    })
}

function itemList() {
  const items = cluster[inventory].items || []
  return Object.entries(items)
    .sort((a, b) => a[1].expire.localeCompare(b[1].expire, 'es', { sensitivity: 'base' }))
}

function createItem(id, name, expire) {
  const div = document.createElement('div')

  div.id = id
  div.classList.add('item')

  const nameSpan = document.createElement('span')
  nameSpan.textContent = name

  const expireSpan = document.createElement('span')
  expireSpan.textContent = expire

  const deleteBtn = createDeleteButton()
  const editBtn = createEditButton()

  deleteBtn.addEventListener('click', () => {
    delete cluster[inventory].items[id]
    save(cluster)
    loadItems(inventory)
  })

  editBtn.addEventListener('click', () => {
    editing = true
    itemId = id
    const item = cluster[inventory].items[id]
    form.name.value = item.name
    form.expire.value = `${item.expire}-01`
    modal.style.display = 'flex'
  })

  div.appendChild(nameSpan)
  div.appendChild(expireSpan)
  div.appendChild(deleteBtn)
  div.appendChild(editBtn)

  const months = monthsUntil(`${expire}-01`)

  if (months === -1) div.style.backgroundColor = 'red'
  else if (months === 0) div.style.backgroundColor = 'orange'
  else if (months <= 2) div.style.backgroundColor = 'yellow'

  return div
}

// Función para mostrar el modal de login
function showLoginModal() {
  const modal = document.querySelector("#login-modal")
  modal.style.display = "flex"
}

// Función para ocultar el modal
function hideLoginModal() {
  const modal = document.querySelector("#login-modal")
  modal.style.display = "none"
}

function submitEventHandler(e) {
  e.preventDefault()

  const name = form.name.value.trim()
  const expire = form.expire.value.slice(0, -3)

  if (!name || !expire) return

  let id

  if (!editing) {
    id = generateUniqueId()
  } else {
    id = itemId
  }

  cluster[inventory].items = {
    ...cluster[inventory].items,
    [id]: { name: name, expire: expire }
  }
  save(cluster)

  loadItems(inventory)

  form.reset()
  modal.style.display = 'none'
}

function submitEventHandler2(e) {
  e.preventDefault()

  const name = form2.name.value.trim()

  if (!name) return

  const id = generateUniqueId()

  cluster = {
    ...cluster,
    [id]: { name: name }
  }

  save(cluster)

  renderCluster()

  form2.reset()
  modal2.style.display = 'none'
}


init()
