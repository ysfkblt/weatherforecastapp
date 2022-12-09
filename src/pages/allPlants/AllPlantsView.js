import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../database/firebase-config"
import { Link } from "react-router-dom";
import Checkbox from "./checkboxes"
import { flowers2 } from '../../database/plantDatabase'
import Database from "../../database/Database";
import AddFavorite from "../../components/AddFavorite";
import DeleteFavorite from "../../components/DeleteFavorite";


const AllPlants = (props) => {
  const [plants, setPlants] = useState([])
  const [plantsBackUp, setPlantsBackUp] = useState([])
  const [filterTypeOptions, setfilterTypeOptions] = useState([])
  const [filterLifeOptions, setfilterLifeOptions] = useState([])
  const [filterLightOptions, setfilterLightOptions] = useState([])
  const [userFavorites, setUserFavorites] = useState([])
  const plantCollection = collection(db, "testPlants")
  const {userId} = props

  const userFavoritesCollection = collection(db, "worms", userId, "favorites")

  async function getFavorites() {
    const data = await getDocs(userFavoritesCollection)
    await setUserFavorites(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  useEffect(() => {
    // setPlants(flowers2)
    // setPlantsBackUp(flowers2)
    async function getPlants() {
      const data = await getDocs(plantCollection)
      console.log(data.docs)
      await setPlants(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      await setPlantsBackUp(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    getPlants()
  }, [])


  console.log(userFavorites)


  let userFavorites2 = []
  userFavorites.forEach(plant => userFavorites2.push(plant.plantId))
  console.log(userFavorites2)


  const removeFavorite = (thisPlantsId) => {
    let toBeDeletedData = userFavorites.filter(x => (x.plantId === thisPlantsId))
    console.log(userFavorites)
    DeleteFavorite(toBeDeletedData, userId)
    let toBeNewFavorites = userFavorites.filter(x => (x.plantId !== thisPlantsId))
    setUserFavorites(toBeNewFavorites)
}

// THIS IS FN FOR SETTING THE TYPE (grass, herb, etc) CONDITION IN FILTER
  function checkedBoxType(event){
    if(!document.getElementById(event).checked){
      let tempFilterOption =  filterTypeOptions.filter((option) => option !== event)
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
    for (let i=0; i<filterLifeOptions.length;i++){
      document.getElementById(filterLifeOptions[i]).checked=false;
    }
    for (let i=0; i<filterLightOptions.length;i++){
      document.getElementById(filterLightOptions[i]).checked=false;
    }
    for (let i=0; i<filterTypeOptions.length;i++){
      document.getElementById(filterTypeOptions[i]).checked=false;
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
    <>
      <div className="filterArea">
        <div><h4>Filter:</h4></div>
        <div className="filteringCon">

          <div>
            <h4>Plant Type</h4>
            {plantTypes.map((type) => <Checkbox type={type} handleChange={checkedBoxType} />)}
          </div>

          <div>
            <h4>Plant Life</h4>
            {plantLife.map((life) => <Checkbox type={life} handleChange={checkedBoxLife} />)}
          </div>

          <div>
            <h4>Light Conditions</h4>
            {transplantTo.map((light) => <Checkbox type={light} handleChange={checkedBoxLight} />)}
          </div>
     </div>
     <button onClick={(evt)=>{onSubmit(evt)}}>submit</button>
     <button onClick={(evt)=>{reset(evt)}}>clear</button>
    </div>

    

    <div className="allPlantsArea">
      {plants
        ? plants.map((plant) => {
            return (
              <div className="singlePlant" key={plant.id}>
                <div className="singlePlantName">{plant.name} {plant.id}</div>
                <div className="singlePlantName">{plant.life} </div>
                <div className="singlePlantName">{plant.transplantTo} </div>
                {/* <img src={plant.img} /> */}
                {plant.type === "grain" ? (
                  <>
                    <Link to={`/development/${plant.id}`}> <img
                      src={plant.img} className="allPlantsImg"
                    /></Link>
                    <div>{userFavorites2.includes(plant.id) ? 
                      (<div onClick={()=>{removeFavorite(plant.id);}}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={()=>{
                        AddFavorite(plant.id, userId)
                        getFavorites()
                        }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
                    </div>
                    <div>"Grain"</div>
                  </>
                ) : plant.type === "grass" ? (
                  <>
                    <Link to={`/development/${plant.id}`}><img
                      src={plant.img}
                      className="allPlantsImg"
                    /></Link>
                    <div>{userFavorites2.includes(plant.id) ? 
                      (<div onClick={()=>{removeFavorite(plant.id);}}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={()=>{
                        AddFavorite(plant.id, userId)
                        getFavorites()
                        }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
                    </div>
                    <div>"Grass"</div>
                  </>
                ) : plant.type === "herb" ? (
                  <>
                    <Link to={`/development/${plant.id}`}> <img
                      src={plant.img}
                      className="allPlantsImg"
                    /></Link>
                    <div>{userFavorites2.includes(plant.id) ? 
                      (<div onClick={()=>{removeFavorite(plant.id);}}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={()=>{
                        AddFavorite(plant.id, userId)
                        getFavorites()
                        }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
                    </div>
                    <div>"Herb"</div>
                  </>
                ) : plant.type === "house" ? (
                  <>
                    <Link to={`/development/${plant.id}`}> <img
                      src={plant.img}
                      className="allPlantsImg"
                    /></Link>
                    <div>{userFavorites2.includes(plant.id) ? 
                      (<div onClick={()=>{removeFavorite(plant.id);}}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={()=>{
                        AddFavorite(plant.id, userId)
                        getFavorites()
                        }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
                    </div>
                    <div>"House"</div>
                  </>
                ) : plant.type === "orn" ? (
                  <>
                    <Link to={`/development/${plant.id}`}> <img
                      src={plant.img}
                      className="allPlantsImg"
                    /></Link>
                    <div>{userFavorites2.includes(plant.id) ? 
                      (<div onClick={()=>{removeFavorite(plant.id);}}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={()=>{
                        AddFavorite(plant.id, userId)
                        getFavorites()
                        }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
                    </div>
                    <div>"Ornamental"</div>
                  </>
                ) : plant.type === "shrub" ? (
                  <>
                    <Link to={`/development/${plant.id}`}> <img
                      src={plant.img}
                      className="allPlantsImg"
                    /></Link>
                    <div>{userFavorites2.includes(plant.id) ? 
                      (<div onClick={()=>{removeFavorite(plant.id);}}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={()=>{
                        AddFavorite(plant.id, userId)
                        getFavorites()
                        }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
                    </div>
                    <div>"Shrub"</div>
                  </>
                ) : plant.type === "tree" ? (
                  <>
                    <Link to={`/development/${plant.id}`}>  <img
                      src={plant.img}
                      className="allPlantsImg"
                    /></Link>
                    <div>{userFavorites2.includes(plant.id) ? 
                      (<div onClick={()=>{removeFavorite(plant.id);}}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={()=>{
                        AddFavorite(plant.id, userId)
                        getFavorites()
                        }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
                    </div>
                    <div>"Tree"</div>
                  </>
                ) : plant.type === "vege" ? (
                  <>
                    <Link to={`/development/${plant.id}`}> <img
                      src={plant.img}
                      className="allPlantsImg"
                    /></Link>
                    <div>{userFavorites2.includes(plant.id) ? 
                      (<div onClick={()=>{removeFavorite(plant.id);}}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={()=>{
                        AddFavorite(plant.id, userId)
                        getFavorites()
                        }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
                    </div>
                    <div>"Vegetable"</div>
                  </>
                ) : plant.type === "vine" ? (
                  <>
                    <Link to={`/development/${plant.id}`}> <img
                      src={plant.img}
                      className="allPlantsImg"
                    /></Link>
                    <div>{userFavorites2.includes(plant.id) ? 
                      (<div onClick={()=>{removeFavorite(plant.id);}}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={()=>{
                        AddFavorite(plant.id, userId)
                        getFavorites()
                        }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
                    </div>
                    <div>"Vine"</div>
                  </>
                ) : null}
              </div>
            )
            {
              plant.life === "a" ? (
                <div>"Annual"</div>
              ) : plant.life === "b" ? (
                <div>Biennials</div>
              ) : plant.life === "p" ? (
                <div>Perennials</div>
              ) : (
              <div>Other</div>
            )
            }
          })
          : null}
      </div>
    </>)
}

export default AllPlants
