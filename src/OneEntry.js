import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
// import Popup from 'reactjs-popup';
import { db } from './firebase-config';


const OneEntry = (props) => {
    const {entryId}=useParams()
    console.log(entryId)
    const [worms, setWorms] = useState([])
    const [updateNotes, setUpdateNotes]=useState("")
    const wormCollection = collection(db, "worms", props.userId, "journal")
    const q = query(wormCollection, where("id", "==", entryId))
console.log(q)
    async function submitEdit(entry){
        const data=doc(db, "worms", props.userId, "journal", entry.id)
        await updateDoc(data, {notes:updateNotes})
        const datas = await getDocs(wormCollection)
        await setWorms((datas.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
      }

    return (
        <div>
     <span >
    {/* <input className="edit" value={updateNotes} onChange={(event) => { setUpdateNotes(event.target.value) }} placeholder="Update notes here" size={50} style={{ height: "7vh" }} />
    <button onClick={(event)=>submitEdit(entryData)}>Submit</button> */}
     </span>
        </div>
    )
}

export default OneEntry