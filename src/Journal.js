import { useState, useEffect, Children } from "react"
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { auth, db } from "./firebase-config"
import { storage } from "./firebase-config"
import { connectStorageEmulator, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage"
import { onAuthStateChanged } from "firebase/auth"
import { Link, useParams } from "react-router-dom"
import Popup from 'reactjs-popup'
import Test from "./OneEntry"
import OneEntry from "./OneEntry"
const Journal = (props) => {
  const [worms, setWorms] = useState([])
  // const [userId, setUserId] = useState("2")
  const [imageToUpload, setImageToUpload] = useState("")
  const [date, setDate] = useState()
  const [newNotes, setNewNotes] = useState('')
  const [user, setUser] = useState("")
  const [updateNotes, setUpdateNotes]=useState("")
  const [search, setSearch]=useState("")
  // const [imageUrl, setImageUrl]=useState(null)
const {userId}=props
  //collection connects us to our firestore DB. db is from the firebase-config.js and the 2nd variable is the table name
  const wormCollection = collection(db, "worms", props.userId, "journal")
  const wormIdCollection = collection(db, "worms")
  // console.log(wormCollection)
  // console.log("THIS IS WORM COLLECTION")
  //ref is for the firebase storage; storage is from the firebase-config.js file and the 2nd variable is folder name

  //query lets us filter through our database. first variable is the specific table you want access to and the 
  //where takes 3 variables, 1st is the key in the table, 2nd is relation between 1st and 2nd var, 3rd is what you are looking for in the table
  const q = query(wormIdCollection, where("id", "==", props.userId))
  async function wormCollectionDocsync(){
    let loadingData=await getDocs(wormCollection)
    // console.log( loadingData, "*****")  
    return loadingData
}
  useEffect( () => {
    //this helps us remember if we are logged in and able to get the logged in user data
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    //getDocs loads all the info from the collection we want. we can put wormCollection for all users data or q for filtered data
    async function getworms(){ 
      const data1 = await getDocs(q)
      const datas = await getDocs(wormCollection)
      await setWorms((datas.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
        }

     getworms()
  }, [])
// console.log(worms)
  const uploadImage = async () => {
    let datas = await getDocs(wormCollection)
    //use addDoc to add data to the table; first var is the table name, 2nd is the data you want to add
    if (imageToUpload == null){
      addDoc(wormCollection, { notes: newNotes, date:date})
      setWorms((prev) => [...prev, { notes: newNotes, date: date}])
      setWorms((datas.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
      return 
    }
    //ref is to get the specfic storage folder. first var is from the firebase-config and 2nd is the location/nameofphoto
    const imageRef = ref(storage, `${userId}/${imageToUpload.name}`)
    uploadBytes(imageRef, imageToUpload).then((snapshot) => {
       datas = getDocs(wormCollection)

      getDownloadURL(snapshot.ref).then(async (url) => {
       const newDoc= await addDoc(wormCollection, { image: url, notes: newNotes, date: date })
       console.log(newDoc, "*****")
        setWorms((prev) => [...prev, { id:newDoc.id,image: url, notes: newNotes, date: date}])
        // setWorms((datas.docs.map((doc) => ({ ...doc.data(), id: doc.id}))))
        console.log(worms)
      })
    })
  }


// allow users to see the input box to edit notes
function editNotes(entry, index){
  setUpdateNotes(entry.notes)
  const editInputArea=document.querySelectorAll(".editArea")
  const currentEditInputArea=editInputArea[index]
  currentEditInputArea.classList.toggle("show")        

  // setStatus("")
  // setStatus2("hidden")
}
// submit the updated notes

async function submitEdit(entry, index){
  const editInputArea=document.querySelectorAll(".editArea")
  const currentEditInputArea=editInputArea[index]
  currentEditInputArea.classList.toggle("show")        

  const data=doc(db, "worms", props.userId, "journal", entry.id)
  await updateDoc(data, {notes:updateNotes})
  const datas = await getDocs(wormCollection)
  await setWorms((datas.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))

}

async function deleteNotes(entry){
  console.log(entry,"@@@@")
  const data=doc(db, "worms", props.userId, "journal", entry.id)
  console.log(data,"BEFORE")
  await deleteDoc(data)
  await setWorms(worms.filter((worm=> worm!=entry)))
  console.log(data,"AFTER")
}


worms.sort((a,b)=>{
  let da = new Date(a.date),
  db = new Date(b.date);
return da - db
})


  function searchPage(keyWord){
    console.log(keyWord)
    const result= worms.filter((worm)=>{
      let notes=worm.notes.split(" ")
      console.log(notes, "NOTESSS")
  return notes.includes(keyWord)
})
setWorms(result)  
}
// searchPage("test")
// Get current date
  let newDate = new Date();
  let defaultDate = newDate.toISOString()

  return (
  
    <div className="journal-container">
            <input className="journal-search" value={search} onChange={(event) => { setSearch(event.target.value); searchPage(event.target.value) }} placeholder="Search..." size={50} style={{ height: "7vh" }} />
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
          {worms
          ?
                  worms.map((entryData, index)=>{
                      return (
                      <div> 
                       {/* { console.log(entry)} */}
                      <button onClick={(event)=>deleteNotes(entryData)}>Delete</button>
                      <h2> {entryData.date} </h2>
                      <img src={entryData.image}/>
                      <div >
                        {entryData.notes}  
                        {/* <Link to={`/journal/${entryData.id}`}> */}
                        <button onClick={(event)=>editNotes(entryData, index)} >Edit</button>
                        {/* </Link> */}
                      </div>
                      {// assign attribute? or id? 
                      }
                      <span className="editArea">
                      <input className="edit" value={updateNotes} onChange={(event) => { setUpdateNotes(event.target.value) }} placeholder="Update notes here" size={50} style={{ height: "7vh" }} />
                      <button onClick={(event)=>submitEdit(entryData, index)}>Submit</button>
                      </span>
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
