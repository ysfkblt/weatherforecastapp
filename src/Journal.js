import { useState, useEffect } from "react"
import { addDoc, collection, doc, getDocs } from "firebase/firestore"
import { db } from "./firebase-config"
import { storage } from "./firebase-config"
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage"
const Journal = () => {
  const [worms, setWorms] = useState([])
  const [userId, setUserId] = useState("2")
  const [imageToUpload, setImageToUpload] = useState(null)
  const [date,setDate]=useState(null)
  const [imageList, setImageList] = useState([])
  const [newNotes, setNewNotes] = useState(null)
  // const [imageUrl, setImageUrl]=useState(null)
  const wormCollection = collection(db, "worms")
  const imageListRef = ref(storage, `${userId}`)
  useEffect(() => {
    const getWorms = async () => {
      const data = await getDocs(wormCollection)
      setWorms((data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
    }
    getWorms()

    // listAll(imageListRef).then((response) => {
    //   response.items.forEach((item) => {
    //     getDownloadURL(item).then((url) => {
    //       setImageList((prev) => [...prev, url])
    //     })
    //   })
    // })
  }, [])

  const uploadImage = () => {
    if (imageToUpload == null) return (addDoc(wormCollection,{image:"", notes:newNotes}))
    const imageRef = ref(storage, `${userId}/${imageToUpload.name}`)
    uploadBytes(imageRef, imageToUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageList((prev) => [...prev, url])
        addDoc(wormCollection,{image:url, notes:newNotes, title:date})
        setWorms((prev)=> [...prev, {image:url, notes:newNotes, title:date}])
      })
    })
  }

  return (
    <>
      <div>
        {/* {worms[0].journal.entry1.image} */}
      </div>
      <div>

      <div> Add new entry:</div>
      <div className="imgUpload">
        <input type="date" value={date}onChange={(event) => { setDate(event.target.value) }} />
        <div>

        <input type="file" onChange={(event) => { setImageToUpload(event.target.files[0]) }} />
        </div>
        <div>

        <label>Notes:</label>
        <input  value={newNotes} onChange={(event) => { setNewNotes(event.target.value) }} placeholder="Add notes here" size={50} style={{height: "7vh"}}/>
        </div>
        <button onClick={uploadImage} style={{border: "1px solid black"}}> Upload Entry </button>
      </div>
      </div>
<div> Previous entries:</div>
      <div>{worms.map((worm)=>{
        return (
          <>
          <h2>{worm.title}</h2>
        <img src={worm.image} style={{width: "50vw"}}/>
        <div> Notes:{worm.notes} </div>
        </>
          )
      })}</div>
      {/* show all images in storage folder
      {imageList.map((url) => {
        return <img src={url} width={"300"} />
      })} */}
    </>
  )
}

export default Journal
