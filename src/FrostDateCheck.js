// ! assume we are getting a clean frost zone number

// ! frost data. make changes here to change frost dates
// formatted as MM/DD
const frostZoneMap = {}

// Checks if today's date is within a specified frost zone
// accept start date, end date as a string  DATE FORMAT: "MM/DD"
// return true if OKAY to plant, return false if NOT GOOD TO PLANT (aka in frost zone time)
function frostDateCheck(firstFrostDate, lastFrostDate) {
  const dateStr = new Date().toLocaleDateString()
  console.log("today's date: ", dateStr)
  const [month1, day1, year1] = dateStr.split("/")
  const date = new Date(month1 - 1, +day1)

  const startStr = firstFrostDate // EX aug 24 = "08/24"
  const [month2, day2] = startStr.split("/")
  const startDate = new Date(month2 - 1, +day2)

  const endStr = lastFrostDate //EX dec 30 = "12/30"
  const [month3, day3] = endStr.split("/")
  const endDate = new Date(month3 - 1, +day3)

  if (date > startDate && date < endDate) {
    console.log(`✅ date is between start and end dates`)
  } else {
    console.log(`⛔️ date is NOT between start and end dates`)
  }
}

frostDateCheck("08/24", "12/30")
