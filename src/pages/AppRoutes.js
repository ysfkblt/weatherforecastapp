import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import { auth } from "../database/firebase-config";
import Journal from "./Journal";
import AllPlantsView from "./allPlants/AllPlantsView";
import SinglePlantView from "./SinglePlantView";
import Auth from "../components/Auth";
import User from "./User";
import Favorites from "./Favorites";
import GardenPlotViz from "./GardenPlotViz";

const AppRoutes = () => {
  const [user, setUser] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <>
      <Routes>
        {user ? (
          <>
            <Route
              path="/allplants"
              element={<AllPlantsView userId={user.uid} />}
            />
            <Route
              path="/allplants/:plantId"
              element={<SinglePlantView userId={user.uid} />}
            />
            <Route path="/" element={<App userId={user.uid} user={user} />} />
            <Route path="/journal" element={<Journal userId={user.uid} />} />
            <Route
              path="/favorites"
              element={<Favorites userId={user.uid} />}
            />
            <Route path="/user" element={<User user={user} />} />

            <Route path="/garden" element={<GardenPlotViz />} />
          </>
        ) : (
          <>
            <Route path="/" element={<App />} />
            <Route path="/allplants" element={<AllPlantsView />} />
            <Route path="/allplants/:plantId" element={<SinglePlantView />} />
            <Route path="/signUp" element={<Auth />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default AppRoutes;
