import { useState, useEffect } from "react"

import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth"
import { auth, db } from "./firebase-config"
import { Link, useNavigate, useParams } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState("")

  useEffect(()=>{
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    // updateProfile(auth.currentUser, {
    //     displayName:"testing"
    // })
  },[])
  const logout = async () => {
    await signOut(auth)
  }
// console.log(user.providerData)

return (
    <>
      <nav className="nav-bar-container">
        <ul className="nav-bar-list">
          <li className="nav-bar-link"> <Link to="/"  > Home </Link></li>
          {user? 
          <>
              <li className="nav-bar-link"> <Link to="/journal" > Journal </Link></li>
              <li className="nav-bar-link">{user.email}</li>
              <button className="nav-bar-link" onClick={logout}>Sign out</button>
          </> :
              <li className="nav-bar-link"> <Link to="/signUp"> Log In </Link></li>
}
          {/* <Link to="/journal">Journal</Link> */}
        </ul>
      </nav>
    </>
  )
}

export default Navbar
