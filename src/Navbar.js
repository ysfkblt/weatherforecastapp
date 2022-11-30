import { useState, useEffect } from "react"
import { addDoc, collection, doc, getDocs } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

import { auth, db } from "./firebase-config"
import { storage } from "./firebase-config"
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage"
import { Link, useNavigate, useParams } from "react-router-dom";

const Navbar = () => {
    const [user, setUser]=useState("")

onAuthStateChanged(auth, (currentUser)=>{
    console.log('*****currentUser')
    console.log(currentUser)
    setUser(currentUser)
})

  return (
    <>
    <div>
                <Link to="/"> Home </Link>
                <Link to="/journal"> Journal </Link>
                <Link to="/signUp"> Sign Up </Link>
                {user?.email}
                {/* <Link to="/journal">Journal</Link> */}
    </div>
    </>
  )
}

export default Navbar
