import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import Auth from "./Auth";
import { auth } from "./firebase-config";
import Home from "./Home";
import Journal from "./Journal";

const AppRoutes= ()=>{
    const [user, setUser] = useState("")

    useEffect(()=>{
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser)
      })
    },[])
console.log(user,"#$%##$")


    return (
        <>
        <Routes>
            <Route path="/" element={<App/>}/>
            <Route path="/journal" element={<Journal userId={user.uid}/>  }/>
            <Route path="/signUp" element={<Auth/>}/>

        </Routes>
        </>
    )
}

export default AppRoutes
