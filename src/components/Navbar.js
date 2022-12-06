import { useState, useEffect } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../database/firebase-config"
import { Link } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState("")

  useEffect(()=>{
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
   
  },[])
  const logout = async () => {
    await signOut(auth)
  }

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
        </ul>
      </nav>
    </>
  )
}

export default Navbar
