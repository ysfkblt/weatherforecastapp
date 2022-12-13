import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import background from "../components/background";
import { db } from "../database/firebase-config";
import DeleteFavorite from "../components/DeleteFavorite";
import AddFavorite from "../components/AddFavorite";

const Favorites = (props) => {
  const [plants, setPlants] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const plantCollection = collection(db, "testPlants");
  const { userId } = props;
  const userFavoritesCollection = collection(db, "worms", userId, "favorites");
  async function getFavorites() {
    const data = await getDocs(userFavoritesCollection);
    await setUserFavorites(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  }

  useEffect(() => {
    async function getPlants() {
      const data = await getDocs(plantCollection);
      await setPlants(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    getPlants();
    getFavorites();
  }, []);

  let favoritePlantData = [];
  let userFavorites2 = [];
  userFavorites.forEach((plant) => userFavorites2.push(plant.plantId));

  const matchFavorites = () => {
    let userFavorites2 = [];
    userFavorites.forEach((plant) => userFavorites2.push(plant.plantId));
    favoritePlantData = plants.filter((x) => userFavorites2.includes(x.id));
  };
  matchFavorites();

  const removeFavorite = (thisPlantsId) => {
    let toBeDeletedData = userFavorites.filter(
      (x) => x.plantId === thisPlantsId
    );
    DeleteFavorite(toBeDeletedData, userId);
    let toBeNewFavorites = userFavorites.filter(
      (x) => x.plantId !== thisPlantsId
    );
    setUserFavorites(toBeNewFavorites);
  };

  return (
    <div
      className="overallBackground"
      style={{ backgroundImage: background.sunny }}
    >
      <div className="page-container">
        <div className="logo-container-position">
          <div className="logo-container">
            {/* <img src={logo} alt="logo" className="logo" /> */}
          </div>
        </div>
        <div className="favorites-container">
          <h2 className="plant-suggestions-header">FAVORITES</h2>
          {favoritePlantData.length > 0 ? (
            favoritePlantData.map((curPlant) => (
              <div className="plant-list-favorites" key={curPlant.id}>
                <div className="singlePlant-title-container">
                  <div>
                    {userFavorites2.includes(curPlant.id) ? (
                      <div
                        onClick={() => {
                          removeFavorite(curPlant.id);
                        }}
                      >
                        <i className="fa fa-heart" aria-hidden="true"></i>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          AddFavorite(curPlant.id, userId);
                          getFavorites();
                        }}
                      >
                        <i className="fa fa-heart-o" aria-hidden="true"></i>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3>{curPlant.name}</h3>
                  </div>
                </div>
                <div>
                  <img src={curPlant.img} className="favoritePlant" />
                </div>
                <div className="italics">({curPlant.species})</div>
                <div>Type: {curPlant.type}</div>
                <div className="singlePlantlife">
                  Life:{" "}
                  {curPlant.life === "a"
                    ? "annual"
                    : curPlant.life === "p"
                    ? "perennial"
                    : curPlant.life === "b"
                    ? "biannual"
                    : "other"}
                </div>
                <div className="singlePlantTransportTo">
                  Light:{" "}
                  {curPlant.transplantTo === "psha"
                    ? "partial shade"
                    : curPlant.transplantTo === "fsha"
                    ? "full shade"
                    : curPlant.transplantTo === "fsun"
                    ? "full sun"
                    : "partial sun"}
                </div>
              </div>
            ))
          ) : (
            <div>You do have have favorites yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
