import { useState, useEffect } from "react"

import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "./firebase-config"
import { Link, useNavigate, useParams } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState("")

  useEffect(()=>{
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
  },[])

  return (
    <>
      <nav className="nav-bar-container">
        <ul className="nav-bar-list">
          <li className="nav-bar-link"> <Link to="/"  > Home </Link></li>
          <li className="nav-bar-link"> <Link to="/journal" > Journal </Link></li>
          <li className="nav-bar-link"> <Link to="/signUp"> Sign Up </Link></li>
          {user?.email}
          {/* <Link to="/journal">Journal</Link> */}
        </ul>
      </nav>
    </>
  )
}

export default Navbar
