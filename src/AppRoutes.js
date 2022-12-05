import { onAuthStateChanged } from "firebase/auth"
import { collection, getDocs, query, where } from "firebase/firestore"
import PlantSuggestions from "./PlantSuggestions.js"
import React, { useEffect, useState } from "react"
import { Route, Routes, useParams } from "react-router-dom"
import App from "./App"
import Auth from "./Auth"
import { auth, db } from "./firebase-config"
import Home from "./Home"
import Journal from "./Journal"
import Test from "./OneEntry.js"
import OneEntry from "./OneEntry.js"
import AllPlantsView from "./AllPlantsView"
import SinglePlantView from "./SinglePlantView"

const AppRoutes = () => {
  const [user, setUser] = useState("")
  //     const wormIdCollection = collection(db, "worms")
  //     const [currentChild, setCurrentChild]=useState("")
  //     const q = query(wormIdCollection, where("id", "==", user.uid))
  // console.log(user, "FROM APPROUTES")
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    //   async function data1(){
    //    let  data= await getDocs(q)
    //    setCurrentChild(data.docs[0].id)
    //   }
    //   data1()
  }, [])
  // console.log(currentChild)

  return (
    <>
      <Routes>
        <Route path="/signUp" element={<Auth />} />
        <Route path="/development" element={<AllPlantsView />} />
        <Route path="/development/:plantId" element={<SinglePlantView />} />
        {user ? (
          <>
            <Route path="/" element={<App userId={user.uid} />} />
            <Route path="/journal" element={<Journal userId={user.uid} />} />
          </>
        ) : (
          <Route path="/" element={<App />} />
        )}
      </Routes>
    </>
  )
}

export default AppRoutes
