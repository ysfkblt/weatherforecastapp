const userZoneNumber = 9 // ! PLACEHOLDER
let firstFrostDate = null
let lastFrostDate = null

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
    console.log(
      "user zone and last and first frosts >>> ",
      zoneNum,
      ":",
      frostZoneMap[zoneNum]
    )
    firstFrostDate = frostZoneMap[zoneNum][1]
    lastFrostDate = frostZoneMap[zoneNum][0]
  } else {
    // TBD add error handling
    console.log("ERROR: entered zone does not exist within dataset")
  }
}

// Checks if today's date is within the growing season
// return true if OKAY to plant, return false if NOT GOOD TO PLANT (aka in frost zone time)
function frostDateCheck(lastFrostDate, firstFrostDate) {
  const dateStr = new Date().toLocaleDateString()
  console.log("today's date: ", dateStr)
  const [month1, day1, year1] = dateStr.split("/")
  const date = new Date(+year1, month1 - 1, +day1)

  const startStr = firstFrostDate // EX aug 24 = "08/24"
  const [month2, day2] = startStr.split("/")
  const endGrowDate = new Date(+year1, month2 - 1, +day2)

  const endStr = lastFrostDate //EX dec 30 = "12/30"
  const [month3, day3] = endStr.split("/")
  const startGrowDate = new Date(+year1, month3 - 1, +day3)

  // handling zones 10,11,12,13 which currently have no frost dates.
  // assume it is okay to plant at any time in these zones
  if (lastFrostDate === "null" && firstFrostDate === "null") {
    console.log(
      "Your hardiness zone does not have typical frost, it is OK to plant 🌱✅"
    )
    // return TRUE // okay to plant
  } else if (date > startGrowDate && date < endGrowDate) {
    console.log(
      `✅🌱 today's date is NOT between frost season for your hardiness zone, OK to plant 🌱✅ `
    )
    console.log({ date }, { startGrowDate }, { endGrowDate })
    // return TRUE // okay to plant
  } else {
    console.log(
      `⛔️🧊 today's date is between the frost season for your hardiness zone, do not plant 🧊⛔️`
    )
    console.log({ date }, { startGrowDate }, { endGrowDate })
    // return FALSE // not okay to plant
  }
}

getFrostDates(userZoneNumber, frostZoneMap)
frostDateCheck(lastFrostDate, firstFrostDate)
// frostDateCheck("11/30", "12/29") //debug testing dates

// todo season checker?
// todo what exactly we want to return?
