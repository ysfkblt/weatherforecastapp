import { db } from "../database/firebase-config";
import { deleteDoc, doc } from "firebase/firestore";

const DeleteFavorite = (data, userId) => {
  const favDoc = doc(db, "worms", userId, "favorites", data[0].id);
  deleteDoc(favDoc);
};

export default DeleteFavorite;
