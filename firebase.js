import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js'

import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js'
import { getDatabase, ref, child, get, push, set } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js'

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
let node = null
let userStateCallback = null

function stateChangeHandler(user) {
  if (user) {

    console.log('OMAIGAD user:')
    console.log(user)
    node = ref(db, `users/${user.uid}`)
    if (userStateCallback) userStateCallback()
  } else {
    console.log('No user')
  }
}

export async function loginWithGoogle() {
  try {
    await signInWithPopup(getAuth(), new GoogleAuthProvider())
  } catch (error) {
    console.error("Google login error:", error)
  }
}

export function save(obj) {
  set(node, obj)
}

export async function load() {
  const snapshot = await get(node)
  return snapshot.exists() ? snapshot.val() : {}
}

export function onUserStateChange(callback) {
  userStateCallback = callback;
}

export function isLogged() {
  return node != null
}

onAuthStateChanged(getAuth(), stateChangeHandler)
