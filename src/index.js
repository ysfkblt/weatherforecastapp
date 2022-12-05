import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import "./toggleDark.css"
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from "./Navbar";
import AppRoutes from "./AppRoutes";
import Footer from './Footer';
import ThemeContextWrapper from "./themeContextWrapper";

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    // Theme context wrapper is used to provide the theme context to all the components it does this by wrapping the components in the ThemeContext.Provider
    // The provider is located in the themeContextWrapper.js file
    // You can edit the theme in the toggleDark.css file
    
    <ThemeContextWrapper>
        <React.StrictMode>
            <Router>
                <Navbar />
                {/* <h1>test this is in index.js. components should be below</h1> */}
                {/* <ImageUpload /> */}
                <AppRoutes />
                {/* <Footer /> */}
                {/* <Database /> */}
                {/* <DisplayZone /> */}
                {/* <PlantSuggestions/> */}
            </Router>
        </React.StrictMode>
    </ThemeContextWrapper>

)
