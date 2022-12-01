import { useState, useEffect, Children } from "react"
import { addDoc, collection, doc, getDocs, query, where } from "firebase/firestore"
import { auth, db } from "./firebase-config"
import { storage } from "./firebase-config"
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage"
import { onAuthStateChanged } from "firebase/auth"
import { useParams } from "react-router-dom"
const Journal = (props) => {
  console.log(props,"######")
  const [worms, setWorms] = useState([])
  const [userId, setUserId] = useState("2")
  const [imageToUpload, setImageToUpload] = useState("")
  const [date, setDate] = useState()
  const [imageList, setImageList] = useState([])
  const [newNotes, setNewNotes] = useState('')
  const [user, setUser] = useState("")
  const [currentChild, setCurrentChild]=useState("75IuDVBEC3dlCQuzwYcauSFLt023")
  // const [imageUrl, setImageUrl]=useState(null)

  //collection connects us to our firestore DB. db is from the firebase-config.js and the 2nd variable is the table name
  const wormCollection = collection(db, "worms", currentChild, "journal")
  const wormIdCollection = collection(db, "worms")
// console.log(wormCollection)
// console.log("THIS IS WORM COLLECTION")
  //ref is for the firebase storage; storage is from the firebase-config.js file and the 2nd variable is folder name
  const imageListRef = ref(storage, `${userId}`)

  //query lets us filter through our database. first variable is the specific table you want access to and the 
  //where takes 3 variables, 1st is the key in the table, 2nd is relation between 1st and 2nd var, 3rd is what you are looking for in the table
  const q = query(wormIdCollection, where("id", "==", "uAtivizEKFdMwOCZ98PLIYdt4EC3"))
  async function wormCollectionDocsync(){
    let loadingData=await getDocs(wormCollection)
    // console.log( loadingData, "*****")  
    return loadingData
}
// console.log(wormCollectionDocsync())
  useEffect( () => {
    //this helps us remember if we are logged in and able to get the logged in user data
    onAuthStateChanged(auth, (currentUser) => {
     setUser(currentUser)
    })
    //getDocs loads all the info from the collection we want. we can put wormCollection for all users data or q for filtered data
    async function getworms(){ 
      const datas = await getDocs(wormCollection)
      const data1 = await getDocs(q)
      console.log(data1, "******")
      if ( data1.docs.length===0){
        addDoc(wormIdCollection, { id:props.userId})
      } else {
        setCurrentChild(data1.docs[0].id)
      await setWorms((datas.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))

      }
      // console.log(datas.docs[0].data(), "%%%%%%")
    }
     getworms()
  }, [])
// console.log(worms)

  const uploadImage = () => {
    //use addDoc to add data to the table; first var is the table name, 2nd is the data you want to add
    if (imageToUpload == null) return (addDoc(wormCollection, { image: "", notes: newNotes, date:date}))
    //ref is to get the specfic storage folder. first var is from the firebase-config and 2nd is the location/nameofphoto
    const imageRef = ref(storage, `${userId}/${imageToUpload.name}`)
    //
    uploadBytes(imageRef, imageToUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        // setImageList((prev) => [...prev, url])
        addDoc(wormCollection, { image: url, notes: newNotes, date: date })
        setWorms((prev) => [...prev, { image: url, notes: newNotes, date: date}])
      })
    })
    
  }

  // Get current date
  let newDate = new Date();
  let defaultDate = newDate.toISOString()
  console.log(defaultDate)

  return (
    <div className="journal-container">

      <div className="journal-form">
        <h1 className="journal-form-heading"> Add new entry:</h1>
        <div className="imgUpload">
          <input className="journal-form-date-input" type="date" value={date} defaultValue={defaultDate} onChange={(event) => { setDate(event.target.value) }} />
          <div>
            <input className="journal-form-file-input" type="file" onChange={(event) => { setImageToUpload(event.target.files[0]) }} />
          </div>
          <div className="journal-notes-container">
            <label className="journal-notes-label">Notes:</label>
            <input className="journal-notes-input" value={newNotes} onChange={(event) => { setNewNotes(event.target.value) }} placeholder="Add notes here" size={50} style={{ height: "7vh" }} />
          </div>
          <button className="journal-notes-image-upload-button" onClick={uploadImage} style={{ border: "1px solid black" }}> Upload Entry </button>
        </div>
      </div>

      <div className="journal-previous-entries-container">

        <p className="journal-previous-entries-heading"> Previous entries: </p>

        <div>
          {
          worms
          ?
                  worms.map((entry)=>{
                      return (
                      <div> 
                      <h2> {entry.date}</h2>
                      <img src={entry.image}/>
                      <div>{entry.notes}</div>
                      </div>)
                    }
            ): "No entries"
          }
        </div>
      </div>
    </div>
  )
}

export default Journal
