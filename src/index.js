import React from "react"
import ReactDOM from "react-dom/client"
import "./assets/index.css"
import "./assets/toggleDark.css"
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from "./components/Navbar";
import AppRoutes from "./pages/AppRoutes";
import Footer from './components/Footer';
import Database from "./database/Database";
import ThemeContextWrapper from "./components/themeContextWrapper";
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    // Theme context wrapper is used to provide the theme context to all the components it does this by wrapping the components in the ThemeContext.Provider
    // The provider is located in the themeContextWrapper.js file
    // You can edit the theme in the toggleDark.css file
        <ThemeContextWrapper>
        <React.StrictMode>
            <Router>
                {/* <Navbar /> */}
                {/* <h1>test this is in index.js. components should be below</h1> */}
                {/* <ImageUpload /> */}

                <AppRoutes />
                <Footer />
                {/* <Database /> */}
                {/* <DisplayZone /> */}
                {/* <PlantSuggestions/> */}
            </Router>
        </React.StrictMode>
    </ThemeContextWrapper>

)
