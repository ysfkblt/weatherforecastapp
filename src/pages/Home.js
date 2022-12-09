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


const Home = (props) => {
  const [search, setSearch] = useState("")
  const [info, setInfo] = useState({})
  const [grad, setgrad] = useState(null)
  const [zone, setZone] = useState("")
  const [zip, setZip] = useState("")
  const [user, setUser] = useState("")
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
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

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
      className="home-view-container">




      <div className="top-home-page-row">
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
        <div>
          <Search
            handleKeyPress={handleKeyPress}
            handleButtonClick={handleButtonClick}
            onChange={handleSearch}
          />
        </div></div>
      <span className="welcome-user">
        {(user ? (<span>Welcome <Link to="/user">{user.displayName}!</Link></span>) :
          "Welcome!")}
      </span>

      {/* Plant Suggestions */}

      {props.userId ? (
        <PlantSuggestions userId={props.userId} />
      ) : (
        <PlantSuggestions userId={"NA"} />
      )}

    </div>

  )
}

export default Home