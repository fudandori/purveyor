export function createDeleteButton() {
  const button = document.createElement('button')
  button.classList.add('btn', 'delete-btn')
  button.title = 'Eliminar'

  const icon = document.createElement('span')
  icon.classList.add('material-symbols-outlined')
  icon.textContent = 'delete'

  button.appendChild(icon)

  return button
}

export function createEditButton() {
  const button = document.createElement('button')
  button.classList.add('btn', 'edit-btn')
  button.title = 'Editar'

  const icon = document.createElement('span')
  icon.classList.add('material-symbols-outlined')
  icon.textContent = 'edit'

  button.appendChild(icon)

  return button
}

export function generateUniqueId() {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 10) // componente aleatorio
  return `${timestamp}_${random}`
}

function monthsUntil(date) {
  const now = new Date()
  const expiration = new Date(date)
  expiration.setDate(1)
  expiration.setMonth(expiration.getMonth() + 1)

  if (expiration < now) return -1

  const y1 = now.getFullYear()
  const m1 = now.getMonth()
  const y2 = expiration.getFullYear()
  const m2 = expiration.getMonth()

  return (y2 - y1) * 12 + (m2 - m1)
}

export function highlight(date, item) {
  const months = monthsUntil(`${date}-01`)

  let color = null
  if (months === -1) item.classList.add('expired')
  else if (months <= 1) item.style.backgroundColor = 'orange'
  else if (months <= 2) item.style.backgroundColor = 'yellow'

  return color
}

export function expireText(input) {
  const date = new Date(`${input}-01`)
  const month = date.toLocaleDateString('es-ES', { month: 'long' });
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${date.getFullYear()}`;
}

export function byExpireDate(a, b) {
  return a[1].expire.localeCompare(b[1].expire, 'es', { sensitivity: 'base' })
}