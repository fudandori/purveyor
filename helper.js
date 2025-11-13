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

export function monthsUntil(date) {
  const today = new Date()
  const target = new Date(date)

  const y1 = today.getFullYear()
  const m1 = today.getMonth()
  const y2 = target.getFullYear()
  const m2 = target.getMonth()

  const diff = (y2 - y1) * 12 + (m2 - m1)

  if (target < new Date(y1, m1, today.getDate())) return -1

  return diff <= 0 ? 0 : diff
}
