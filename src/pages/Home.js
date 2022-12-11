import { useState, useEffect } from "react"
import background, { gradient } from "../components/background"
import { shuffle } from "lodash"
import UpdateZipCode from "../components/LocationUpdate"
import PlantSuggestions from "../components/PlantSuggestions"
import ToggleDark from "../components/toggleDark"
import { ThemeContext, themes } from "../components/themeContext"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth, db } from "../database/firebase-config"
import { Link } from "react-router-dom"
import Search from "../components/Search"
import { collection, doc, getDocs } from "firebase/firestore"
import { connectStorageEmulator } from "firebase/storage"


const Home = (props) => {
  const [search, setSearch] = useState("")
  const [info, setInfo] = useState({})
  const [grad, setgrad] = useState(null)
  const [zone, setZone] = useState("")
  const [zip, setZip] = useState("")
  const [user, setUser] = useState(props.user)
  const [userId, setUserId] = useState("")
  const [userZone, setuserZone] = useState("")
  const [darkMode, setDarkMode] = useState(true)
  // console.log("THIS IS USER IN HOME JS", user)
  useEffect(() => {
    async function getDatas() {
      console.log(user.uid)
      const wormCollection = collection(db, "worms", user.uid, "personal")
      console.log("PASSING WORMCOLLECTION")
      let newData = await getDocs(wormCollection)
      console.log("USERDATA IN HOMEJS", newData.docs[0].data().zone)
      setuserZone(newData.docs[0].data().zone)
    }
    getDatas()
  }, [])

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
            current: d.current.temp_f,
            max: d.forecast.forecastday[0].day.maxtemp_f,
            min: d.forecast.forecastday[0].day.mintemp_f,
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

  function handleKeyPress(e) {
    if (e.key === "Enter") getData()
  }

  function handleSearch(e) {
    console.log(e.target.value)
    setSearch(e.target.value)
    setZip(e.target.value)
    getData()
  }


  useEffect(() => {
    getData()
  }, [zip])

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
      className="home-view-container">

      <header className="top-home-page-row">
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
        <Link to="/allplants">View All</Link>
        {/* Update user */}
        {/* {userId && zip.length === 5 && zone ? (
          <>
            <UpdateZipCode
              userId={userId}
              zip={zip}
              zone={zone.zone}
              coordinates={zone.coordinates}
            />
          </>
        ) : null} */}

        {/* Search Bar */}
        <section>
          {/* <Search
            handleKeyPress={handleKeyPress}
            handleButtonClick={handleButtonClick}
            onChange={handleSearch}
            function={handleSearch}
          /> */}
          <section className="search-container">
            <article className="search-input-container">
              <input
                className="search-input"
                type="text"
                spellCheck="false"
                value={search}
                placeholder="please enter zip"
                onChange={handleSearch}
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "please enter location")}
                onKeyPress={handleKeyPress}
              />
            </article>

            <article className="search-icon-container">
              <button className="search-icon" onClick={getData}>
                <i className="fa fa-search fa-2x" aria-hidden="true"></i>
              </button>
            </article>
          </section>

          {/* Hidden info display, reveals after search button click */}

          <div className="search-results-container">
            <div className="search-results-temp">
              {info.temp ? (
                <p className="search-results-temp-text">
                  {info.temp?.current}
                  <span className="search-results-temp-text-degrees">
                    °f
                  </span>

                </p>
              ) : null}
            </div>


            <div className="search-results-sub-container">
              <p className="search-results-condition-text">
                {info.condition}
              </p>
              {info.temp ? (
                <p className="search-results-temp-range">

                  <div className="search-results-temp-range-icon" >
                    <i className="fa fa-arrow-up" aria-hidden="true"></i>
                  </div>
                  {info.temp?.max}

                  <span className="search-results-temp-range-degrees">
                    °
                  </span>{" "}
                  <div className="search-results-temp-range-icon">
                    <i class="fa fa-arrow-down" aria-hidden="true"></i>
                  </div>

                  {info.temp?.min}

                  <span className="search-results-temp-range-degrees">
                    °
                  </span>
                </p>
              ) : null}

              <p className="search-results-location">
                {info.country}
              </p>
              {zone.zone ? <p className="search-results-zone">
                Hardiness Zone {zone.zone}</p> : null}
            </div>
          </div>
        </section>
      </header>

      <span className="welcome-user">
        {(user ? (<span>Welcome <Link to="/user">{user.displayName}!</Link></span>) :
          "Welcome!")}
      </span>

      {/* Plant Suggestions */}

      {props.userId && zip.length === 5 ? (
        <>
        {console.log("USING SEARCHED ZONE")}
          <PlantSuggestions userId={props.userId} zone={zone.zone} />
          <div>NEW ZIP {zone.zone}</div>
          {console.log("SEARCHING NEW ZIP", zone)}
        </>
      ) : props.userId ? (
        <>
        <div>USER'S ZONE {userZone}</div>
        {console.log("USING SAVED ZONE")}
          <PlantSuggestions userId={props.userId} zone={userZone} />
          {console.log("LOOKING FOR USER SAVED ZIP", userZone)}
        </>
      ) : (
        <>
        {console.log("USING DEFAULT ZONE 8")}
          <PlantSuggestions userId={"NA"} zone={8}/>
          <div>DEFAULT DATA</div>
          {console.log("GETTING DEFAULT DATA?", search)}
        </>
      )}

    </div>

  )
}

export default Home