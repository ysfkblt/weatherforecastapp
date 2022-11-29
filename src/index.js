import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import ImageUpload from "./ImageUpload"
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
//   <React.StrictMode>
<Router>
<div>

    <h1>test this is in index.js. components should be below</h1>
    <ImageUpload />
</div>
	</Router>
//   </React.StrictMode>
)
