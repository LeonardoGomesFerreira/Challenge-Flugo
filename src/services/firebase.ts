import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAe3LJya_tCLLcKBg2m_dIC-04izlRl0gU",
  authDomain: "flugo-c40c3.firebaseapp.com",
  projectId: "flugo-c40c3",
  storageBucket: "flugo-c40c3.firebasestorage.app",
  messagingSenderId: "79412195498",
  appId: "1:79412195498:web:7e474d815ec711d3caa0d3",
}

const app = initializeApp(firebaseConfig)

// ⚠️ Você está usando um Firestore multi-database (nome: bd-flugo)
export const db = getFirestore(app, 'bd-flugo')

export const auth = getAuth(app)