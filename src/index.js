import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import ImageUpload from "./ImageUpload"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <h1>test this is in index.js. components should be below</h1>
    <ImageUpload />
  </React.StrictMode>
)
