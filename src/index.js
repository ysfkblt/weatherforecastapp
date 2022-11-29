import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import ImageUpload from "./ImageUpload"
import { BrowserRouter as Router } from 'react-router-dom';
import Database from "./Database";
import DisplayZone from "./Zone";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    //   <React.StrictMode>
    <Router>
        <App/>

            <h1>test this is in index.js. components should be below</h1>
            <ImageUpload />
            <Database />
            <DisplayZone />
    </Router>
    //   </React.StrictMode>
)
