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
import background, { gradient } from "../components/background"


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
            const editInputArea = document.querySelectorAll(".profileEdit")
            const currentEditInputArea = editInputArea[0]
            currentEditInputArea.classList.toggle("show")        
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
        const editInputArea = document.querySelectorAll(".displayNameEdit")
        const currentEditInputArea = editInputArea[0]
        currentEditInputArea.classList.toggle("show")    } catch (error) {
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
        const data = doc(db, "worms", props.user.uid, "personal", personalId)
        if(newData.docs[0].data().zone===zone.zone){

            await updateDoc(data, { zipcode: newZip, coordinates:zone.coordinates })
        } else {
            console.log(zone.zone)
            await updateDoc(data, { zipcode: newZip, zone:zone.zone, coordinates:zone.coordinates })

        }
        setCurrentZip(newZip)
        const editInputArea = document.querySelectorAll(".ZipEdit")
        const currentEditInputArea = editInputArea[0]
        currentEditInputArea.classList.toggle("show")
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

  function edit(evt, name){
    console.log(evt.target.test)
    const editInputArea = document.querySelectorAll(`.${name}`)
    const currentEditInputArea = editInputArea[0]
    currentEditInputArea.classList.toggle("show")

  }
//   console.log(props.user)
//   getDatas()
    return (
        <div className="overallBackground" style={{ backgroundImage: background.sunny }}>

        <div className="page-container">
        <div className="user-container">
            <div className="user-profile-container-top">
            <div className="user-top">

            <div>
                    <i className="fa fa-pencil" aria-hidden="true" onClick={(evt)=>{edit(evt, "profileEdit")}}></i>
                <img src={profilePictureUrl} width={90}/>
                <div className="user-profile-picture-container">
                    {/* <img src={profilePictureUrl} alt="profile picture" /> */}
                    <div className="profileEdit">
                    <input type="file" onChange={(event) => { setProfilePicture(event.target.files[0]) }} />
                    <button onClick={uploadProfilePicture}>Upload Profile Picture</button>
                    </div>
                </div>
                </div>
            </div>
             
             <div>
            <h1>{updatedDisplayName===""?currentUser.displayName: updatedDisplayName}'s Profile</h1>
                <div>{currentUser.email}</div>
             </div>
        <div>
            
        </div>
            </div>
            <div className="user-profile-container">
                <div> Edit Account Info:</div>
                <div><i className="fa fa-pencil" aria-hidden="true" onClick={(evt)=>{edit(evt, "displayNameEdit")}}></i>User Name:{updatedDisplayName===""?currentUser.displayName: updatedDisplayName}</div>
                <div className="displayNameEdit">
                <input  value={newDisplayName} onChange={(event) => { setNewDisplayName(event.target.value) }} placeholder="Update Display Name" size={90} style={{ height: "7vh" }} />
                <button onClick={(event)=>updateDisplayName()}>Update Display Name</button>
                </div>
                {/* <div>{currentUser.email}</div>
                <input value={newEmail} onChange={(event) => { setNewEmail(event.target.value) }} placeholder="Update Email" size={90} style={{ height: "7vh" }} />
                <button onClick={(event)=>updateNewEmail()}>Update Email</button> */}
                <div><i className="fa fa-pencil" aria-hidden="true"  onClick={(evt)=>{edit(evt, "ZipEdit")}}></i>ZIP:{currentZip}</div>
                <div className="ZipEdit">

                <input value={newZip} onChange={(event) => { setNewZip(event.target.value) }} placeholder="Update Zipcode" size={90} style={{ height: "7vh" }} />
                <button onClick={(event)=>updateZip()}>Update Zipcode</button>
                </div>
               
            </div>
            <button className="nav-bar-link nav-bar-link-signout" onClick={logout}>Sign out</button>

        </div>
        </div>
        </div>
    )
}

export default User;




