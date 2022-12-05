import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import "./toggleDark.css"
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from "./Navbar";
import AppRoutes from "./AppRoutes";
import ThemeContextWrapper from "./themeContextWrapper";

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <ThemeContextWrapper>
        <React.StrictMode>
            <Router>
                <Navbar />
                {/* <h1>test this is in index.js. components should be below</h1> */}
                {/* <ImageUpload /> */}
                <AppRoutes />
                {/* <Database /> */}
                {/* <DisplayZone /> */}
                {/* <PlantSuggestions/> */}
            </Router>
        </React.StrictMode>
    </ThemeContextWrapper>

)
