import { onAuthStateChanged } from "firebase/auth"
import React, { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"
import App from "./App"
import { auth } from "../database/firebase-config"
import Journal from "./Journal"
import AllPlantsView from "./allPlants/AllPlantsView"
import SinglePlantView from "./SinglePlantView"
import Auth from "../components/Auth"
import User from "./User"

import Favorites from "./Favorites"
import GardenPlotViz from "./GardenPlotViz"

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
        <Route path="/development" element={<AllPlantsView />} />
        <Route path="/development/:plantId" element={<SinglePlantView />} />
        <Route path="/user" element={<User />} />
        <Route
          path="/development"
          element={<AllPlantsView userId={user.uid} />}
        />
        <Route
          path="/development/:plantId"
          element={<SinglePlantView userId={user.uid} />}
        />
        <Route path="/garden" element={<GardenPlotViz />} />
        {user ? (
          <>
            <Route path="/" element={<App userId={user.uid} />} />
            <Route path="/" element={<App userId={user.uid} />} />
            <Route path="/journal" element={<Journal userId={user.uid} />} />
            <Route
              path="/favorites"
              element={<Favorites userId={user.uid} />}
            />
          </>
        ) : (
          <Route path="/" element={<App />} />
        )}
      </Routes>
    </>
  )
}

export default AppRoutes
