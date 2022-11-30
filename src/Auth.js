import { useState, useEffect } from "react"
import { addDoc, collection, doc, getDocs } from "firebase/firestore"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth, db } from "./firebase-config"
import { storage } from "./firebase-config"
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage"
import { Link, useNavigate, useParams } from "react-router-dom";

const Auth = () => {
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [user, setUser]=useState("")
onAuthStateChanged(auth, (currentUser)=>{
  setUser(currentUser)
})

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
      console.log(user)
    } catch (error) {
      console.log(error.message)
    }
  }

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      console.log(user)
    } catch (error) {
      console.log(error.message)
    }
  }

  const logout = async () => {
await signOut(auth)
await setLoginEmail("")
await setLoginPassword("")
  }

  return (
    <>
      <div>
        <h3>Sign Up</h3>
        <input placeholder="Email..." value={registerEmail} onChange={(event) => { setRegisterEmail(event.target.value) }} />
        <input placeholder="Password..." value={registerPassword} onChange={(event) => { setRegisterPassword(event.target.value) }} />
        <button onClick={register}>Sign Up </button>
      </div>
      <div>
        <h3>Login</h3>
        <input placeholder="Email..." value={loginEmail} onChange={(event) => { setLoginEmail(event.target.value) }} />
        <input placeholder="Password..." value={loginPassword} onChange={(event) => { setLoginPassword(event.target.value) }} />
        <button onClick={login}>Login</button>

      </div>
      <div>
        <h4>User Logged In:</h4>
        {user?.email}
        <div>

        <button onClick={logout}>Sign out</button>
        </div>
      </div>
    </>
  )
}

export default Auth