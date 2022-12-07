import { useState, useEffect } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../database/firebase-config"
import { Link } from "react-router-dom";
import ToggleDark from "./toggleDark"
import { ThemeContext, themes } from "./themeContext"


const Navbar = () => {
  const [user, setUser] = useState("")
  const [darkMode, setDarkMode] = useState(true)

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
           {/* DARKMODE */}
      <header className="header-container">
        <ThemeContext.Consumer>
          {({ changeTheme }) => (
            <ToggleDark
              toggleDark={() => {
                setDarkMode(!darkMode)
                changeTheme(darkMode ? themes.light : themes.dark)
              }}
            />
          )}
        </ThemeContext.Consumer>
      </header>
        <ul className="nav-bar-list">
          {user? 
          <>
              <li className="nav-bar-link nav-bar-link-home"> <Link to="/journal" > Journal </Link></li>
              
              <li className="nav-bar-link nav-bar-link-email">{user.email}</li>
              <button className="nav-bar-link nav-bar-link-signout" onClick={logout}>Sign out</button>
          </> :
              <li className="nav-bar-link nav-bar-link"> <Link to="/signUp"> Log In </Link></li>
}
        </ul>
      </nav>
    </>
  )
}

export default Navbar
