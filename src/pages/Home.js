import { useState, useEffect } from "react"
import background, { gradient } from "../components/background"
import { shuffle } from "lodash"
import UpdateZipCode from "../components/LocationUpdate"
import PlantSuggestions from "../components/PlantSuggestions"
import ToggleDark from "../components/toggleDark"
import { ThemeContext, themes } from "../components/themeContext"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../database/firebase-config"
import { Link } from "react-router-dom"
import Search from "../components/Search"
import { handleButtonClick, handleKeyPress, handleSearch } from "../components/Search"
import Journal from "./Journal"


const Home = (props) => {
  const [search, setSearch] = useState("")
  const [info, setInfo] = useState({})
  const [grad, setgrad] = useState(null)
  const [zone, setZone] = useState("")
  const [zip, setZip] = useState("")
  const [userId, setUserId] = useState("")
  const [darkMode, setDarkMode] = useState(true)

<<<<<<< HEAD
  console.log("TESTING ZONE",zone)
  console.log("TESTING ZIP",zip)
=======



>>>>>>> c0be93659980bd5dcfda1d4dc74b9a61efb07c8a
  async function getData() {
    await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=f676e0d30686474d99b160351221104&q=${search}&days=1&aqi=no&alerts=no`
    )
      .then((r) => r.json())
      .then((d) =>
        setInfo({
          name: d.location.name,
          country: d.location.country,
          condition: d.current.condition.text,
          temp: {
            current: d.current.temp_c,
            max: d.forecast.forecastday[0].day.maxtemp_c,
            min: d.forecast.forecastday[0].day.mintemp_c,
          },
        })
      )
  }

  // ZONE API

  const fetchZone = async (search) => {
    const response = await fetch(`https://phzmapi.org/${search}.json`)
    const data = await response.json()
    return data
  }

  // const wormIdCollection = collection(db, "worms")
  // const q = query(wormIdCollection, where("id", "==", props.userId))
  // const wormCollection = collection(db, "worms", currentChild, "journal")

  useEffect(() => {
    async function getZone() {
      let zoneResults = await fetchZone(search)
      {
        zoneResults ? setZone(zoneResults) : setZone("")
      }
    }
    getZone()
    // async function getworms() {
    // 	const data1 = await getDocs(q)
    // 	const wormCollection = collection(db, "worms", data1.docs[0].id, "journal")
    // 	const datas = await getDocs(wormCollection)
    // 	if (data1.docs.length === 0) {
    // 		addDoc(wormIdCollection, { id: props.userId })
    // 	}
    // 	setCurrentChild(data1.docs[0].id)
    // }
    // // await setWorms((datas.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
    // getworms()
  }, [search])

  // SEARCH

  function handleButtonClick() {
    getData()
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") handleButtonClick()
  }

  function handleSearch(e) {
    setSearch(e.target.value)
    setZip(e.target.value)
    handleButtonClick()
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    setgrad(shuffle(gradient).pop())
  }, [])

  return (
    // Dynamic Background
    <div
      style={
        info.condition?.toLowerCase() === "clear"
          ? { backgroundImage: background.clear }
          : info.condition?.toLowerCase() === "sunny"
            ? { backgroundImage: background.sunny }
            : info.condition?.toLowerCase().includes("cloudy")
              ? { backgroundImage: background.cloudy }
              : info.condition?.toLowerCase().includes("rain") ||
                info.condition?.toLowerCase().includes("drizzle")
                ? { backgroundImage: background.rainy }
                : info.condition?.toLowerCase().includes("snow") ||
                  info.condition?.toLowerCase().includes("sleet")
                  ? { backgroundImage: background.snow }
                  : info.condition?.toLowerCase().includes("overcast")
                    ? { backgroundImage: background.overcast }
                    : { backgroundImage: grad }
      }
      className="home-view-container"
    >

      <ThemeContext.Consumer>
        {({ changeTheme }) => (
          <ToggleDark
            toggleDark={() => {
              setDarkMode(!darkMode)
              changeTheme(darkMode ? themes.light : themes.dark)
            }}
          />
        )}
      </ThemeContext.Consumer>

      


      {/* Update user */}
      {props.userId && zip.length === 5 && zone ? (
        <>
        {console.log("WORKING")}
          <UpdateZipCode
            userId={props.userId}
            zip={zip}
            zone={zone.zone}
            coordinates={zone.coordinates}
          />
        </>
      ) : null}

      {/* Search Bar */}
      <div>
        <Search
          handleKeyPress={handleKeyPress}
          handleButtonClick={handleButtonClick}
          onChange={handleSearch}
        />
      </div>

<<<<<<< HEAD
      {/* Hidden info display, reveals after search button click */}
      <div className="grid overflow-hidden grid-cols-2 grid-rows-2 gap-10 sm:gap-40 sm:mt-72 mt-56 sm:mr-0 mr-4">
        <div className="row-span-2 justify-self-end">
          {info.temp ? (
            <p className="text-end sm:text-9xl text-7xl font-light tracking-tighter">
              {info.temp?.current}
              <span className=" align-top  text-lg sm:font-light font-normal sm:text-3xl">
                °
              </span>
            </p>
          ) : null}
        </div>
        <div className="row-span-2  sm:mt-3 mt-2  justify-self-start truncate">
          <p className=" text-start sm:text-3xl font-light sm:pb-1 sm:ml-1">
            {info.condition}
          </p>
          {info.temp ? (
            <p className="sm:text-2xl  text-start font-light">
              <ArrowUpIcon className="sm:h-4  h-2 inline-flex align-middle" />
              {info.temp?.max}
              <span className="align-top font-normal sm:text-base text-xs">
                °
              </span>{" "}
              <ArrowDownIcon className="sm:h-4 h-2 inline-flex align-middle" />
              {info.temp?.min}
              <span className="align-top font-normal sm:text-base text-xs">
                °
              </span>
            </p>
          ) : null}

          <p className="sm:text-xl text-xs  text-start font-light  whitespace-nowrap  sm:mt-1 sm:ml-1">
            {info.country}
          </p>
          {zone.zone ? <p className="">Hardiness Zone {zone.zone}</p> : null}
        </div>

        {props.userId ? (
          <PlantSuggestions userId={props.userId} zip={zip}/>
        ) : (
          <PlantSuggestions userId={"NA"} />
        )}
      </div>
=======
      
      {/* Plant Suggestions */}

      {props.userId ? (
        <PlantSuggestions userId={props.userId} />
      ) : (
        <PlantSuggestions userId={"NA"} />
      )}

>>>>>>> c0be93659980bd5dcfda1d4dc74b9a61efb07c8a
    </div>

  )
}

export default Home
