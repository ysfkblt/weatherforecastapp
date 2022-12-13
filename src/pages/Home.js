import { useState, useEffect } from "react";
import background, { gradient } from "../components/background";
import { shuffle } from "lodash";
import PlantSuggestions from "../components/PlantSuggestions";
import ToggleDark from "../components/toggleDark";
import { ThemeContext, themes } from "../components/themeContext";
import { db } from "../database/firebase-config";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import logo from "../assets/logos/worm-logo-3.png";

const Home = (props) => {
  const [search, setSearch] = useState("");
  const [info, setInfo] = useState({});
  const [grad, setgrad] = useState(null);
  const [zone, setZone] = useState("");
  const [zip, setZip] = useState("");
  const [user, setUser] = useState(props.user);
  const [userZone, setuserZone] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    async function getDatas() {
      const wormCollection = collection(db, "worms", user.uid, "personal");
      let newData = await getDocs(wormCollection);
      setuserZone(newData.docs[0].data().zone);
    }
    getDatas();
  }, []);

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
      );
  }
  // ZONE API

  const fetchZone = async (search) => {
    const response = await fetch(`https://phzmapi.org/${search}.json`);
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    async function getZone() {
      let zoneResults = await fetchZone(search);
      {
        zoneResults ? setZone(zoneResults) : setZone("");
      }
    }
    getZone();
  }, [search]);

  // SEARCH

  function handleKeyPress(e) {
    if (e.key === "Enter") getData();
  }

  function handleSearch(e) {
    setSearch(e.target.value);
    setZip(e.target.value);
    getData();
  }

  useEffect(() => {
    getData();
  }, [zip]);

  useEffect(() => {
    setgrad(shuffle(gradient).pop());
  }, []);

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
      <header className="top-home-page-row">
        <ThemeContext.Consumer>
          {({ changeTheme }) => (
            <ToggleDark
              toggleDark={() => {
                setDarkMode(!darkMode);
                changeTheme(darkMode ? themes.light : themes.dark);
              }}
            />
          )}
        </ThemeContext.Consumer>

        {/* Search Bar */}

        <span className="welcome-user">
          {user ? (
            <span>
              Welcome to Worm's Eye View{" "}
              <Link to="/user">{user.displayName}!</Link>
            </span>
          ) : (
            <span>Welcome to Worm's Eye View!</span>
          )}
        </span>

        <span className="home-user-account-icon">
          <Link to="/user">
            <i class="fa fa-regular fa-user"> </i>
          </Link>
        </span>
      </header>

      <div className="home-below-header-container-search">
        <section>
          <section className="search-container">
            <div className="logo-container">
              <img src={logo} alt="logo" className="logo" />
            </div>

            <article className="search-input-container">
              <input
                className="search-input"
                type="text"
                spellCheck="false"
                value={search}
                placeholder="please enter zip"
                onChange={handleSearch}
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "please enter zip")}
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
                  <span className="search-results-temp-text-degrees">°f</span>
                </p>
              ) : null}
            </div>

            <div className="search-results-sub-container">
              <p className="search-results-condition-text">{info.condition}</p>
              {info.temp ? (
                <p className="search-results-temp-range">
                  <div className="search-results-temp-range-icon">
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
                  <span className="search-results-temp-range-degrees">°</span>
                </p>
              ) : null}

              <p className="search-results-location">{info.country}</p>
              {zone.zone ? (
                <p className="search-results-zone">
                  Hardiness Zone {zone.zone}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </div>

      {/* Plant Suggestions */}

      {props.userId && zip.length === 5 ? (
        <>
          <PlantSuggestions userId={props.userId} zone={zone.zone} />
        </>
      ) : props.userId ? (
        <>
          <PlantSuggestions userId={props.userId} zone={userZone} />
        </>
      ) : (
        <>
          <PlantSuggestions userId={"NA"} zone={8} />
        </>
      )}
    </div>
  );
};

export default Home;
