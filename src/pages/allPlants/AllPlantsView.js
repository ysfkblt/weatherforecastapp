import { useState, useEffect } from "react"
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore"
import { db } from "../../database/firebase-config"
import { Link } from "react-router-dom";
import Checkbox from "./checkboxes"
import flowers2 from '../../database/plantDatabase'
import AddFavorite from "../../components/AddFavorite";
import DeleteFavorite from "../../components/DeleteFavorite";
import background, { gradient } from "../../components/background"


const AllPlants = (props) => {
  const [plants, setPlants] = useState([])
  const [plantsBackUp, setPlantsBackUp] = useState([])
  const [filterTypeOptions, setfilterTypeOptions] = useState([])
  const [filterLifeOptions, setfilterLifeOptions] = useState([])
  const [filterLightOptions, setfilterLightOptions] = useState([])
  const [userFavorites, setUserFavorites] = useState([])
  const [docsLast, setDocsLast] = useState(0)
  const { userId } = props

  const plantCollection = collection(db, "testPlants")
  const userFavoritesCollection = collection(db, "worms", userId, "favorites")
  const q = query(plantCollection, orderBy("flowerId", "asc"), limit(12));

  async function getFavorites() {
    const data = await getDocs(userFavoritesCollection)
    await setUserFavorites(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  const fetchMore = async () => {
    const q = query(plantCollection, orderBy("flowerId", "asc"), limit(12), startAfter(docsLast));
    const data = await getDocs(q)
    const plantData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    await setPlants((plants) => [...plants, ...plantData])
    await setPlantsBackUp((plants) => [...plants, ...plantData])
    const docsLength = data.docs.length - 1
    const lastPlantId = plantData[docsLength].flowerId
    setDocsLast(lastPlantId)
  }

  useEffect(() => {
    // setPlants(flowers2)
    // setPlantsBackUp(flowers2)
    async function getPlants() {
      const data = await getDocs(q)
      const plantData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      await setPlants(plantData)
      await setPlantsBackUp(plantData)
      const docsLength = data.docs.length - 1
      const lastPlantId = plantData[docsLength].flowerId
      setDocsLast(lastPlantId)
    }
    getPlants()

    getFavorites()
  }, [])

  let userFavorites2 = []
  userFavorites.forEach(plant => userFavorites2.push(plant.plantId))


  const removeFavorite = (thisPlantsId) => {
    let toBeDeletedData = userFavorites.filter(x => (x.plantId === thisPlantsId))
    DeleteFavorite(toBeDeletedData, userId)
    let toBeNewFavorites = userFavorites.filter(x => (x.plantId !== thisPlantsId))
    setUserFavorites(toBeNewFavorites)
  }

  // THIS IS FN FOR SETTING THE TYPE (grass, herb, etc) CONDITION IN FILTER
  function checkedBoxType(event) {
    if (!document.getElementById(event).checked) {
      let tempFilterOption = filterTypeOptions.filter((option) => option !== event)
      setfilterTypeOptions(tempFilterOption)
    }
    else {
      let tempFilteredOption = filterTypeOptions
      tempFilteredOption.push(event)
      setfilterTypeOptions(tempFilteredOption)
    }
  }

  // THIS IS FN FOR SETTING THE LIFE TYPE (annual, biannual, ) IN FILTER
  function checkedBoxLife(event) {
    if (!document.getElementById(event).checked) {
      let tempFilterLifeOption = filterLifeOptions.filter((option) => option !== event)
      setfilterLifeOptions(tempFilterLifeOption)
      console.log("filterLifeOptions", filterLifeOptions)
    }
    else {
      let tempFilteredLifeOption = filterLifeOptions
      tempFilteredLifeOption.push(event)
      setfilterLifeOptions(tempFilteredLifeOption)
      console.log("filterLifeOptions", filterLifeOptions)
    }
  }

  // THIS IS FN FOR SETTING THE LIGHT CONDITION (fullsun, shade) IN FILTER
  function checkedBoxLight(event) {
    if (!document.getElementById(event).checked) {
      let tempFilterLightOption = filterLightOptions.filter((option) => option !== event)
      setfilterLightOptions(tempFilterLightOption)
      console.log("filterLightOptions", filterLightOptions)
    }
    else {
      let tempFilterLightOption = filterLightOptions
      tempFilterLightOption.push(event)
      setfilterLightOptions(tempFilterLightOption)
      // console.log(filterLightOptions)
    }
  }

  function reset() {
    console.log('clicked');
    for (let i = 0; i < filterLifeOptions.length; i++) {
      document.getElementById(filterLifeOptions[i]).checked = false;
    }
    for (let i = 0; i < filterLightOptions.length; i++) {
      document.getElementById(filterLightOptions[i]).checked = false;
    }
    for (let i = 0; i < filterTypeOptions.length; i++) {
      document.getElementById(filterTypeOptions[i]).checked = false;
    }
    setfilterLightOptions([])
    setfilterLifeOptions([])
    setfilterTypeOptions([])
  }

  async function onSubmit(evt) {
    if ((filterTypeOptions.length === 0) && (filterLifeOptions.length === 0) && (filterLightOptions.length === 0)) {
      setPlants(plantsBackUp)
    }
    else
      if ((filterTypeOptions.length > 0) && (filterLifeOptions.length === 0) && (filterLightOptions.length === 0)) {
        let newPlants = plantsBackUp.filter((plant) => filterTypeOptions.includes(plant.type))
        setPlants(newPlants)
      }
      else if ((filterTypeOptions.length === 0) && (filterLifeOptions.length > 0) && (filterLightOptions.length === 0)) {
        let newPlants = plantsBackUp.filter((plant) => filterLifeOptions.includes(plant.life))
        setPlants(newPlants)
      }
      else if ((filterTypeOptions.length === 0) && (filterLifeOptions.length === 0) && (filterLightOptions.length > 0)) {
        let newPlants = plantsBackUp.filter((plant) => filterLightOptions.includes(plant.transplantTo))
        setPlants(newPlants)
      }
      else if ((filterTypeOptions.length === 0) && (filterLifeOptions.length > 0) && (filterLightOptions.length > 0)) {
        let newPlants = plantsBackUp.filter((plant) => (filterLifeOptions.includes(plant.life) && filterLightOptions.includes(plant.transplantTo)))
        setPlants(newPlants)
      }
      else if ((filterTypeOptions.length > 0) && (filterLifeOptions.length > 0) && (filterLightOptions.length === 0)) {
        let newPlants = plantsBackUp.filter((plant) => (filterTypeOptions.includes(plant.type) && filterLifeOptions.includes(plant.life)))
        console.log("new plants", newPlants)
        setPlants(newPlants)
      }
      else if ((filterTypeOptions.length > 0) && (filterLifeOptions.length === 0) && (filterLightOptions.length > 0)) {
        let newPlants = plantsBackUp.filter((plant) => filterTypeOptions.includes(plant.type) && filterLightOptions.includes(plant.transplantTo))
        setPlants(newPlants)
      }
      else {
        let newPlants = plantsBackUp.filter((plant) => filterTypeOptions.includes(plant.type) && filterLifeOptions.includes(plant.life) && filterLightOptions.includes(plant.transplantTo))
        setPlants(newPlants)
      }
  }

  function show(className) {
    const editInputArea = document.querySelectorAll(`.${className}`)
    const currentEditInputArea1 = editInputArea[0]
    const currentEditInputArea2 = editInputArea[1]
    const currentEditInputArea3 = editInputArea[2]
    const currentEditInputArea4 = editInputArea[3]
    currentEditInputArea1.classList.toggle("show")
    currentEditInputArea2.classList.toggle("show")
    currentEditInputArea3.classList.toggle("show")
    currentEditInputArea4.classList.toggle("show")
  }
 

  const plantTypes = ["grain", "grass", "herb", "house", "orn", "shrub", "tree", "vege", "vine"]
  const plantLife = ["a", "b", "p", "other"]
  const transplantTo = ["fsun", "psun", "psha", "fsha"]

  return (
    <div className="overallBackground" style={{ backgroundImage: background.sunny }}>

    <div className="page-container">
    <div className="all-plants-container">
      <div className="filterArea">
        <i className="fa fa-filter" aria-hidden="true" onClick={(evt) => show("hide")}></i>
        <div className="filteringCon">
          <div className="hide">

            <div className="filtering filterPlantType">
              <h4 className="filteringTitle" >Plant Type</h4>
              <div className="filterColumn ">
                <span className="filterType">

                  {plantTypes.map((type) => <Checkbox type={type} handleChange={checkedBoxType} />)}
                </span>
              </div>
            </div>

          </div>
          <div className="hide">

            <div className="filtering filterPlantLife">
              <h4 className="filteringTitle" >Plant Life</h4>
              <div className="filterColumn ">
                <span className="filterLife">
                  {plantLife.map((life) => <Checkbox type={life} handleChange={checkedBoxLife} />)}
                </span>
              </div>
            </div>
          </div>

          <div className="hide">

            <div className="filtering filterPlantLight">
              <h4 className="filteringTitle">Transplant To</h4>
              <div className="filterColumn ">
                <span className="filterLight">

                  {transplantTo.map((light) => <Checkbox type={light} handleChange={checkedBoxLight} />)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="hide">

          <button className="all-plants-button" onClick={(evt) => { onSubmit(evt) }}>submit</button>
          <button className="all-plants-button" onClick={(evt) => { reset(evt) }}>clear</button>
        </div>



      </div>



      <div className="allPlantsArea">
        {(plants) ? (plants.map((plant) => {

          return (<div className="singlePlant" key={plant.id}>
            <div className="singlePlant-title-container">
            <div>
              {userFavorites2.includes(plant.id) ? 
                      (<div onClick={()=>{removeFavorite(plant.id);}}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={()=>{
                        AddFavorite(plant.id, userId)
                        getFavorites()
                      }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
            </div>
            <div className="singlePlantName"><h3>{plant.name}</h3></div>
            </div>

            <div>
              <Link to={`/allplants/${plant.id}`}>
                <img src={plant.img} className="allPlantsImg" />
              </Link>
            </div>

            <div>Type: {plant.type}</div>
            <div className="singlePlantlife">Life: {(plant.life === 'a') ? ("annual") : 
              ((plant.life === 'p') ? ('perennial') :
                ((plant.life === 'b' ? ("biannual") : ("other"))))}</div>
            <div className="singlePlantTransportTo">Light: {(plant.transplantTo === 'psha') ? ("partial shade") : 
                  ((plant.transplantTo === 'fsha') ? ("full shade") : 
                      ((plant.transplantTo === 'fsun') ? ("full sun") : ("partial sun")))}</div>


          </div>)

        })) : (<div>Sorry, no plant data available</div>)}
      </div>
      <div className="loadMoreButtonDiv"><button onClick={()=>{fetchMore()}}>Load More Plants</button></div>
    </div>
    </div>
    </div>
  )
}



    //     {(plants
    //       ? (plants.map((plant) => {
    //         (
    //           <div className="singlePlant" key={plant.id}>
    //             <div className="singlePlantName">Species: {plant.name}</div>
    //             <div className="singlePlantlife">Life: {plant.life}</div>
    //             <div className="singlePlantTransportTo">Light: {plant.transplantTo}</div>
    //             <Link to={`/development/${plant.id}`}>
    //               <img src={plant.img} className="allPlantsImg" />
    //             </Link>
                // <div>{userFavorites2.includes(plant.id) ? 
                //       (<div onClick={()=>{removeFavorite(plant.id);}}><i className="fa fa-heart" aria-hidden="true"></i></div>
                //       ) : (<div onClick={()=>{
                //         AddFavorite(plant.id, userId)
                //         getFavorites()
                //         }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                //       )}
                // </div>
    //             <div>{plant.type}</div>
    //           </div>
    //         )}) : (<div>"No plants to display"</div>) }
    //       }))}
    //   </div>
    // </div>)

// }

export default AllPlants
