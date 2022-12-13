import { useState, useEffect } from "react"
import { addDoc, collection, doc } from "firebase/firestore"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import { auth, db } from "../database/firebase-config"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../database/firebase-config"
import { useNavigate } from "react-router-dom"
import background, { gradient } from "../components/background"

const Auth = () => {
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerZipcode, setRegisterZipcode] = useState("")
  const [zone, setZone] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerDisplayName, setRegisterDisplayName] = useState("")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [currentUser, setCurrentUser] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [profileImageURL, setProfileImageURL] = useState("")
  const wormCollection = collection(db, "worms")
  const navigate = useNavigate()

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setCurrentUser(currentUser)
    })
  }, [])
  console.log(registerDisplayName)
  const register = async () => {
    try {
      let result=await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
        // .then(function (result) {
          // const imageRef = ref(storage, `${result.user.uid}/${profileImage.name}`)
          // let URL = ""
          // await uploadBytes(imageRef, profileImage)
          //   const downloadURL=getDownloadURL(imageRef)
          // setProfileImageURL(downloadURL)
          let datas= await fetchZone(registerZipcode)
          {
            datas ? setZone(datas) : setZone("")
          }
          const wormCollection = collection(db, "worms", result.user.uid, "personal")
          addDoc(wormCollection, { zipcode:registerZipcode, zone: datas.zone,
            coordinates: datas.coordinates, })

          // const data = doc(db, "worms", result.user.uid, "personal")

          navigate('/')
          return updateProfile(result.user, {
            displayName: registerDisplayName,
            photoURL: "https://img.freepik.com/premium-vector/cute-little-worm-cartoon-character_188253-3950.jpg?w=2000",
          }
          
          ).catch(function (error) {
            console.log(error);
          });
        // })

    } catch (error) {
      console.log(error.message)

    }
  }
  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      navigate('/')

    } catch (error) {
      console.log(error.message)
    }
  }

  const logout = async () => {
    await signOut(auth)
    navigate('/')

  }
  const fetchZone = async (search) => {
    const response = await fetch(`https://phzmapi.org/${search}.json`);
    const data = await response.json();
    return data;
};

  return (
    <div className="overallBackground" style={{ backgroundImage: background.sunny }}>

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
          <input className="email-password-input" type="text" placeholder="Zipcode..." value={registerZipcode} onChange={(event) => { setRegisterZipcode(event.target.value) }} />
          <input className="email-password-input" id="name" type="text" placeholder="Display Name..." value={registerDisplayName} onChange={(event) => { setRegisterDisplayName(event.target.value) }} />
          {/* <input className="email-password-input" id="phoneNumber"type="text" placeholder="Phone Number..." value={registerPassword} onChange={(event) => { setRegisterPassword(event.target.value) }} /> */}
          {/* <input className="journal-form-file-input button" id="image" type="file" onChange={(event) => { setProfileImage(event.target.files[0]) }} /> */}
          <button onClick={register}>Sign Up </button>
        </div>
      </div>

      {/* LOGIN */}

      <div className="auth-login-container">
        <div className="auth-login-form">
          <h3>Login</h3>
          <input className="email-password-input" type="text" placeholder="Email..." value={loginEmail} onChange={(event) => { setLoginEmail(event.target.value) }} />
          <input className="email-password-input" placeholder="Password..." type="text" value={loginPassword} onChange={(event) => { setLoginPassword(event.target.value) }} />
          <button onClick={login}>Login</button>
        </div>
      </div>
      </div>


    </div>
  )
}

export default Auth