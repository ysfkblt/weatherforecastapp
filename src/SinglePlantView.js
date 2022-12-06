import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { collection, getDocs, query, where } from "firebase/firestore"
import { useParams } from "react-router-dom"
import { auth, db } from "./firebase-config" // STEP 1

/** ========= firestore DB querying for one item in a collection =====================
// 1. import the db connection to the firestore as configured earlier
// 2. get the plantid (aka document ID) from params
// 3. point to collection we want in firestore "name"
// 4. then use firestore query method to pull the specific plant from attached to the specific document
// 5. once we have the query, need to parse the data with getDocs
// 6. additional parsing of the data to make it a normal object. not super sure how ...doc.data() exactly works
// OUTPUT: the useState singlePlant is now a single plant object, as in the database.
 */
const SinglePlantView = () => {
  const [singlePlant, setSinglePlant] = useState([])
  const { plantId } = useParams() // STEP 2
  const plantCollection = collection(db, "plants") //STEP 3

  // STEP 4
  // const fireStoreQuery = query(plantCollection, where("id", "==", plantId)) // this method is WRONG, it looks only IN the document. the id in the document is a number.
  // the below method queries for the name OF the document
  const fireStoreQuery = query(
    plantCollection,
    where("__name__", "==", plantId)
  )

  useEffect(() => {
    async function getSinglePlant() {
      let singlePlantData = await getDocs(fireStoreQuery) //STEP 5
      setSinglePlant(singlePlantData.docs.map((doc) => ({ ...doc.data() }))) // STEP 6
    }
    getSinglePlant()
  }, [])

  if (singlePlant.length) {
    console.log(singlePlant.length)
    console.log("above is truthy")
  }

  console.log(singlePlant)
  console.log("ending single plant", singlePlant[0])
  //   console.log("ending single plant", singlePlant[0].name)

  return (
    <div>
      {singlePlant.length ? (
        <div className="single-plant-view-main-container">
          <h2>{singlePlant[0].name}</h2>
          <h5>{singlePlant[0].species}</h5>
          <div>
            <img
              src="https://www.world-grain.com/ext/resources/2022/09/21/Wheat_photo-cred-Adobe-stock_E-2.jpg?t=1663769040&width=1080"
              className="allPlantsImg"
            />{" "}
            IMAGE IS JUST HARDCODED - TEMPORARY
          </div>{" "}
          <br />
          <div>
            <h4>Growing Care</h4>
            <ul>
              <li>Life cycle: {singlePlant[0].life}</li>
              <li>Plant type: {singlePlant[0].type}</li>
              <li>Sowing Method: {singlePlant[0].sowingMethod}</li>
              <li>Sowing Depth: {singlePlant[0].sowingDepth}</li>
              <li>Sowing spacing: {singlePlant[0].spaceInches}</li>
              <li>Sun requirements: {singlePlant[0].transplantTo}</li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}
export default SinglePlantView
