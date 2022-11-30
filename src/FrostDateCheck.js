const FrostDatecheck = () => {
  const userZoneNumber = 1 // ! PLACEHOLDER

  // initialize
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
    plantTimingObject.currentDate = dateStr
    const [month1, day1, year1] = dateStr.split("/")
    const date = new Date(+year1, month1 - 1, +day1)

    const startStr = firstFrostDate //EX dec 30 = "12/30"
    const [month2, day2] = startStr.split("/")
    const ffDate = new Date(+year1, month2 - 1, +day2)

    const endStr = lastFrostDate // EX aug 24 = "08/24"
    const [month3, day3] = endStr.split("/")
    const lfDate = new Date(+year1, month3 - 1, +day3)
    const lfDateNextYear = new Date(+year1 + 1, month3 - 1, +day3)

    // handling zones 10,11,12,13 which currently have no frost dates.
    if (lastFrostDate === "null" && firstFrostDate === "null") {
      console.log("🌱 Your hardiness zone does not have typical frost 🌱")
      // ! what to suggest for this? same as
      plantTimingObject.frostSeason = false
      // return TRUE // okay to plant
    } else if (date > lfDate && date < ffDate) {
      console.log(`🌱 today is in the growing season for your zone🌱`)

      daysToFirstFrost = Math.round((ffDate - date) / MS_IN_A_DAY)
      weeksToFirstFrost = Math.round(daysToFirstFrost / 7) //rounding to nearest INT

      console.log(
        `days to first frost: ${daysToFirstFrost} ; weeks to first frost: ${weeksToFirstFrost}`
      )

      plantTimingObject.frostSeason = false
      plantTimingObject.daysToFirstFrost = daysToFirstFrost
      plantTimingObject.weeksToFirstFrost = weeksToFirstFrost
    } else {
      console.log(`🧊 today is in the frost season for your zone🧊`)
      daysToLastFrost = Math.round((lfDateNextYear - date) / MS_IN_A_DAY)
      weeksToLastFrost = Math.round(daysToLastFrost / 7) //rounding to nearest INT
      console.log(
        `days to last frost: ${daysToLastFrost} ; weeks to last frost: ${weeksToLastFrost}`
      )

      plantTimingObject.frostSeason = true
      plantTimingObject.daysToLastFrost = daysToLastFrost
      plantTimingObject.weeksToLastFrost = weeksToLastFrost
    }
  }

  getFrostDates(userZoneNumber, frostZoneMap)
  frostDateCheck(lastFrostDate, firstFrostDate)
  // frostDateCheck("1/10", "11/20") //debug testing dates

  plantTimingObject.zone = userZoneNumber
  plantTimingObject.firstFrost = firstFrostDate
  plantTimingObject.lastFrost = lastFrostDate

  console.log(plantTimingObject)
  // module.export = { plantTimingObject }

  return (
    <>
      <div>
        <h1>showing something</h1>
        <p>zone: {plantTimingObject.zone}</p>
        <p>firstFrost: {plantTimingObject.firstFrost}</p>
        <p>lastFrost: {plantTimingObject.lastFrost}</p>
        <p>currentDate: {plantTimingObject.currentDate}</p>
        <p>frostSeason: {plantTimingObject.frostSeason}</p>
        <p>daysToFirstFrost: {plantTimingObject.daysToFirstFrost}</p>
        <p>daysToLastFrost: {plantTimingObject.daysToLastFrost}</p>
        <p>weeksToFirstFrost: {plantTimingObject.weeksToFirstFrost}</p>
        <p>weeksToLastFrost: {plantTimingObject.weeksToLastFrost}</p>
      </div>
    </>
  )
}



export default FrostDatecheck
