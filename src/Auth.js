import { useState, useEffect } from "react"
import { addDoc, collection, doc, getDocs } from "firebase/firestore"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth, db } from "./firebase-config"


const Auth = () => {
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [currentUser, setCurrentUser] = useState("")
  const wormCollection = collection(db, "worms")


  useEffect(()=>{
    onAuthStateChanged(auth, (currentUser) => {
      setCurrentUser(currentUser)
    })
  },[])

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
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
    console.log("logout")
  }

  return (
    <div className="auth-container">
      <div className="auth-signup-container">
        <h3>Sign Up</h3>
        <input placeholder="Email..." value={registerEmail} onChange={(event) => { setRegisterEmail(event.target.value) }} />
        <input placeholder="Password..." value={registerPassword} onChange={(event) => { setRegisterPassword(event.target.value) }} />
        <button onClick={register}>Sign Up </button>
      </div>

      <div className="auth-login-container">
        <h3>Login</h3>
        <input placeholder="Email..." value={loginEmail} onChange={(event) => { setLoginEmail(event.target.value) }} />
        <input placeholder="Password..." value={loginPassword} onChange={(event) => { setLoginPassword(event.target.value) }} />
        <button onClick={login}>Login</button>
      </div>

        {currentUser?
        
        <div className="auth-current-user-container">
        <h4>User Logged In:{currentUser.email}</h4>
        <div>
          <button onClick={logout}>Sign out</button>
        </div>
      </div> :null
      }
    </div>
  )
}

export default Auth