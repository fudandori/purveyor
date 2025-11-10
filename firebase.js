import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';

import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js'
import { getDatabase, ref, child, get, push } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js'

const firebaseConfig = {
    apiKey: 'AIzaSyDmSilznIP1fS1q4kbm1jyfvpkoqhrE7t0',
    authDomain: 'purveyor-71627.firebaseapp.com',
    databaseURL: 'https://purveyor-71627-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'purveyor-71627',
    storageBucket: 'purveyor-71627.firebasestorage.app',
    messagingSenderId: '185252495405',
    appId: '1:185252495405:web:a836493672c5207638f8a4'
}

initializeApp(firebaseConfig)

const db = getDatabase()
const pantry = new Inventory()

let cluster = {}

const save = () => {

    push(ref(db), {
        nombre: 'Fermín',
        edad: 39,
        fecha: new Date().toISOString()
    })
}

get(ref(db)).then(s => {
    cluster = s.val()
    console.log(cluster)

    Object.keys(cluster).forEach(k => {
        const div = document.createElement('div')

        div.id = k
        div.classList.add('inventory')

        div.innerHTML = cluster[k].name
        div.addEventListener('click', () => loadItems(k))

        document.getElementById('cluster-container').appendChild(div)




    })
})

function loadItems(id) {

    const container = document.getElementById('inventory-container')
    container.innerHTML = ''

    getInventory(id)
        .forEach(([k, v]) => {
            const div = document.createElement('div')

            div.id = k
            div.classList.add('item')

            div.innerHTML = `${v.name} - ${v.expire}`

            const months = monthsUntil(`${v.expire}-01`)

            if (months === -1) div.style.backgroundColor = 'red'
            else if (months === 0) div.style.backgroundColor = 'orange'
            else if (months <= 2) div.style.backgroundColor = 'yellow'

            container.appendChild(div)
        })

}

function getInventory(id) {
    return Object.entries(cluster[id].items)
        .sort((a, b) => a[1].expire.localeCompare(b[1].expire, 'es', { sensitivity: 'base' }))
}

function generateUniqueId() {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).slice(2, 10); // componente aleatorio
    return `${timestamp}_${random}`;
}

function monthsUntil(dateStr) {
    const today = new Date();
    const target = new Date(dateStr);

    // Obtener año y mes (0-11)
    const y1 = today.getFullYear();
    const m1 = today.getMonth();
    const y2 = target.getFullYear();
    const m2 = target.getMonth();

    // Calcular diferencia total en meses
    const diff = (y2 - y1) * 12 + (m2 - m1);

    // Si la fecha ya pasó completamente
    if (target < new Date(y1, m1, today.getDate())) return -1;

    // Si es el mismo mes
    return diff <= 0 ? 0 : diff;
}

