import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../database/firebase-config";
import { Link } from "react-router-dom";

const PlantSuggestions = (props) => {
  const [userZoneNumber, setUserZoneNumber] = useState(8);
  const [plantsDbData, setPlantsDbData] = useState([]);
  const [housePlantsDbData, setHousePlantsDbData] = useState([]);

  const { userId, zone } = props;

  let temp_zone = 8;
  if (zone) {
    temp_zone = parseInt(zone);
  }

  const wormCollection = collection(db, "worms", userId, "personal");

  function plantData() {
    getDocs(colRef)
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          setPlantsDbData((prev) => [...prev, doc.data()]);
        });
        return plantsDbData;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function housePlantData() {
    getDocs(colRef2)
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          setHousePlantsDbData((prev) => [...prev, doc.data()]);
        });
        return housePlantsDbData;
      })

      .catch((err) => {
        console.log(err.message);
      });
  }

  useEffect(() => {
    setUserZoneNumber(temp_zone);
    plantData();
    housePlantData();
  }, [temp_zone]);

  // initializezzz
  let firstFrostDate = null;
  let lastFrostDate = null;
  let daysToFirstFrost = null;
  let daysToLastFrost = null;
  let weeksToFirstFrost = null;
  let weeksToLastFrost = null;

  let plantTimingObject = {
    zone: null,
    firstFrost: null,
    lastFrost: null,
    currentDate: null,
    frostSeason: null,
    daysToFirstFrost: null,
    daysToLastFrost: null,
    weeksToFirstFrost: null,
    weeksToLastFrost: null,
  };

  const MS_IN_A_DAY = 24 * 60 * 60 * 1000; //hours * minutes * seconds * milliseconds

  const frostZoneMap = {
    1: ["5/29", "8/29"],
    2: ["5/19", "9/5"],
    3: ["5/9", "9/12"],
    4: ["5/4", "9/30"],
    5: ["4/19", "10/18"],
    6: ["4/12", "10/25"],
    7: ["3/29", "11/7"],
    8: ["3/21", "11/18"],
    9: ["3/21", "11/18"], // ! faking data to make it work for these zones which have no typical frost. // was ["2/18", "12/5"],
    10: ["3/21", "11/18"], // ! https://frostdate.com/zone/10b/ // ["1/31", "12/15"]
    11: ["3/21", "11/18"], // ! faking data to make it work for these zones which have no typical frost. mostly only parts of florida and hawaii. https://frostdate.com/zone/10b/
    12: ["3/21", "11/18"], // ! faking data to make it work for these zones which have no typical frost. mostly only parts of florida and hawaii
    13: ["3/21", "11/18"], // ! faking data to make it work for these zones which have no typical frost. mostly only parts of florida and hawaii
  };

  function getFrostDates(zoneNum, frostZoneMap) {
    if (frostZoneMap[zoneNum]) {
      firstFrostDate = frostZoneMap[zoneNum][1];
      lastFrostDate = frostZoneMap[zoneNum][0];
    } else {
    }
  }

  // Checks if today's date is within the growing season
  // return true if OKAY to plant, return false if NOT GOOD TO PLANT (aka in frost zone time)
  function frostDateCheck(lastFrostDate, firstFrostDate) {
    const dateStr = new Date().toLocaleDateString();
    const [month1, day1, year1] = dateStr.split("/");

    // date control
    // const date = new Date(+year1, month1 - 1, +day1) // ! toggle this for TODAYS DATE
    // const date = new Date(+year1, 0, 2) // ! WINTER JAN 2 - HOUSEPLANTS
    // const date = new Date(+year1, 2, 1)              // ! WINTER MAR 2 - SOWING SEEDS
    // const date = new Date(+year1, 3, 1)              // ! SPRING APR 1
    const date = new Date(+year1, 6, 1); // ! SUMMER JUL 1
    // const date = new Date(+year1, 9, 1)              // ! FALL   OCT 1

    plantTimingObject.currentDate = date;

    const startStr = firstFrostDate; //EX dec 30 = "12/30"
    const [month2, day2] = startStr.split("/");
    const ffDate = new Date(+year1, month2 - 1, +day2);
    const endStr = lastFrostDate; // EX aug 24 = "08/24"
    const [month3, day3] = endStr.split("/");
    const lfDate = new Date(+year1, month3 - 1, +day3);
    const lfDateNextYear = new Date(+year1 + 1, month3 - 1, +day3);

    // handling zones 10,11,12,13 which currently have no frost dates.
    if (lastFrostDate === "null" && firstFrostDate === "null") {
      // console.log("🌱 Your hardiness zone does not have typical frost 🌱")
      // ! what to suggest for this? same as
      plantTimingObject.frostSeason = false;
      // return TRUE // okay to plant

      // is the date in a growing season
    } else if (date > lfDate && date < ffDate) {
      // console.log(`🌱 today is in the growing season for your zone🌱`)

      daysToFirstFrost = Math.round((ffDate - date) / MS_IN_A_DAY);
      weeksToFirstFrost = Math.round(daysToFirstFrost / 7); //rounding to nearest INT

      daysToLastFrost = Math.abs(Math.round((lfDate - date) / MS_IN_A_DAY));
      weeksToLastFrost = Math.round(daysToLastFrost / 7); //rounding to nearest INT

      // console.log(
      //   `days to first frost: ${daysToFirstFrost} ; weeks to first frost: ${weeksToFirstFrost}`
      // )

      // based on the data, when in a growing time zone, weeks to last frost should be a positive number
      plantTimingObject.frostSeason = false;
      plantTimingObject.daysToFirstFrost = daysToFirstFrost;
      plantTimingObject.weeksToFirstFrost = weeksToFirstFrost;
      plantTimingObject.daysToLastFrost = daysToLastFrost;
      plantTimingObject.weeksToLastFrost = weeksToLastFrost;

      // is the date in a frost season
    } else {
      // console.log(`🧊 today is in the frost season for your zone🧊`)
      daysToLastFrost = Math.round(-(lfDateNextYear - date) / MS_IN_A_DAY);
      weeksToLastFrost = Math.round(daysToLastFrost / 7); //rounding to nearest INT
      // console.log(
      //   `days to last frost: ${daysToLastFrost} ; weeks to last frost: ${weeksToLastFrost}`
      // )

      // based on the data, when in a frost zone, weeks to last frost should be a negative number
      plantTimingObject.frostSeason = true;
      plantTimingObject.daysToLastFrost = daysToLastFrost;
      plantTimingObject.weeksToLastFrost = weeksToLastFrost;
    }
  }

  getFrostDates(userZoneNumber, frostZoneMap);
  frostDateCheck(lastFrostDate, firstFrostDate);

  plantTimingObject.zone = userZoneNumber;
  plantTimingObject.firstFrost = firstFrostDate;
  plantTimingObject.lastFrost = lastFrostDate;

  const housePlantDummyData = [
    {
      id: 1,
      name: "Basil",
      species: "species name",
    },
    {
      id: 2,
      name: "Mint",
      species: "species name",
    },
    {
      id: 3,
      name: "Cactus",
      species: "species name",
    },
    {
      id: 4,
      name: "Peace Lily",
      species: "species name",
    },
    {
      id: 5,
      name: "orchid",
      species: "species name",
    },
    {
      id: 6,
      name: "Aloe",
      species: "species name",
    },
    {
      id: 7,
      name: "Fiddle Leaf Fig",
      species: "species name",
    },
    {
      id: 8,
      name: "orchid plus",
      species: "species name",
    },
    {
      id: 9,
      name: "zz plant",
      species: "species name",
    },
    {
      id: 10,
      name: "Rosemary",
      species: "species name",
    },
  ];

  // ! ======== collection reference
  const colRef = collection(db, "testPlants");
  const colRef2 = collection(db, "housePlants");
  // get collection data

  // filter based on time of year
  // this fn will provide an array of 5 objects that are the plant suggestions for our user.
  const filterSug = (arr) => {
    let suggestions = [...arr].sort(() => 0.5 - Math.random());
    return suggestions.slice(0, 5);
  };

  // This fn will accept an object and an array
  // the obj is the obj passed in on state or as props that will let us know what zone we are in / the date / whether it is a frost period / etc
  // the array is the whole list of plants from db
  const getPlantSug = (obj, array) => {
    let viablePlantSug = array.filter((x) => x.life === "a" || x.life === "b");
    // console.log("======== HERE ======")
    // console.log("this is the full plant database array!! ======== ", array)
    // console.log("viable plant suggestions: ", viablePlantSug)

    // This is during frost season
    if (obj.frostSeason) {
      let filteredArr = viablePlantSug.filter(
        (x) => x.weeksBeforeLastFrost === obj.weeksToLastFrost
      );
      return filterSug(filteredArr);
    }
    // This is during non-frost season
    else {
      // if two months less than... from first frost
      // !!!!!! AUTUMN AUTUMN AUTUMN AUTUMN AUTUMN
      if (obj.weeksToFirstFrost < 9) {
        // console.log("less than 9 weeks from first frost IF");
        if (obj.weeksToFirstFrost < 9 && obj.weeksToFirstFrost > 4) {
          let twoMonthTillFrost = viablePlantSug.filter((x) => x.method === 1);
          // console.log("WHERE AM I ????? IF 1")

          return filterSug(twoMonthTillFrost);
        }
        if (obj.weeksToFirstFrost <= 4 && obj.zone === 9) {
          let oneMonthTillFrost = viablePlantSug.filter((x) => x.method === 8);
          // console.log("WHERE AM I ????? IF 2")
          return filterSug(oneMonthTillFrost);
        }
        if (obj.weeksToFirstFrost <= 4 && obj.zone === 8) {
          let oneMonthTillFrost = viablePlantSug.filter((x) => x.method === 9);
          // console.log("WHERE AM I ????? IF 3")
          return filterSug(oneMonthTillFrost);
        }
        if (obj.weeksToFirstFrost <= 4 && obj.zone <= 7) {
          let oneMonthTillFrost = viablePlantSug.filter((x) => x.method === 10);
          // console.log("WHERE AM I ????? IF 4")
          return filterSug(oneMonthTillFrost);
        }
      }

      // !!!!! SPRING AND SUMMER
      else {
        // !!!!! SUMMER-ish
        if (
          obj.zone >= 8 &&
          obj.weeksToLastFrost > 10 &&
          obj.weeksToLastFrost < 29
        ) {
          let plantsNonFrost = viablePlantSug.filter(
            (x) => x.weeksBeforeLastFrost > 0 && x.weeksBeforeLastFrost < 23
          );
          // console.log("obj weeks to last frost ", obj.weeksToLastFrost)
          // console.log("plantsNonFrost", plantsNonFrost)
          return filterSug(plantsNonFrost);
          // !!!!!! SPTING-ish
        } else if (
          obj.zone >= 8 &&
          obj.weeksToLastFrost > 28 &&
          obj.weeksToLastFrost < 35
        ) {
          let plantsNonFrost = viablePlantSug.filter(
            (x) => x.weeksBeforeLastFrost === 25
          );
          // console.log("obj weeks to last frost ", obj.weeksToLastFrost)
          // console.log("plantsNonFrost", plantsNonFrost)
          return filterSug(plantsNonFrost);
        } else {
          let plantsNonFrost = viablePlantSug.filter(
            (x) =>
              x.weeksBeforeLastFrost === obj.weeksToLastFrost ||
              x.weeksBeforeLastFrost === obj.weeksToLastFrost + 1 ||
              x.weeksBeforeLastFrost === obj.weeksToLastFrost - 1
          );
          // console.log("obj weeks to last frost ", obj.weeksToLastFrost)
          // console.log("plantsNonFrost", plantsNonFrost)
          return filterSug(plantsNonFrost);
        }
      }
    }
  };

  // console.log(getPlantSug(plantTimingObject, plantsDatabaseData))
  // console.log("=======this is the plants DB data", plantsDbData)
  let suggestedPlantsData = getPlantSug(plantTimingObject, plantsDbData);
  let suggestedHousePlantsData = filterSug(housePlantsDbData);
  // let suggestedHousePlantsData = filterSug(housePlantDummyData)

  // console.log("======= timing object: ", plantTimingObject)
  // console.log("suggested plants", suggestedPlantsData)
  // console.log("suggested house plants", suggestedHousePlantsData)
  let max = 18737;
  let min = 89;
  return (
    <div className="plant-suggestions-container">
      <div className="plant-suggestions-heading-container">
        <h2 className="plant-suggestions-header">YOUR PLANT SUGGESTIONS</h2>
        <Link to="/allplants">View All Plants</Link>
      </div>

      {suggestedPlantsData.length > 0 ? (
        suggestedPlantsData.map((curPlant) => (
          <div
            className="individual-plant-suggestion"
            key={Math.floor(Math.random() * (max - min + 1)) + min}
          >
            <div>
              <h3>{curPlant.name}</h3>
            </div>
            <div>
              <Link to={`/allPlants/${curPlant.id}`}>
                <img src={curPlant.img} className="plantSugImg" />
              </Link>
            </div>
          </div>
        ))
      ) : (
        <>
          <div>
            <h3>Today we suggest indoor plants</h3>
            <div>
              {suggestedHousePlantsData.map((curPlant) => (
                <div
                  className="individual-plant-suggestion"
                  key={Math.floor(Math.random() * (max - min + 1)) + min}
                >
                  <div>
                    <h3>{curPlant.name}</h3>
                  </div>
                  <div>
                    <img src={curPlant.img} className="plantSugImg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlantSuggestions;
