// This page will be accessible at http://localhost:3000/user
// It will allow show a singup page for new users and a login page for existing users.
// Once logged in this page will allow a user to edit their profile.
// A profile will include:
// - Name
// - Email
// - Password
// - Profile Picture


import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth, db } from "../database/firebase-config"
import { UserContext } from "../providers/UserProvider"
import { storage } from "../database/firebase-config"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

const User = () => {
    const [registerEmail, setRegisterEmail] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [currentUser, setCurrentUser] = useState("")
    const [name, setName] = useState("")
    const [profilePicture, setProfilePicture] = useState("")
    const [profilePictureUrl, setProfilePictureUrl] = useState("")
    const [user, setUser] = useContext(UserContext)
    const navigate = useNavigate()

   // here we are using the useEffect hook to check if a user is logged in
    // if they are logged in we set the currentUser state to the user object
    // if they are not logged in we set the currentUser state to null
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setCurrentUser(currentUser)
        })
    }
    , [])

     // here we are using the createUserWithEmailAndPassword function from firebase
    // to create a new user with the email and password provided
    // we are also using the addDoc function from firebase to add a new document to the users collection
    // the document will have the email and name of the user
    // we are also using the signInWithEmailAndPassword function from firebase to sign in the user
    // once the user is signed in we are using the setUser function from the UserContext to set the user state
    // we are also using the useHistory hook to redirect the user to the home page
    async function register() {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
            await addDoc(collection(db, "users"), {
                email: registerEmail,
                name: name
            })
            await signInWithEmailAndPassword(auth, registerEmail, registerPassword)
            setUser(userCredential.user)
            history.push("/")
        } catch (error) {
            console.log(error)
        }
    }

    // here we are using the signInWithEmailAndPassword function from firebase
    // to sign in the user with the email and password provided
    // once the user is signed in we are using the setUser function from the UserContext to set the user state
    // we are also using the useHistory hook to redirect the user to the home page
    async function login() {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            setUser(userCredential.user)
            history.push("/")
        } catch (error) {
            console.log(error)
        }
    }

    // here we are using the signOut function from firebase
    // to sign out the user
    // once the user is signed out we are using the setUser function from the UserContext to set the user state to null
    // we are also using the useHistory hook to redirect the user to the home page
    async function logout() {
        try {
            await signOut(auth)
            setUser(null)
            history.push("/")
        } catch (error) {
            console.log(error)
        }
    }

    // here we are using the uploadBytes function from firebase
    // to upload the profile picture to firebase storage
    // we are also using the getDownloadURL function from firebase
    // to get the download url of the profile picture
    // once we have the download url we are using the setProfilePictureUrl function to set the profilePictureUrl state
    async function uploadProfilePicture() {
        try {
            const storageRef = ref(storage, `profilePictures/${currentUser.uid}`)
            await uploadBytes(storageRef, profilePicture)
            const downloadUrl = await getDownloadURL(storageRef)
            setProfilePictureUrl(downloadUrl)
        } catch (error) {
            console.log(error)
        }
    }

    // here we are using the updateProfile function from firebase
    // to update the name and profile picture of the user
    // we are also using the updateDoc function from firebase
    // to update the name of the user in the users collection
    async function updateProfile() {
        try {
            await updateProfile(currentUser, {
                displayName: name,
                photoURL: profilePictureUrl
            })
            await updateDoc(doc(db, "users", currentUser.uid), {
                name: name
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="auth-container">
            {currentUser ?
                <div className="auth-current-user-container">
                    <h4>User Logged In:{currentUser.email}</h4>
                    <div>
                        <button onClick={logout}>Sign out</button>
                    </div>
                </div> : <div className="auth-current-user-container">
                    <h4>Please Login or Signup</h4>
                </div>
            }
            {/* SIGN UP */}
            <div className="auth-signup-container">
                <div className="auth-signup-form">
                    <h3>Sign Up</h3>
                    <input className="email-password-input" type="text" placeholder="Email..." value={registerEmail} onChange={(event) => { setRegisterEmail(event.target.value) }} />
                    <input className="email-password-input" type="text" placeholder="Password..." value={registerPassword} onChange={(event) => { setRegisterPassword(event.target.value) }} />
                    <button onClick={register}>Sign Up </button>
                </div>
            </div>
            {/* LOGIN */}
            <div className="auth-login-container">
                <div className="auth-login-form">
                    <h3>Login</h3>  
                    <input className="email-password-input" type="text" placeholder="Email..." value={loginEmail} onChange={(event) => { setLoginEmail(event.target.value) }} />
                    <input className="email-password-input" type="text" placeholder="Password..." value={loginPassword} onChange={(event) => { setLoginPassword(event.target.value) }} />
                    <button onClick={login}>Login</button>
                </div>
            </div>
            {/* PROFILE */}
            <div className="auth-profile-container">
                <div className="auth-profile-form">
                    <h3>Profile</h3>
                    <input className="email-password-input" type="text" placeholder="Name..." value={name} onChange={(event) => { setName(event.target.value) }} />
                    <input className="email-password-input" type="file" onChange={(event) => { setProfilePicture(event.target.files[0]) }} />
                    <button onClick={uploadProfilePicture}>Upload Profile Picture</button>
                    <button onClick={updateProfile}>Update Profile</button>
                </div>
            </div>
        </div>
    )

   
}   

export default User;




