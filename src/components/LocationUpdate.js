import { useEffect } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../database/firebase-config";

export default function UpdateZipCode(props) {
  const { userId } = props;
  const wormIdCollection = collection(db, "worms");
  const q = query(wormIdCollection, where("id", "==", userId));

  useEffect(() => {
    const wormCollection = collection(db, "worms", userId, "personal");
    async function getworms() {
      const data1 = await getDocs(q);
      if (data1.docs.length === 0) {
        addDoc(wormCollection, {
          zip: props.zip,
          zone: props.zone,
          coordinates: props.coordinates,
        });
      }
      addDoc(wormCollection, { zip: props.zip, zone: props.zone });
    }
    getworms();
  }, []);

  return <></>;
}
