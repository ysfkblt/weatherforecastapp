import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { collection, getDocs } from "firebase/firestore"
import { auth, db } from "./firebase-config"

const AllPlants = () => {
  const [plants, setPlants] = useState([])
  const plantCollection = collection(db, "plants")

  useEffect(() => {
    async function getPlants() {
      const data = await getDocs(plantCollection)
      await setPlants(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    getPlants()
  }, [])
  console.log(plants)
  return (
    <div>
      {plants
        ? plants.map((plant) => {
            return (
              <div>
                <h3>{plant.name}</h3>
                {plant.life === "a" ? (
                  <div>"Annual"</div>
                ) : plant.life === "b" ? (
                  <div>Biennials</div>
                ) : plant.life === "p" ? (
                  <div>Perennials</div>
                ) : (
                  <div>Other</div>
                )}
                {plant.type === "grain" ? (
                  <>
                    <img
                      src="https://www.world-grain.com/ext/resources/2022/09/21/Wheat_photo-cred-Adobe-stock_E-2.jpg?t=1663769040&width=1080"
                      className="allPlantsImg"
                    />
                    <div>"Grain"</div>
                  </>
                ) : plant.type === "grass" ? (
                  <>
                    <img
                      src="https://www.highcountrygardens.com/media/catalog/product/c/o/cortaderia_selloana_pumila_2.jpg?quality=80&bg-color=255,255,255&fit=bounds&height=&width="
                      className="allPlantsImg"
                    />
                    <div>"Grass"</div>
                  </>
                ) : plant.type === "herb" ? (
                  <>
                    <img
                      src="https://www.farmersalmanac.com/wp-content/uploads/2020/11/basil-plant-garden-as_245197176.jpeg"
                      className="allPlantsImg"
                    />
                    <div>"Herb"</div>
                  </>
                ) : plant.type === "house" ? (
                  <>
                    <img
                      src="http://cdn.shopify.com/s/files/1/2528/3612/products/Philodendron_Monstera_black_round_1800x.jpg?v=1627692378"
                      className="allPlantsImg"
                    />
                    <div>"House"</div>
                  </>
                ) : plant.type === "orn" ? (
                  <>
                    <img
                      src="https://bloomsz.com/wp-content/uploads/2018/08/09477_Bleeding-Hearts.jpg"
                      className="allPlantsImg"
                    />
                    <div>"Ornamental"</div>
                  </>
                ) : plant.type === "shrb" ? (
                  <>
                    <img
                      src="https://i.pinimg.com/736x/a4/fa/d6/a4fad6f233cf74495f72f6ccc126f643.jpg"
                      className="allPlantsImg"
                    />
                    <div>"Shrub"</div>
                  </>
                ) : plant.type === "shrub" ? (
                  <>
                    <img
                      src="https://i.pinimg.com/736x/a4/fa/d6/a4fad6f233cf74495f72f6ccc126f643.jpg"
                      className="allPlantsImg"
                    />
                    <div>"Shrub"</div>
                  </>
                ) : plant.type === "tree" ? (
                  <>
                    <img
                      src="https://images.saymedia-content.com/.image/t_share/MTc0MzU0MTAwNDc2MzIzMTc2/smalltreesforasmallyardorgardentreesunderthirtyfeettall.jpg"
                      className="allPlantsImg"
                    />
                    <div>"Tree"</div>
                  </>
                ) : plant.type === "vege" ? (
                  <>
                    <img
                      src="https://images.ctfassets.net/3s5io6mnxfqz/2BvZI3f3027FiiZ256sEOZ/b88803248178aa2d7c3d4901eac7992d/AdobeStock_291017406.jpeg"
                      className="allPlantsImg"
                    />
                    <div>"Vegetable"</div>
                  </>
                ) : plant.type === "vine" ? (
                  <>
                    <img
                      src="https://www.bhg.com/thmb/EUBuVlZmTyIB2HihqbdqzhX55e8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/clematis-climbing-trellis-8c6f8c88-150967778d104724a5324ad08269c637.jpg"
                      className="allPlantsImg"
                    />
                    <div>"Vine"</div>
                  </>
                ) : null}
              </div>
            )
          })
        : null}
    </div>
  )
}

export default AllPlants
