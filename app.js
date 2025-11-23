import { load, save, loginWithGoogle, onUserStateChange, isLogged } from './firebase.js'
import { highlight, expireText, createDeleteButton, createEditButton, generateUniqueId, byExpireDate } from './helper.js'

const modal = document.getElementById('modal')
const modal2 = document.getElementById('modal2')
const newItemBtn = document.getElementById('newItemBtn')
const newInvBtn = document.getElementById('newInvBtn')
const closeBtn = document.getElementById('closeModalBtn')
const closeBtn2 = document.getElementById('closeModalBtn2')
const form = document.getElementById('itemForm')
const form2 = document.getElementById('itemForm2')

let cluster = {}
let inventory, itemId, editing

async function init() {
  document.getElementById('login-btn').addEventListener('click', loginWithGoogle)

  newItemBtn.addEventListener('click', () => {
    editing = false
    modal.style.display = 'flex'
  })

  newInvBtn.addEventListener('click', () => {
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
  newItemBtn.style.display = 'none'
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
  newItemBtn.style.display = ''
  inventory = id

  const container = document.getElementById('inventory-container')
  container.innerHTML = ''
  
  const list = itemList()
  list.forEach(([k, v]) => {
    const item = createItem(k, v.name, v.expire)
    container.appendChild(item)
  })
  
  container.style.display = list.length ? 'flex' : ''
}

function itemList() {
  const items = cluster[inventory].items || []
  return Object.entries(items).sort(byExpireDate)
}

function createItem(id, name, expire) {
  const nameSpan = document.createElement('span')
  nameSpan.textContent = name

  const expireSpan = document.createElement('span')
  expireSpan.textContent = expireText(expire)

  const itemText = document.createElement('div')
  itemText.classList.add('item-text')

  itemText.appendChild(nameSpan)
  itemText.appendChild(expireSpan)

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

  const itemContainer = document.createElement('div')
  itemContainer.classList.add('icon-container')

  itemContainer.appendChild(editBtn)
  itemContainer.appendChild(deleteBtn)

  const item = document.createElement('div')

  item.id = id
  item.classList.add('item')
  highlight(expire, item)

  item.appendChild(itemText)
  item.appendChild(itemContainer)

  return item
}

function showLoginModal() {
  const modal = document.querySelector("#login-modal")
  modal.style.display = "flex"
}

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
