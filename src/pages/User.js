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
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import { auth } from "../database/firebase-config"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../database/firebase-config"
import { UserContext } from "../components/UserProvider"
import { useUser } from "../components/UserProvider"


const User = () => {
    const [currentUser, setCurrentUser] = useState("")
    const [profilePicture, setProfilePicture] = useState("")
    const [profilePictureUrl, setProfilePictureUrl] = useState("")
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setCurrentUser(currentUser)
        })
    
    }
    , [])

    
    async function uploadProfilePicture() {
        try {
            const storageRef = ref(storage, `profilePictures/${currentUser.uid}`)
            await uploadBytes(storageRef, profilePicture)
            const downloadUrl = await getDownloadURL(storageRef)
            setProfilePictureUrl(downloadUrl)
            updateProfile(currentUser,{
                photoURL:downloadUrl
            })
            console.log("CURRENT USER",currentUser)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="user-container">
            <div className="user-profile-container">
                <h1>{currentUser.displayName}'s Profile</h1>
                <img src={currentUser.photoURL} width={90}/>
                <div className="user-profile-picture-container">
                    {/* <img src={profilePictureUrl} alt="profile picture" /> */}
                    <input type="file" onChange={(event) => { setProfilePicture(event.target.files[0]) }} />
                    <button onClick={uploadProfilePicture}>Upload Profile Picture</button>
                </div>
            </div>
        </div>
    )
}

export default User;




