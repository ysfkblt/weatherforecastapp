import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../database/firebase-config"
import { Link } from "react-router-dom";
import Checkbox from "./checkboxes"


const AllPlants = () => {
  const [plants, setPlants] = useState([])
  const [filterOptions, setFilterOptions] = useState([])
  const plantCollection = collection(db, "plants")

  useEffect(() => {
    async function getPlants() {
      const data = await getDocs(plantCollection)
      await setPlants(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    getPlants()
  }, [])

  function checkedBox(event){
    // if(event.checked===false){event.checked=true} else {event.checked=false}
    // console.log(event.checked)
    if(!document.getElementById(event).checked){
      // console.log(event)
      // let tempFilteredOption = filterOptions
      // tempFilteredOption.push(event)
      // setFilterOptions(tempFilteredOption)
         let tempFilterOption =  filterOptions.filter((option) => option !== event)
      setFilterOptions(tempFilterOption) 
      console.log(filterOptions)
    }
    else { 
      let tempFilteredOption = filterOptions
      tempFilteredOption.push(event)
      setFilterOptions(tempFilteredOption)
      console.log(filterOptions)

      // let tempFilterOption =  filterOptions.filter((option) => option !== event)
      // setFilterOptions(tempFilterOption) 
    }
  }

  async function resetPlants(){
    const data = await getDocs(plantCollection)
    await setPlants(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  async function onSubmit(evt){
    if (filterOptions.length === 0) {
      resetPlants()
    }
    else {
      //  const data = await getDocs(plantCollection)
      // await setPlants(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      await resetPlants()
      console.log(plants)
      let newPlants = plants.filter((plant) => filterOptions.includes(plant.type))
      setPlants(newPlants)
      console.log(newPlants)
    }
  }

  const plantTypes=["grain", "grass", "herb", "house", "orn", "shrb", "shrub", "tree", "vege", "vine"]

  return (
  <>
    <div className="filterArea"> 
     <div><h4>Filter:</h4></div>
     <div>
      <div><h4>Plant Type</h4></div>
      {plantTypes.map((type)=><Checkbox type={type} handleChange={checkedBox} />)

      }
      {/* <div><input type="checkbox" onChange={(event)=>checkedBox(event.target.value)} value="grain" id="grain"/>Grain</div>
      <div><input type="checkbox" onChange={(event)=>checkedBox(event.target.value)} value="herb" id="herb" />Herb</div>
      <div><input type="checkbox" onChange={(event)=>checkedBox(event.target.value)} value="grass" id="grass"/>Grass</div>
      <div><input type="checkbox" onChange={(event)=>checkedBox(event.target.value)} value="tree" id="tree" />Tree</div>
      <div><input type="checkbox" onChange={(event)=>checkedBox(event.target.value)} value="house" id="house" />House</div>
      <div><input type="checkbox" onChange={(event)=>checkedBox(event.target.value)} value="ornamental" id="ornamental" />Ornamental</div>
      <div><input type="checkbox" onChange={(event)=>checkedBox(event.target.value)} value="shrub" id="shrub" />Shrub</div>
      <div><input type="checkbox" onChange={(event)=>checkedBox(event.target.value)} value="vegetable" id="vegetable" />Vegetable</div>
      <div><input type="checkbox" onChange={(event)=>checkedBox(event.target.value)} value="vine" id="vine" />Vine</div> */}
     </div>
     <button onClick={(evt)=>{onSubmit(evt)}}>submit</button>
     <button>clear</button>
    </div>

    <div className="allPlantsArea">
      {plants
        ? plants.map((plant) => {
            return (
              <div className="singlePlant" key={plant.id}>
                <div className="singlePlantName">{plant.name}</div>
               
                {plant.type === "grain" ? (
                  <>
                   <Link to={`/development/${plant.id}`}> <img
                      src="https://www.world-grain.com/ext/resources/2022/09/21/Wheat_photo-cred-Adobe-stock_E-2.jpg?t=1663769040&width=1080"
                      className="allPlantsImg"
                    /></Link>
                    <div>"Grain"</div>
                  </>
                ) : plant.type === "grass" ? (
                  <>
                    <Link to={`/development/${plant.id}`}><img
                      src="https://www.highcountrygardens.com/media/catalog/product/c/o/cortaderia_selloana_pumila_2.jpg?quality=80&bg-color=255,255,255&fit=bounds&height=&width="
                      className="allPlantsImg"
                    /></Link>
                    <div>"Grass"</div>
                  </>
                ) : plant.type === "herb" ? (
                  <>
                  <Link to={`/development/${plant.id}`}> <img
                      src="https://www.farmersalmanac.com/wp-content/uploads/2020/11/basil-plant-garden-as_245197176.jpeg"
                      className="allPlantsImg"
                    /></Link>
                    <div>"Herb"</div>
                  </>
                ) : plant.type === "house" ? (
                  <>
                  <Link to={`/development/${plant.id}`}> <img
                      src="http://cdn.shopify.com/s/files/1/2528/3612/products/Philodendron_Monstera_black_round_1800x.jpg?v=1627692378"
                      className="allPlantsImg"
                    /></Link>
                    <div>"House"</div>
                  </>
                ) : plant.type === "orn" ? (
                  <>
                  <Link to={`/development/${plant.id}`}> <img
                      src="https://bloomsz.com/wp-content/uploads/2018/08/09477_Bleeding-Hearts.jpg"
                      className="allPlantsImg"
                    /></Link>
                    <div>"Ornamental"</div>
                  </>
                ) : plant.type === "shrb" ? (
                  <>
                  <Link to={`/development/${plant.id}`}> <img
                      src="https://i.pinimg.com/736x/a4/fa/d6/a4fad6f233cf74495f72f6ccc126f643.jpg"
                      className="allPlantsImg"
                    /></Link>
                    <div>"Shrub"</div>
                  </>
                ) : plant.type === "shrub" ? (
                  <>
                  <Link to={`/development/${plant.id}`}> <img
                      src="https://i.pinimg.com/736x/a4/fa/d6/a4fad6f233cf74495f72f6ccc126f643.jpg"
                      className="allPlantsImg"
                    /></Link>
                    <div>"Shrub"</div>
                  </>
                ) : plant.type === "tree" ? (
                  <>
                  <Link to={`/development/${plant.id}`}>  <img
                      src="https://images.saymedia-content.com/.image/t_share/MTc0MzU0MTAwNDc2MzIzMTc2/smalltreesforasmallyardorgardentreesunderthirtyfeettall.jpg"
                      className="allPlantsImg"
                    /></Link>
                    <div>"Tree"</div>
                  </>
                ) : plant.type === "vege" ? (
                  <>
                  <Link to={`/development/${plant.id}`}> <img
                      src="https://images.ctfassets.net/3s5io6mnxfqz/2BvZI3f3027FiiZ256sEOZ/b88803248178aa2d7c3d4901eac7992d/AdobeStock_291017406.jpeg"
                      className="allPlantsImg"
                    /></Link>
                    <div>"Vegetable"</div>
                  </>
                ) : plant.type === "vine" ? (
                  <>
                  <Link to={`/development/${plant.id}`}> <img
                      src="https://www.bhg.com/thmb/EUBuVlZmTyIB2HihqbdqzhX55e8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/clematis-climbing-trellis-8c6f8c88-150967778d104724a5324ad08269c637.jpg"
                      className="allPlantsImg"
                    /></Link>
                    <div>"Vine"</div>
                  </>
                ) : null}
              </div>
            )
            {plant.life === "a" ? (
                <div>"Annual"</div>
              ) : plant.life === "b" ? (
                <div>Biennials</div>
              ) : plant.life === "p" ? (
                <div>Perennials</div>
              ) : (
                <div>Other</div>
              )}
          })
        : null}
    </div>
    </>)
}

export default AllPlants
