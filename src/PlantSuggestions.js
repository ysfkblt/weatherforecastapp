// import { db } from './firebase-config'
// import { collection, getDocs, query, where } from "firebase/firestore"

import { onAuthStateChanged } from "firebase/auth"
import { collection, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, db } from "./firebase-config"

// ! TODO, integrate getting actual user zone number
// ! take out dummy plant data, and connect to real firestore database
// ! style JSX return

const PlantSuggestions = (props) => {
  // const userZoneNumber = 8 // ! PLACEHOLDER
  const [currentUser, setCurrentUser] = useState("")
  const [userZoneNumber, setUserZoneNumber] = useState(8)
  const [plantsDbData, setPlantsDbData] = useState([])
  
  const {userId}=props
  // console.log(userId,"********")
  
  const wormCollection = collection(db, "worms", userId, "personal")
  
  useEffect(()=>{
  async function getworms(){
    const data = await getDocs(wormCollection)
    let pre_zone=data.docs[0].data().zone
    let zone = parseInt(pre_zone)
    setUserZoneNumber(zone)
  }
  getworms()

   function plantData(){ 
     getDocs(colRef)
      .then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            // console.log(doc.data(), "#####")
            setPlantsDbData((prev)=> [...prev, doc.data()])
            // , {id : doc.id}
              // plantsDbData.push({ ...doc.data(), id : doc.id })
          })
          return plantsDbData
      })
      .catch(err => {
          console.log(err.message)
      })
    }


      plantData()
}, [])

