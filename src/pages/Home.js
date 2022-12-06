import { useState, useEffect } from "react"
import {
  SearchIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from "@heroicons/react/outline"
import background, { gradient } from "../components/background"
import { shuffle } from "lodash"
import UpdateZipCode from "../components/LocationUpdate"
import PlantSuggestions from "../components/PlantSuggestions"
import ToggleDark from "../components/toggleDark"
import { ThemeContext, themes } from "../components/themeContext"

const Home = (props) => {
  const [search, setSearch] = useState("")
  const [info, setInfo] = useState({})
  const [grad, setgrad] = useState(null)
  const [zone, setZone] = useState("")
  const [zip, setZip] = useState("")
  const [userId, setUserId] = useState("")
  const [darkMode, setDarkMode] = useState(true)

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
      {/* DARKMODE */}
      <header className="header-container">
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
      </header>

      {/* Update user */}
      {userId && zip.length === 5 && zone ? (
        <>
          <UpdateZipCode
            userId={userId}
            zip={zip}
            zone={zone.zone}
            coordinates={zone.coordinates}
          />
        </>
      ) : null}

      {/* Search Bar */}
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          spellCheck="false"
          value={search}
          placeholder="please enter location"
          onChange={handleSearch}
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "please enter location")}
          onKeyPress={handleKeyPress}
        />

        <div className="search-icon-container">
          <button className="search-icon" onClick={handleButtonClick}>
            <i class="fa fa-search fa-2x" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      {/* Hidden info display, reveals after search button click */}

      {/* grid overflow-hidden grid-cols-2 grid-rows-2 gap-10 sm:gap-40 sm:mt-72 mt-56 sm:mr-0 mr-4 */}
      <div className="search-results-container">
        {/* row-span-2 justify-self-end */}
        <div className="search-results-temp">
          {info.temp ? (
            // text-end sm:text-9xl text-7xl font-light tracking-tighter
            <p className="search-results-temp-text">
              {info.temp?.current}
              {/*  align-top  text-lg sm:font-light font-normal sm:text-3xl */}
              <span className="search-results-temp-text-degrees">
                °
              </span>
            </p>
          ) : null}
        </div>

        {/* row-span-2  sm:mt-3 mt-2  justify-self-start truncate */}
        <div className="search-results-sub-container">
          {/* text-start sm:text-3xl font-light sm:pb-1 sm:ml-1 */}
          <p className="search-results-condition-text">
            {info.condition}
          </p>
          {info.temp ? (
            // sm:text-2xl  text-start font-light
            <p className="search-results-temp-range">
              {/* sm:h-4  h-2 inline-flex align-middle */}
              <div className="search-results-temp-range-icon" >
                <i class="fa fa-arrow-up" aria-hidden="true"></i>
              </div>
              {info.temp?.max}
              {/* align-top font-normal sm:text-base text-xs */}
              <span className="search-results-temp-range-degrees">
                °
              </span>{" "}
              <ArrowDownIcon className="search-results-temp-range-icon" />
              {info.temp?.min}
              {/* align-top font-normal sm:text-base text-xs */}
              <span className="search-results-temp-range-degrees">
                °
              </span>
            </p>
          ) : null}

          {/* sm:text-xl text-xs  text-start font-light  whitespace-nowrap  sm:mt-1 sm:ml-1 */}
          <p className="search-results-location">
            {info.country}
          </p>
          {zone.zone ? <p className="search-results-zone">
            Hardiness Zone {zone.zone}</p> : null}
        </div>
      </div>

      {props.userId ? (
        <PlantSuggestions userId={props.userId} />
      ) : (
        <PlantSuggestions userId={"NA"} />
      )}

    </div>
  )
}

export default Home
