import { useState, useEffect } from "react"
import { addDoc, collection, getDocs } from "firebase/firestore"
import { db, dbReal } from "./firebase-config"
import { storage } from "./firebase-config"
import { getDownloadURL, listAll, uploadBytes } from "firebase/storage"
import { onValue, ref, getDatabase } from "firebase/database"
const Database = () => {
const database=getDatabase()

console.log(database)

// const starCountRef = ref(db, 'posts/' + postId + '/starCount');
// onValue(starCountRef, (snapshot) => {
// //   const data = snapshot.val();
//   console.log(data)
//   updateStarCount(postElement, data);
// });
//     useEffect(()=>{
// onValue(ref(dbReal),
// (snapshot)=>{
//     const data=snapshot.val()
// if(data!== null){
//     console.log(data)
// }
// }
// )

//     })
  return (
    <>
      
    </>
  )
}

export default Database
