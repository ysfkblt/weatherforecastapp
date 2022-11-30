import React, { useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import App from "./App"
import Auth from "./Auth"
import Home from "./Home"
import Journal from "./Journal"
import FrostDatecheck from "./FrostDateCheck"

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/signUp" element={<Auth />} />

        {/* temporary development route */}
        <Route path="/development" element={<FrostDatecheck />} />
      </Routes>
    </>
  )
}

export default AppRoutes
