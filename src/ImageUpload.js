import { useState, useEffect } from "react"
import { db } from "./firebase-config"
import { collection, getDocs } from "firebase/firestore"

import { storage } from "./firebase-config" 
import { ref, uploadBytes } from "firebase/storage" 
// import {v4} from "uuid"
const ImageUpload = () => {
//   const [worm, setWorm] = useState([])
//   const wormCollection = collection(db, "worms")
//   useEffect(() => {
//     const getWorms = async () => {
//       const data = await getDocs(wormCollection)
//       console.log(data)
//     }
//     getWorms()
//   }, [])

  const [imageToUpload, setImageToUpload] = useState(null)

const uploadImage= () =>{
if (imageToUpload==null) return
const imageRef= ref(storage, `images/${imageToUpload.name}`)
uploadBytes(imageRef, imageToUpload).then(()=> {
    alert("Image Uploaded")
})
}

  return (
    <>
      <div className="imgUpload"> 
    <input type="file" onChange={(event)=> {setImageToUpload(event.target.files[0])}}/>
    <button onClick={uploadImage}> Upload Image </button>
      </div>
    </>
  )
}

export default ImageUpload
