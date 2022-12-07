import { useState, useEffect } from "react"
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth"
import { auth, db } from "../database/firebase-config"
import { Link, useNavigate, useParams } from "react-router-dom";

const Footer = () => {
    const [user, setUser] = useState("")

    useEffect(()=>{
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
    },[])

    return (
        <>
        <footer className="footer-container">
            <ul className="footer-list">
            <li className="footer-link">
                <Link to="/" ><i class="fa fa-home" aria-hidden="true"></i></Link></li>
                {user? 
                <>
                    <li className="footer-link"><Link to="/journal"><i class="fa fa-pencil" aria-hidden="true"></i></Link></li>
                    <li className="footer-link"><Link to="/garden"><i class="fa fa-leaf" aria-hidden="true"></i></Link></li>
                    <li className="footer-link"><Link to="/favorites"><i class="fa fa-heart-o" aria-hidden="true"></i></Link></li>
                </> : <>
                    <li className="footer-link"><Link to="/signUp"><i class="fa fa-user-o" aria-hidden="true"></i>Log In/Sign Up</Link></li>
                </>
                }
            </ul>
        </footer>
        </>
    )
}

export default Footer