import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
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
  const plantCollection = collection(db, "plants")
  const { userId } = props


  console.log(plants)

  const userFavoritesCollection = collection(db, "worms", userId, "favorites")

  async function getFavorites() {
    const data = await getDocs(userFavoritesCollection)
    await setUserFavorites(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  useEffect(() => {
    setPlants(flowers2)
    setPlantsBackUp(flowers2)
    // async function getPlants() {
    //   const data = await getDocs(plantCollection)
    //   await setPlants(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    //   await setPlantsBackUp(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    // }
    // getPlants()

    getFavorites()
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
  function showFilter(className) {
    console.log("WORKING")
    const editInputArea = document.querySelectorAll(`.${className}`)
    const currentEditInputArea1 = editInputArea[0]
    currentEditInputArea1.classList.toggle("show")
  }

  const plantTypes = ["grain", "grass", "herb", "house", "orn", "shrub", "tree", "vege", "vine"]
  const plantLife = ["a", "b", "p", "other"]
  const transplantTo = ["fsun", "psun", "psha", "fsha"]

  return (
    <div className="all-plants-container">
      <div className="filterArea">
        <i className="fa fa-filter" aria-hidden="true" onClick={(evt) => show("hide")}></i>
        <div className="filteringCon">
          <div className="hide">

            <div className="filtering filterPlantType">
              <h4 className="filteringTitle" onClick={(evt) => showFilter("filterType")}>Plant Type</h4>
              <div className="filterColumn ">
                <span className="filterType">

                  {plantTypes.map((type) => <Checkbox type={type} handleChange={checkedBoxType} />)}
                </span>
              </div>
            </div>

          </div>
          <div className="hide">

            <div className="filtering filterPlantLife">
              <h4 className="filteringTitle" onClick={(evt) => showFilter("filterLife")}>Plant Life</h4>
              <div className="filterColumn ">
                <span className="filterLife">
                  {plantLife.map((life) => <Checkbox type={life} handleChange={checkedBoxLife} />)}
                </span>
              </div>
            </div>
          </div>

          <div className="hide">

            <div className="filtering filterPlantLight">
              <h4 className="filteringTitle" onClick={(evt) => showFilter("filterLight")}>Transplant To</h4>
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
        {plants
          ? plants.map((plant) => {
            return (
              <div className="singlePlant" key={plant.id}>

                <div className="singlePlantName">Species: {plant.name} </div>
                <div className="singlePlantlife">Life: {plant.life} </div>
                <div className="singlePlantTransportTo">Transplant to: {plant.transplantTo} </div>


                {plant.type === "grain" ? (
                  <div className="single-plant-container">
                    <Link to={`/development/${plant.id}`}> <img
                      src="https://www.world-grain.com/ext/resources/2022/09/21/Wheat_photo-cred-Adobe-stock_E-2.jpg?t=1663769040&width=1080"
                      className="allPlantsImg"
                    /></Link>

                    <div>{userFavorites2.includes(plant.id) ?
                      (<div onClick={() => { removeFavorite(plant.id); }}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={() => {
                        AddFavorite(plant.id, userId)
                        getFavorites()
                      }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
                    </div>

                    <div>"Grain"</div>
                  </div>
                ) : plant.type === "grass" ? (
                  <div className="single-plant-container">
                    <Link to={`/development/${plant.id}`}><img
                      src="https://www.highcountrygardens.com/media/catalog/product/c/o/cortaderia_selloana_pumila_2.jpg?quality=80&bg-color=255,255,255&fit=bounds&height=&width="
                      className="allPlantsImg"
                    /></Link>

                    <div>{userFavorites2.includes(plant.id) ?
                      (<div onClick={() => { removeFavorite(plant.id); }}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={() => {
                        AddFavorite(plant.id, userId)
                        getFavorites()
                      }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
                    </div>

                    <div>"Grass"</div>
                  </div>
                ) : plant.type === "herb" ? (
                  <div className="single-plant-container">
                    <Link to={`/development/${plant.id}`}> <img
                      src="https://www.farmersalmanac.com/wp-content/uploads/2020/11/basil-plant-garden-as_245197176.jpeg"
                      className="allPlantsImg"
                    /></Link>

                    <div>{userFavorites2.includes(plant.id) ?
                      (<div onClick={() => { removeFavorite(plant.id); }}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={() => {
                        AddFavorite(plant.id, userId)
                        getFavorites()
                      }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
                    </div>

                    <div>"Herb"</div>
                  </div>
                ) : plant.type === "house" ? (
                  <div className="single-plant-container">
                    <Link to={`/development/${plant.id}`}> <img
                      src="http://cdn.shopify.com/s/files/1/2528/3612/products/Philodendron_Monstera_black_round_1800x.jpg?v=1627692378"
                      className="allPlantsImg"
                    /></Link>

                    <div>{userFavorites2.includes(plant.id) ?
                      (<div onClick={() => { removeFavorite(plant.id); }}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={() => {
                        AddFavorite(plant.id, userId)
                        getFavorites()
                      }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
                    </div>

                    <div>"House"</div>
                  </div>
                ) : plant.type === "orn" ? (
                  <div className="single-plant-container">
                    <Link to={`/development/${plant.id}`}> <img
                      src="https://bloomsz.com/wp-content/uploads/2018/08/09477_Bleeding-Hearts.jpg"
                      className="allPlantsImg"
                    /></Link>

                    <div>{userFavorites2.includes(plant.id) ?
                      (<div onClick={() => { removeFavorite(plant.id); }}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={() => {
                        AddFavorite(plant.id, userId)
                        getFavorites()
                      }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
                    </div>

                    <div>"Ornamental"</div>
                  </div>
                ) : plant.type === "shrub" ? (
                  <div className="single-plant-container">
                    <Link to={`/development/${plant.id}`}> <img
                      src="https://i.pinimg.com/736x/a4/fa/d6/a4fad6f233cf74495f72f6ccc126f643.jpg"
                      className="allPlantsImg"
                    /></Link>

                    <div>{userFavorites2.includes(plant.id) ?
                      (<div onClick={() => { removeFavorite(plant.id); }}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={() => {
                        AddFavorite(plant.id, userId)
                        getFavorites()
                      }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
                    </div>

                    <div>"Shrub"</div>
                  </div>
                ) : plant.type === "tree" ? (
                  <div className="single-plant-container">
                    <Link to={`/development/${plant.id}`}>  <img
                      src="https://images.saymedia-content.com/.image/t_share/MTc0MzU0MTAwNDc2MzIzMTc2/smalltreesforasmallyardorgardentreesunderthirtyfeettall.jpg"
                      className="allPlantsImg"
                    /></Link>

                    <div>{userFavorites2.includes(plant.id) ?
                      (<div onClick={() => { removeFavorite(plant.id); }}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={() => {
                        AddFavorite(plant.id, userId)
                        getFavorites()
                      }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
                    </div>

                    <div>"Tree"</div>
                  </div>
                ) : plant.type === "vege" ? (
                  <div className="single-plant-container">
                    <Link to={`/development/${plant.id}`}> <img
                      src="https://images.ctfassets.net/3s5io6mnxfqz/2BvZI3f3027FiiZ256sEOZ/b88803248178aa2d7c3d4901eac7992d/AdobeStock_291017406.jpeg"
                      className="allPlantsImg"
                    /></Link>

                    <div>{userFavorites2.includes(plant.id) ?
                      (<div onClick={() => { removeFavorite(plant.id); }}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={() => {
                        AddFavorite(plant.id, userId)
                        getFavorites()
                      }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}
                    </div>

                    <div>"Vegetable"</div>
                  </div>
                ) : plant.type === "vine" ? (
                  <div className="single-plant-container">
                    <Link to={`/development/${plant.id}`}> <img
                      src="https://www.bhg.com/thmb/EUBuVlZmTyIB2HihqbdqzhX55e8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/clematis-climbing-trellis-8c6f8c88-150967778d104724a5324ad08269c637.jpg"
                      className="allPlantsImg"
                    /></Link>

                    <div>{userFavorites2.includes(plant.id) ?
                      (<div onClick={() => { removeFavorite(plant.id); }}><i className="fa fa-heart" aria-hidden="true"></i></div>
                      ) : (<div onClick={() => {
                        AddFavorite(plant.id, userId)
                        getFavorites()
                      }}><i className="fa fa-heart-o" aria-hidden="true"></i></div>
                      )}

                    </div>
                    <div>"Vine"</div>
                  </div>
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
    </div>)
}

export default AllPlants
