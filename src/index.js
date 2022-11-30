import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import ImageUpload from "./Journal"
import { BrowserRouter as Router } from 'react-router-dom';
import Database from "./Database";
import DisplayZone from "./Zone";
import App from "./App";
import Navbar from "./Navbar";
import AppRoutes from "./AppRoutes";

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    //   <React.StrictMode>
    <Router>
            <Navbar/>
            {/* <h1>test this is in index.js. components should be below</h1> */}
            {/* <ImageUpload /> */}
            <AppRoutes/>
            {/* <Database /> */}
            <DisplayZone />
    </Router>
    //   </React.StrictMode>
)
