import { useState, useEffect } from "react"
import { addDoc, collection, doc, getDocs } from "firebase/firestore"
import { db } from "./firebase-config"
import { storage } from "./firebase-config"
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage"
import { Link, useNavigate, useParams } from "react-router-dom";

const Navbar = () => {
  


  return (
    <>
    <div>
                <Link to="/"> Home </Link>
                <Link to="/journal"> Journal </Link>
                {/* <Link to="/journal">Journal</Link> */}
    </div>
    </>
  )
}

export default Navbar
