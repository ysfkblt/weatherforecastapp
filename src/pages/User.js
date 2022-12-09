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
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, updateEmail} from "firebase/auth"
import { auth} from "../database/firebase-config"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../database/firebase-config"
import { UserContext } from "../components/UserProvider"
import { useUser } from "../components/UserProvider"
import { set } from "firebase/database"


const User = () => {
    const [currentUser, setCurrentUser] = useState("")
    const [updatedDisplayName, setUpdatedDisplayName] = useState("")
    const [profilePicture, setProfilePicture] = useState("")
    const [profilePictureUrl, setProfilePictureUrl] = useState("")
    const [newDisplayName, setNewDisplayName] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const navigate = useNavigate()
console.log(currentUser)
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setCurrentUser(currentUser)
        })
    }
    , [])

    useEffect(() => {
        if (currentUser) {
            setProfilePictureUrl(currentUser.photoURL)
        }
    }, [currentUser])
    
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
async function updateDisplayName(){
    try {
       setUpdatedDisplayName(newDisplayName)
        updateProfile(currentUser,{
            displayName:newDisplayName
        })
        console.log("CURRENT USER",currentUser)
    } catch (error) {
        console.log(error)
    }
}
const logout = async () => {
    await signOut(auth)
    navigate('/')

  }
// async function updateNewEmail(){
//     try {
//        await updateEmail(auth,
//         "newEmai@l.com"
//         )
//         console.log("CURRENT USER",currentUser)
//     } catch (error) {
//         console.log(error)
//     }
// }
    return (
        <div className="user-container">
            <div className="user-profile-container">
                <h1>{updatedDisplayName===""?currentUser.displayName: updatedDisplayName}'s Profile</h1>
                <input  value={newDisplayName} onChange={(event) => { setNewDisplayName(event.target.value) }} placeholder="Update Display Name" size={90} style={{ height: "7vh" }} />
                <button onClick={(event)=>updateDisplayName()}>Update Display Name</button>
                {/* <div>{currentUser.email}</div>
                <input value={newEmail} onChange={(event) => { setNewEmail(event.target.value) }} placeholder="Update Email" size={90} style={{ height: "7vh" }} />
                <button onClick={(event)=>updateNewEmail()}>Update Email</button> */}
                <img src={profilePictureUrl} width={90}/>
                <div className="user-profile-picture-container">
                    {/* <img src={profilePictureUrl} alt="profile picture" /> */}
                    <input type="file" onChange={(event) => { setProfilePicture(event.target.files[0]) }} />
                    <button onClick={uploadProfilePicture}>Upload Profile Picture</button>
                </div>
            </div>
            <button className="nav-bar-link nav-bar-link-signout" onClick={logout}>Sign out</button>

        </div>
    )
}

export default User;




