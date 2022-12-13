import { useState, useEffect } from "react"
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { auth, db } from "../database/firebase-config"
import { storage } from "../database/firebase-config"
import background, { gradient } from "../components/background"

import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { onAuthStateChanged } from "firebase/auth"
// import { Link, useParams } from "react-router-dom"
// import Popup from 'reactjs-popup'
import logo from "../assets/logos/worm-logo-3.png"


const Journal = (props) => {
  const [worms, setWorms] = useState([])
  const [wormsBackup, setWormsBackup] = useState([])
  const [imageToUpload, setImageToUpload] = useState("")
  const [date, setDate] = useState()
  const [newNotes, setNewNotes] = useState('')
  const [user, setUser] = useState("")
  const [updateNotes, setUpdateNotes] = useState("")
  const [search, setSearch] = useState("")
  const { userId } = props
  //collection connects us to our firestore DB. db is from the firebase-config.js and the 2nd variable is the table name
  const wormCollection = collection(db, "worms", userId, "journal")
  const wormIdCollection = collection(db, "worms")

  //query lets us filter through our database. first variable is the specific table you want access to and the 
  //where takes 3 variables, 1st is the key in the table, 2nd is relation between 1st and 2nd var, 3rd is what you are looking for in the table
  const q = query(wormIdCollection, where("id", "==", userId))

  async function wormCollectionDocsync() {
    let loadingData = await getDocs(wormCollection)
    return loadingData
  }
  useEffect(() => {
    //this helps us remember if we are logged in and able to get the logged in user data
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    //getDocs loads all the info from the collection we want. we can put wormCollection for all users data or q for filtered data
    async function getworms() {
      // const data1 = await getDocs(q)
      const datas = await getDocs(wormCollection)
      await setWorms((datas.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
      await setWormsBackup((datas.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
    }
    getworms()
  }, [])

  const addnotes=()=>{
    
    const editInputArea = document.querySelectorAll(".add-entry-area")
        const currentEditInputArea = editInputArea[0]
        currentEditInputArea.classList.toggle("show")
  }
  const uploadEntry = async () => {
    let datas = await getDocs(wormCollection)
    //use addDoc to add data to the table; first var is the table name, 2nd is the data you want to add
    if (imageToUpload == null) {
      addDoc(wormCollection, { notes: newNotes, date: date })
      setWorms((prev) => [...prev, { notes: newNotes, date: date }])
      setWormsBackup((prev) => [...prev, { notes: newNotes, date: date }])
      setWorms((datas.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
      setWormsBackup((datas.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
      return
    }
    //ref is to get the specfic storage folder. first var is from the firebase-config and 2nd is the location/nameofphoto
    const imageRef = ref(storage, `${userId}/${imageToUpload.name}`)
    uploadBytes(imageRef, imageToUpload).then((snapshot) => {
      datas = getDocs(wormCollection)
      getDownloadURL(snapshot.ref).then(async (url) => {
        const newDoc = await addDoc(wormCollection, { image: url, notes: newNotes, date: date })
        setWorms((prev) => [...prev, { id: newDoc.id, image: url, notes: newNotes, date: date }])
        setWormsBackup((prev) => [...prev, { id: newDoc.id, image: url, notes: newNotes, date: date }])
      })
    })
  }


  // allow users to see the input box to edit notes
  function editNotes(entry, index) {
    setUpdateNotes(entry.notes)
    const editInputArea = document.querySelectorAll(".editArea")
    const currentEditInputArea = editInputArea[index]
    currentEditInputArea.classList.toggle("show")
    // const editInputArea1 = document.querySelectorAll(".editButton")
    // const currentEditInputArea1 = editInputArea1[index]
    // currentEditInputArea1.classList.toggle("show")
    
  }

  async function submitEdit(entry, index) {
    const editInputArea = document.querySelectorAll(".editArea")
    const currentEditInputArea = editInputArea[index]
    currentEditInputArea.classList.toggle("show")
    const data = doc(db, "worms", props.userId, "journal", entry.id)
    await updateDoc(data, { notes: updateNotes })
    const datas = await getDocs(wormCollection)
    await setWorms((datas.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
    await setWormsBackup((datas.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))

  }

  async function deleteNotes(entry) {
    const data = doc(db, "worms", props.userId, "journal", entry.id)
    await deleteDoc(data)
    await setWorms(worms.filter((worm => worm !== entry)))
    await setWormsBackup(worms.filter((worm => worm !== entry)))
  }

  worms.sort((a, b) => {
    let da = new Date(a.date),
      db = new Date(b.date);
    return da - db
  })

  // async function reloadData(){
  //   const datas = await getDocs(wormCollection)
  //   await setWorms((datas.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
  // }

  async function searchPage(keyWord) {
    let result = []
    if (keyWord.length > 0) {
      result = wormsBackup.filter((worm) => {
        if (worm.notes.includes(keyWord)) {
          return worm
        }
      })
    } else {
      setWorms(wormsBackup)
    }
    if (result.length > 0) {
      setWorms(result)
    } else if (keyWord.length > 0) {
      alert("Cannot find matching entry")
    }
  }

  // Get current date
  let newDate = new Date();
  let defaultDate = newDate.toISOString()

  return (
    <div className="overallBackground" style={{ backgroundImage: background.sunny }}>
    <div className="page-container"  >
   
    <div className="journal-container" >
      <h1>Plant Journal</h1>
      {/* <button onClick={(event)=> searchPage(search)}>Search</button> */}
      <div className="journal-form">
        <h1 className="journal-form-heading" onClick={(evt)=>addnotes()}> Add new entry</h1>
        <div className="add-entry-area">
        <div className="imgUpload">
          <input className="journal-form-date-input" type="date" value={date} defaultValue={defaultDate} onChange={(event) => { setDate(event.target.value) }} />
          <div>
            <input className="journal-form-file-input button" type="file" onChange={(event) => { setImageToUpload(event.target.files[0]) }} />
          </div>
          <div className="journal-notes-container">
          <div>

            <label className="journal-notes-label">Notes:</label>
            <textarea className="journal-notes-input" maxLength={1000} autoFocus={true} value={newNotes} onChange={(event) => { setNewNotes(event.target.value) }} placeholder="Add notes here"></textarea>
            </div>

            <div>
          <button className="journal-notes-image-upload-button" onClick={uploadEntry}> Upload Entry
          </button>
            </div>
        </div>
          </div>
        </div>
      </div>

      <div className="journal-previous-entries-container">
      <input className="journal-search" value={search} onChange={(event) => { setSearch(event.target.value); searchPage(event.target.value) }} placeholder="Search..." size={50} />
        <p className="journal-previous-entries-heading"> Previous entries: </p>
        <div>
          {worms
            ?
            worms.map((entryData, index) => {
              return (
                <div className="journal-previous-entries" key={index}>
                  <h2 className="journal-previous-entries-date"> {entryData.date} </h2>
                  <img src={entryData.image} className="journal-previous-entries-image" />
                  
                  <div className="journal-previous-entries-notes">
                    {entryData.notes} 
                  </div>
                  <div>
                  <button onClick={(event) => editNotes(entryData, index)} className="editButton">Edit</button>
                  <span className="editArea">
                    <input className="journal-notes-edit" value={updateNotes} onChange={(event) => { setUpdateNotes(event.target.value) }} placeholder="Update notes here"  />
                    <button onClick={(event) => submitEdit(entryData, index)}>Submit</button>
                  </span>
                  <button onClick={(event) => deleteNotes(entryData)}>Delete</button>
                    </div>
                </div>)
            }
            ) : "No entries"
          }
        </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Journal
