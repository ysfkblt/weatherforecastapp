import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import Auth from "./Auth";
import { auth, db } from "./firebase-config";
import Home from "./Home";
import Journal from "./Journal";

const AppRoutes= ()=>{
    const [user, setUser] = useState("")
//     const wormIdCollection = collection(db, "worms")
//     const [currentChild, setCurrentChild]=useState("")

//     const q = query(wormIdCollection, where("id", "==", user.uid))

    useEffect(()=>{
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser)
      })
    //   async function data1(){
    //    let  data= await getDocs(q)
    //    setCurrentChild(data.docs[0].id)
    //   }
    //   data1()

    },[])
// console.log(currentChild)

    return (
        <>
        <Routes>
            <Route path="/" element={<App/>}/>
            <Route path="/signUp" element={<Auth/>}/>
            {user?
            <Route path="/journal" element={<Journal userId={user.uid}/>  }/>:null
        }
        
        </Routes>
        </>
    )
}

export default AppRoutes
