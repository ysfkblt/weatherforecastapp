import { db } from "../database/firebase-config";
import { addDoc, collection } from "firebase/firestore";

const AddFavorite = (id, userId) => {
  const wormCollection = collection(db, "worms", userId, "favorites");
  addDoc(wormCollection, { plantId: id });
};

export default AddFavorite;
