import { useState, useEffect } from "react"
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore"
import { db } from "../../database/firebase-config"
import { Link } from "react-router-dom";
import Checkbox from "./checkboxes"
import flowers2 from '../../database/plantDatabase'
import AddFavorite from "../../components/AddFavorite";
import DeleteFavorite from "../../components/DeleteFavorite";


const AllPlants = (props) => {
  const [plants, setPlants] = useState([])
  const [plantsBackUp, setPlantsBackUp] = useState([])
  const [filterTypeOptions, setfilterTypeOptions] = useState([])
  const [filterLifeOptions, setfilterLifeOptions] = useState([])
  const [filterLightOptions, setfilterLightOptions] = useState([])
  const [userFavorites, setUserFavorites] = useState([])
  const [docsLast, setDocsLast] = useState(0)
  const { userId } = props

  // let filterIdNum = 12 + docsLast;

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
    // console.log('clicked')
    // console.log(lastPlantId)
  }

  useEffect(() => {
    // setPlants(flowers2)
    // setPlantsBackUp(flowers2)
    async function getPlants() {
      // 
      // where("flowerId", "<=", `${rows}`),
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

  console.log(plants)
  console.log(docsLast)
  let userFavorites2 = []
  userFavorites.forEach(plant => userFavorites2.push(plant.plantId))


  const removeFavorite = (thisPlantsId) => {
    let toBeDeletedData = userFavorites.filter(x => (x.plantId === thisPlantsId))
    console.log(userFavorites)
    DeleteFavorite(toBeDeletedData, userId)
    let toBeNewFavorites = userFavorites.filter(x => (x.plantId !== thisPlantsId))
    setUserFavorites(toBeNewFavorites)
  }

  // THIS IS FN FOR SETTING THE TYPE (grass, herb, etc) CONDITION IN FILTER
  function checkedBoxType(event) {
    if (!document.getElementById(event).checked) {
      let tempFilterOption = filterTypeOptions.filter((option) => option !== event)
      setfilterTypeOptions(tempFilterOption)
      console.log("filterTypeOptions", filterTypeOptions)
    }
    else {
      let tempFilteredOption = filterTypeOptions
      tempFilteredOption.push(event)
      setfilterTypeOptions(tempFilteredOption)
      console.log("filterTypeOptions", filterTypeOptions)
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
    // console.log("light", filterLightOptions.length)
    // console.log("life", filterLifeOptions.length)
    // console.log("type", filterTypeOptions.length)
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


  const plantTypes = ["grain", "grass", "herb", "house", "orn", "shrub", "tree", "vege", "vine"]
  const plantLife = ["a", "b", "p", "other"]
  const transplantTo = ["fsun", "psun", "psha", "fsha"]

  return (
    <div className="all-plants-container">
      <div className="filterArea">
        <h4 className="filterTitle">Filter</h4>
        <div className="filteringCon">

          <div className="filtering">
            <h4 className="filteringTitle">Plant Type</h4>
            <div className="filterColumn">
              {plantTypes.map((type) => <Checkbox type={type} handleChange={checkedBoxType} />)}
            </div>
          </div>

          <div className="filtering">
            <h4 className="filteringTitle">Plant Life</h4>
            <div className="filterColumn">
              {plantLife.map((life) => <Checkbox type={life} handleChange={checkedBoxLife} />)}
            </div>
          </div>

          <div className="filtering">
            <h4 className="filteringTitle">Transplant To</h4>
            <div className="filterColumn">
              {transplantTo.map((light) => <Checkbox type={light} handleChange={checkedBoxLight} />)}
            </div>
          </div>

        </div>
        <button className="all-plants-button" onClick={(evt) => { onSubmit(evt) }}>submit</button>
        <button className="all-plants-button" onClick={(evt) => { reset(evt) }}>clear</button>
      </div>

      <div className="allPlantsArea">
        {(plants) ? (plants.map((plant) => {

          return (<div className="singlePlant" key={plant.id}>
            <div className="singlePlantName">Species: {plant.name}</div>
            <div>{plant.type}</div>
            <div className="singlePlantlife">Life: {plant.life}</div>
            <div className="singlePlantTransportTo">Light: {plant.transplantTo}</div>
            <Link to={`/allplants/${plant.id}`}>
              <img src={plant.img} className="allPlantsImg" />
            </Link>
            {/* <div><i className="fa fa-heart" aria-hidden="true"></i></div> */}
            <div>{userFavorites2.includes(plant.id) ? 
                      (<div onClick={()=>{removeFavorite(plant.id);}}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={()=>{
                        AddFavorite(plant.id, userId)
                        getFavorites()
                        }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
            </div>

          </div>)

        })) : (<div>Sorry, no plant data available</div>)}
      </div>
      <div className="loadMoreButtonDiv"><button onClick={()=>{fetchMore()}}>Load More Plants</button></div>
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
