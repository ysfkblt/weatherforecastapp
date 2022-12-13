import { useState, useEffect } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { useParams } from "react-router-dom"
import { db } from "../database/firebase-config" // STEP 1
import { forceWebSockets } from "firebase/database"
import AddFavorite from "../components/AddFavorite"
import DeleteFavorite from "../components/DeleteFavorite"
import { Link } from "react-router-dom"
import background, { gradient } from "../components/background"

/** ========= firestore DB querying for one item in a collection =====================
// 1. import the db connection to the firestore as configured earlier
// 2. get the plantid (aka document ID) from params
// 3. point to collection we want in firestore "name"
// 4. then use firestore query method to pull the specific plant from attached to the specific document
// 5. once we have the query, need to parse the data with getDocs
// 6. additional parsing of the data to make it a normal object. not super sure how ...doc.data() exactly works
// OUTPUT: the useState singlePlant is now a single plant object, as in the database.
 */
const SinglePlantView = (props) => {
  const [singlePlant, setSinglePlant] = useState([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [userFavorites, setUserFavorites] = useState([])
  const { plantId } = useParams() // STEP 2
  const {userId} = props
  const plantCollection = collection(db, "testPlants") //STEP 3
  const userFavoritesCollection = collection(db, "worms", userId, "favorites")

  async function getFavorites() {
    const data = await getDocs(userFavoritesCollection)
    const dataDocs = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    let userFavorites = []
    dataDocs.forEach(plant => userFavorites.push(plant.plantId))
    if (userFavorites.includes(plantId)) {
      setIsFavorite(true)
    }
    await setUserFavorites(dataDocs)
  }

  const removeFavorite = (thisPlantsId) => {
    let toBeDeletedData = userFavorites.filter(x => (x.plantId === thisPlantsId))
    console.log(userFavorites)
    DeleteFavorite(toBeDeletedData, userId)
    let toBeNewFavorites = userFavorites.filter(x => (x.plantId !== thisPlantsId))
    setUserFavorites(toBeNewFavorites)
  }

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
    getFavorites()
  }, [])

  // if (userFavorites2.includes(plantId)) {
  //   setIsFavorite(true)
  // }

  if (singlePlant.length) {
    console.log(singlePlant.length)
    console.log("above is truthy")
  }

  console.log(singlePlant)
  console.log("ending single plant", singlePlant[0])
  //   console.log("ending single plant", singlePlant[0].name)

  return (
    <div className="overallBackground" style={{ backgroundImage: background.sunny }}>

    <div className="page-container">
    <div>
      {singlePlant.length ? (
        <div className="single-plant-view-main-container">
          <div className="singlePlant-title-container">
            <div>{isFavorite ? (
              <div onClick={() => {
                setIsFavorite(false)
                removeFavorite(plantId)
              }}><i className="fa fa-heart" aria-hidden="true"></i></div>
              ) : (
              <div onClick={() => {
                setIsFavorite(true)
                AddFavorite(plantId, userId)
              }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
              )}
            </div>
            <div><h2>{singlePlant[0].name}</h2></div>
          </div>
          <div className="singlePlantImageContainer">
            <img src={singlePlant[0].img} className="singlePlantImg" alt="plant" />
          </div>
          <div>
            <h4>Growing Care</h4>
            <ul>
              <li>Life cycle: {singlePlant[0].life.includes('a') ? "annual" : 
                  (singlePlant[0].life.includes('b') ? "biannual" : 'perennial')}</li>
              <li>Plant type: {singlePlant[0].type}</li>
              <li>Sowing Method: {singlePlant[0].sowingMethod}</li>
              <li>Sowing Depth: {singlePlant[0].sowingDepth}</li>
              <li>Sowing spacing: {singlePlant[0].spaceInches}</li>
              <li>Sun requirements: {singlePlant[0].transplantTo}</li>
              <li>When to sow seeds: {
                (singlePlant[0].weeksBeforeLastFrost < -4) ? "Late Winter" : 
                  (((singlePlant[0].weeksBeforeLastFrost >= -4) && (singlePlant[0].weeksBeforeLastFrost <= -1)) ? 
                    "Spring before last frost" : 
                     (((singlePlant[0].weeksBeforeLastFrost >= 0) && (singlePlant[0].weeksBeforeLastFrost <= 2)) ? 
                     "Spring just after last frost" :
                      (((singlePlant[0].weeksBeforeLastFrost >= 3) && (singlePlant[0].weeksBeforeLastFrost <= 8)) ? 
                        "Mid to Late Spring" : 
                          (((singlePlant[0].weeksBeforeLastFrost >= 9) && (singlePlant[0].weeksBeforeLastFrost <= 12)) ? 
                            "Early Summer" : 
                              (((singlePlant[0].weeksBeforeLastFrost >= 13) && (singlePlant[0].weeksBeforeLastFrost <= 18)) ? 
                                "Summer" : 
                                  (((singlePlant[0].weeksBeforeLastFrost >= 19) && (singlePlant[0].weeksBeforeLastFrost <= 24)) ? 
                                    "Late Summer" : "Fall"))))))
              }</li>
            </ul>
            <div className="SinglePlant-ViewAllLink"><Link to="/allplants">Back to View All</Link></div>
          </div>
        </div>
      ) : null}
    </div>
    </div>
    </div>
  )
}
export default SinglePlantView
