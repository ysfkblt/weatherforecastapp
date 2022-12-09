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
import { auth, db} from "../database/firebase-config"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../database/firebase-config"
import { UserContext } from "../components/UserProvider"
import { useUser } from "../components/UserProvider"
import { set } from "firebase/database"
import { collection, doc, getDocs, updateDoc } from "firebase/firestore"


const User = (props) => {
    const [currentUser, setCurrentUser] = useState("")
    const [updatedDisplayName, setUpdatedDisplayName] = useState("")
    const [profilePicture, setProfilePicture] = useState("")
    const [profilePictureUrl, setProfilePictureUrl] = useState("")
    const [newDisplayName, setNewDisplayName] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [newZip, setNewZip] = useState("")
    const [updatedip, setUpdatedZip] = useState("")
    const [zone, setZone] = useState("")
    const [currentZip, setCurrentZip] = useState("")
    const navigate = useNavigate()
// console.log(currentUser)
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setCurrentUser(currentUser)
        })
    }
    , [])

    useEffect(() => {
        getDatas()
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

async function updateZip(){
    try {
        const wormCollection = collection(db, "worms", props.user.uid, "personal")
        let newData = await getDocs(wormCollection)
        let personalId=newData.docs[0].id
        await getZone(newZip)
        console.log("ZIPPPP",zone)
        console.log("PERSONAL ID", personalId)
        console.log("PROPS ID", props.user.uid)
        const data = doc(db, "worms", props.user.uid, "personal", personalId)
        if(newData.docs[0].data().zone===zone.zone){

            await updateDoc(data, { zipcode: newZip, coordinates:zone.coordinates })
        } else {
            await updateDoc(data, { zipcode: newZip, zone:zone.zone, coordinates:zone.coordinates })

        }
        setCurrentZip(newZip)
        // let newData = await getDocs(wormCollection)
    } catch (error) {
        console.log(error)
    }
}
async function getZone(search) {
    let zoneResults = await fetchZone(search)
    {
      zoneResults ? setZone(zoneResults) : setZone("")
    }
  }
  const fetchZone = async (search) => {
    const response = await fetch(`https://phzmapi.org/${search}.json`)
    const data = await response.json()
    return data
  }
async function getDatas() {
    try {
        const wormCollection = collection(db, "worms", props.user.uid, "personal")
        let newData = await getDocs(wormCollection)
        console.log("ZIPPPP",newData.docs[0].data())
        setCurrentZip(newData.docs[0].data().zipcode)
    } catch (error) {
        console.log(error)
    }
     
  }
//   console.log(props.user)
//   getDatas()
    return (
        <div className="user-container">
            <div className="user-profile-container">
                <h1>{updatedDisplayName===""?currentUser.displayName: updatedDisplayName}'s Profile</h1>
                <input  value={newDisplayName} onChange={(event) => { setNewDisplayName(event.target.value) }} placeholder="Update Display Name" size={90} style={{ height: "7vh" }} />
                <button onClick={(event)=>updateDisplayName()}>Update Display Name</button>
                {/* <div>{currentUser.email}</div>
                <input value={newEmail} onChange={(event) => { setNewEmail(event.target.value) }} placeholder="Update Email" size={90} style={{ height: "7vh" }} />
                <button onClick={(event)=>updateNewEmail()}>Update Email</button> */}
                <div>ZIP:{currentZip}</div>
                <input value={newZip} onChange={(event) => { setNewZip(event.target.value) }} placeholder="Update Zipcode" size={90} style={{ height: "7vh" }} />
                <button onClick={(event)=>updateZip()}>Update Zipcode</button>
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




