import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { collection, getDocs, query, where } from "firebase/firestore"
import { useParams } from "react-router-dom"
import { auth, db } from "./firebase-config"

// point to collection
// get the plantid from params
// then use firestore query method

// const PROPS_TEMPORARY_VARIABLE_HERE = 1

const SinglePlantView = () => {
  const [singlePlant, setSinglePlant] = useState([])
  const plantCollection = collection(db, "plants")
  const { plantId } = useParams()
  const fireStoreQuery = query(plantCollection, where("id", "==", plantId))

  useEffect(() => {
    async function getSinglePlant() {
      let singlePlantData = await getDocs(fireStoreQuery)
      setSinglePlant(singlePlantData)
      //   return singlePlantData
    }
    getSinglePlant()
  }, [])

  console.log("========single plant", singlePlant)

  return (
    <>
      <div>hi</div>
    </>
  )
}
export default SinglePlantView
