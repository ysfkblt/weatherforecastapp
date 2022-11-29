import { useState, useEffect } from "react"

import { storage } from "./firebase-config" 
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage" 
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
  const [userId, setUserId]=useState("2")
  const [imageToUpload, setImageToUpload] = useState(null)
  const [imageList,setImageList]=useState([])
  let count=0

useEffect(()=>{
listAll(imageListRef).then((response)=>{
  console.log(count++)
  console.log(response)
  response.items.forEach((item)=>{
    console.log("*****item")
    console.log(item)
    getDownloadURL(item).then((url)=> {
      console.log("*****URL")
      console.log(url)
     return setImageList((prev)=>[...prev, url])
    })
  })
})
},[])

const imageListRef=ref(storage, `${userId}`)
const uploadImage= () =>{
if (imageToUpload==null) return
const imageRef= ref(storage, `${userId}/${imageToUpload.name}`)
uploadBytes(imageRef, imageToUpload).then((snapshot)=> {
  getDownloadURL(snapshot.ref).then((url)=>{

    setImageList((prev)=> [...prev, url])
  })
})

}

  return (
    <>
      <div className="imgUpload"> 
    <input type="file" onChange={(event)=> {setImageToUpload(event.target.files[0])}}/>
    <button onClick={uploadImage}> Upload Image </button>
      </div>
      {imageList.map((url)=> {
        {console.log(url)}
        return <img src={url} width={"300"}/>
      })}
    </>
  )
}

export default ImageUpload