// console.log(plantsDbData)
  // initializezzz
  let firstFrostDate = null
  let lastFrostDate = null
  let daysToFirstFrost = null
  let daysToLastFrost = null
  let weeksToFirstFrost = null
  let weeksToLastFrost = null

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
  }

  const MS_IN_A_DAY = 24 * 60 * 60 * 1000 //hours * minutes * seconds * milliseconds

  // todo ? get more specific data for EX 9a,9b
  /** ! frost data. make changes here to change frost dates
   *  zone# : [last frost date, first frost date]
   *  aka zone#: [start of growing season, end of growing season]
   */
  const frostZoneMap = {
    1: ["5/29", "8/29"],
    2: ["5/19", "9/5"],
    3: ["5/9", "9/12"],
    4: ["5/4", "9/30"],
    5: ["4/19", "10/18"],
    6: ["4/12", "10/25"],
    7: ["3/29", "11/7"],
    8: ["3/21", "11/18"],
    9: ["2/18", "12/5"],
    10: ["null", "null"],
    11: ["null", "null"],
    12: ["null", "null"],
    13: ["null", "null"],
  }

  function getFrostDates(zoneNum, frostZoneMap) {
    if (frostZoneMap[zoneNum]) {
      // console.log(
      //   "user zone and last and first frosts >>> ",
      //   zoneNum,
      //   ":",
      //   frostZoneMap[zoneNum]
      // )
      firstFrostDate = frostZoneMap[zoneNum][1]
      lastFrostDate = frostZoneMap[zoneNum][0]
    } else {
      // TBD add error handling
      // console.log("ERROR: entered zone does not exist within dataset")
    }
  }

  // Checks if today's date is within the growing season
  // return true if OKAY to plant, return false if NOT GOOD TO PLANT (aka in frost zone time)
  function frostDateCheck(lastFrostDate, firstFrostDate) {
    const dateStr = new Date().toLocaleDateString()
    // console.log("today's date: ", dateStr)
    plantTimingObject.currentDate = dateStr
    const [month1, day1, year1] = dateStr.split("/")

    // ! look HERE
    // const date = new Date(+year1, month1 - 1, +day1) 
    const date = new Date(+year1, 7, +day1)
    // console.log(date)


    const startStr = firstFrostDate //EX dec 30 = "12/30"
    const [month2, day2] = startStr.split("/")
    const ffDate = new Date(+year1, month2 - 1, +day2)

    const endStr = lastFrostDate // EX aug 24 = "08/24"
    const [month3, day3] = endStr.split("/")
    const lfDate = new Date(+year1, month3 - 1, +day3)
    const lfDateNextYear = new Date(+year1 + 1, month3 - 1, +day3)

    // handling zones 10,11,12,13 which currently have no frost dates.
    if (lastFrostDate === "null" && firstFrostDate === "null") {
      // console.log("🌱 Your hardiness zone does not have typical frost 🌱")
      // ! what to suggest for this? same as
      plantTimingObject.frostSeason = false
      // return TRUE // okay to plant

      // is the date in a growing season
    } else if (date > lfDate && date < ffDate) {
      // console.log(`🌱 today is in the growing season for your zone🌱`)

      daysToFirstFrost = Math.round((ffDate - date) / MS_IN_A_DAY)
      weeksToFirstFrost = Math.round(daysToFirstFrost / 7) //rounding to nearest INT

      daysToLastFrost = Math.abs(Math.round((lfDate - date) / MS_IN_A_DAY))
      weeksToLastFrost = Math.round(daysToLastFrost / 7) //rounding to nearest INT

      // console.log(
      //   `days to first frost: ${daysToFirstFrost} ; weeks to first frost: ${weeksToFirstFrost}`
      // )

      // based on the data, when in a growing time zone, weeks to last frost should be a positive number
      plantTimingObject.frostSeason = false
      plantTimingObject.daysToFirstFrost = daysToFirstFrost
      plantTimingObject.weeksToFirstFrost = weeksToFirstFrost
      plantTimingObject.daysToLastFrost = daysToLastFrost
      plantTimingObject.weeksToLastFrost = weeksToLastFrost

      // is the date in a frost season
    } else {
      // console.log(`🧊 today is in the frost season for your zone🧊`)
      daysToLastFrost = Math.round(-(lfDateNextYear - date) / MS_IN_A_DAY)
      weeksToLastFrost = Math.round(daysToLastFrost / 7) //rounding to nearest INT
      // console.log(
      //   `days to last frost: ${daysToLastFrost} ; weeks to last frost: ${weeksToLastFrost}`
      // )

      // based on the data, when in a frost zone, weeks to last frost should be a negative number
      plantTimingObject.frostSeason = true
      plantTimingObject.daysToLastFrost = daysToLastFrost
      plantTimingObject.weeksToLastFrost = weeksToLastFrost
    }
  }

  getFrostDates(userZoneNumber, frostZoneMap)
  frostDateCheck(lastFrostDate, firstFrostDate)
  // frostDateCheck("1/8", "12/15") //debug testing dates

  plantTimingObject.zone = userZoneNumber
  plantTimingObject.firstFrost = firstFrostDate
  plantTimingObject.lastFrost = lastFrostDate

  // console.log(plantTimingObject)

  // ! can delete this, ONCE, we are connected to real/emulated firestore
  // const flowersDummyData = [
  //   {
  //     id: 1,
  //     name: "cherry",
  //     life: "a",
  //     weeksBeforeLastFrost: -2,
  //     method: 1,
  //   },
  //   {
  //     id: 2,
  //     name: "strawberry",
  //     life: "a",
  //     weeksBeforeLastFrost: 4,
  //     method: 9,
  //   },
  //   {
  //     id: 3,
  //     name: "sunflower",
  //     life: "a",
  //     weeksBeforeLastFrost: 6,
  //     method: 1,
  //   },
  //   {
  //     id: 4,
  //     name: "apple",
  //     life: "b",
  //     weeksBeforeLastFrost: 6,
  //     method: 10,
  //   },
  //   {
  //     id: 5,
  //     name: "orchid",
  //     life: "b",
  //     weeksBeforeLastFrost: 4,
  //     method: 10,
  //   },
  //   {
  //     id: 6,
  //     name: "leaf",
  //     life: "a",
  //     weeksBeforeLastFrost: 5,
  //     method: 10,
  //   },
  //   {
  //     id: 7,
  //     name: "this cannot showup ever",
  //     life: "p",
  //     weeksBeforeLastFrost: 5,
  //     method: 1,
  //   },
  //   {
  //     id: 8,
  //     name: "orchid plus",
  //     life: "b",
  //     weeksBeforeLastFrost: -16,
  //     method: 10,
  //   },
  //   {
  //     id: 9,
  //     name: "leaf plus",
  //     life: "a",
  //     weeksBeforeLastFrost: -16,
  //     method: 10,
  //   },
  //   {
  //     id: 10,
  //     name: "safhsdfsdaf",
  //     life: "a",
  //     weeksBeforeLastFrost: -16,
  //     method: 1,
  //   },
  // ]

  // ! ======== collection reference
  const colRef = collection(db, 'plants')
  // get collection data

  // filter based on time of year
  // this fn will provide an array of 5 objects that are the plant suggestions for our user.
  const filterSug = (arr) => {
    let suggestions = [...arr].sort(() => 0.5 - Math.random())
    return suggestions.slice(0, 5)
  }

  // This fn will accept an object and an array
  // the obj is the obj passed in on state or as props that will let us know what zone we are in / the date / whether it is a frost period / etc
  // the array is the whole list of plants from db
  const getPlantSug = (obj, array) => {
    let viablePlantSug = array.filter((x) => x.life === "a" || x.life === "b")
    // console.log("======== HERE ======")
    // console.log("this is the array!! ======== ",array)
    // console.log(viablePlantSug)


    // This is during frost season
    if (obj.frostSeason) {
      let filteredArr = viablePlantSug.filter(
        (x) => x.weeksBeforeLastFrost === obj.weeksToLastFrost
      )
      return filterSug(filteredArr)
    }
    // This is during non-frost season
    else {
      // if two months from first frost
      
      if (obj.weeksToFirstFrost < 9) {
        if (obj.weeksToFirstFrost < 9 && obj.weeksToFirstFrost > 4) {
          let twoMonthTillFrost = viablePlantSug.filter((x) => x.method === 1)
          // console.log("======= in the growing season")
          // console.log(twoMonthTillFrost)
          return filterSug(twoMonthTillFrost)
        }
        if (obj.weeksToFirstFrost <= 4 && obj.zone === 9) {
          let oneMonthTillFrost = viablePlantSug.filter((x) => x.method === 8)
          return filterSug(oneMonthTillFrost)
        }
        if (obj.weeksToFirstFrost <= 4 && obj.zone === 8) {
          let oneMonthTillFrost = viablePlantSug.filter((x) => x.method === 9)
          return filterSug(oneMonthTillFrost)
        }
        if (obj.weeksToFirstFrost <= 4 && obj.zone <= 7) {
          let oneMonthTillFrost = viablePlantSug.filter((x) => x.method === 10)
          return filterSug(oneMonthTillFrost)
        }
      }
      // Suggestions of plants for non-frost period
      else {
        let plantsNonFrost = viablePlantSug.filter(
          (x) =>
            x.weeksBeforeLastFrost === obj.weeksToLastFrost ||
            x.weeksBeforeLastFrost === obj.weeksToLastFrost + 1 ||
            x.weeksBeforeLastFrost === obj.weeksToLastFrost - 1
        )
        return filterSug(plantsNonFrost)
      }
    }
  }

  // console.log(getPlantSug(plantTimingObject, plantsDatabaseData))
  // console.log("=======this is the plants DB data",plantsDbData)
  let suggestedPlantsData = getPlantSug(plantTimingObject, plantsDbData)

  return (
  
    <div className="plant-suggestions-container">
      <h2 className="plant-suggestions-header"> PLANT SUGGESTIONS </h2>
      {/* <p>Based on your current location's frost zone, here are some plants we think would be happy being planted right now:</p> */}
      {suggestedPlantsData.map((curPlant) => (
        <div className="plant-suggestions-" key={curPlant.id}>
          <h3>{curPlant.name}</h3>
        </div>
      ))}
    </div>
  )
}

export default PlantSuggestions
