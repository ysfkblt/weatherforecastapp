import { onAuthStateChanged } from "firebase/auth"
import React, { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"
import App from "./App"
import { auth } from "../database/firebase-config"
import Journal from "./Journal"
import AllPlantsView from "./allPlants/AllPlantsView"
import SinglePlantView from "./SinglePlantView"
import Auth from "../components/Auth"
import Calendar from "../components/Calendar"
import Images from "../database/images"
const AppRoutes = () => {
  const [user, setUser] = useState("")
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
  }, [])

  return (
    <>
      <Routes>
        <Route path="/signUp" element={<Auth />} />
        <Route path="/images" element={<Images />} />
        <Route path="/calendar" element={<Calendar />} />
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
