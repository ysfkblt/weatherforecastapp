import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import Home from "./Home";
import Journal from "./Journal";

const AppRoutes= ()=>{




    return (
        <>
        <Routes>
            <Route path="/" element={<App/>}/>
            <Route path="/journal" element={<Journal/>}/>

        </Routes>
        </>
    )
}

export default AppRoutes
