import { db } from "../database/firebase-config"
import { addDoc, collection } from "firebase/firestore"

// const wormCollection = collection(db, "worms", userId, "journal")

const AddFavorite = (id, userId) => {
    console.log(id)
    const wormCollection = collection(db, "worms", userId, "favorites")
    addDoc(wormCollection, { plantId: id })
}

export default AddFavorite