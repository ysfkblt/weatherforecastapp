import { useState, useEffect } from 'react';
import {SearchIcon,ArrowDownIcon,ArrowUpIcon,} from '@heroicons/react/outline';
import background, { gradient } from './background';
import { shuffle } from 'lodash';
import UpdateZipCode from './LocationUpdate';
import PlantSuggestions from "./PlantSuggestions";
import ToggleDark from './toggleDark';
import { ThemeContext, themes } from './themeContext';



export default function App(props) {
  const [search, setSearch] = useState('');
  const [info, setInfo] = useState({});
  const [grad, setgrad] = useState(null);
  const [zone, setZone] = useState('')
  const [zip, setZip] = useState('')
  const [userId, setUserId] = useState('')
  const [darkMode, setDarkMode] = useState(true);

  console.log(props.userId)

  // WEATHER API

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
          }
        })
      );
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
        zoneResults ? (
          setZone(zoneResults)
        ) : setZone("")
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
    getData();
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') handleButtonClick();
  }

  function handleSearch(e) {
    setSearch(e.target.value);
    setZip(e.target.value);
    handleButtonClick();
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setgrad(shuffle(gradient).pop());
  }, []);

  return (

    <div // Dynamic background from boilerplate 
      className='home-view-container'
      style={
        info.condition?.toLowerCase() === 'clear'
          ? { backgroundImage: background.clear }
          : info.condition?.toLowerCase() === 'sunny'
            ? { backgroundImage: background.sunny }
            : info.condition?.toLowerCase().includes('cloudy')
              ? { backgroundImage: background.cloudy }
              : info.condition?.toLowerCase().includes('rain') ||
                info.condition?.toLowerCase().includes('drizzle')
                ? { backgroundImage: background.rainy }
                : info.condition?.toLowerCase().includes('snow') ||
                  info.condition?.toLowerCase().includes('sleet')
                  ? { backgroundImage: background.snow }
                  : info.condition?.toLowerCase().includes('overcast')
                    ? { backgroundImage: background.overcast }
                    : { backgroundImage: grad }
      }>

      {/* DARKMODE */}
      <header className="header-container">
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
      </header>

      {/* Update user */}
      {userId && zip.length === 5 && zone ?
        <>
          <UpdateZipCode
            userId={userId}
            zip={zip}
            zone={zone.zone}
            coordinates={zone.coordinates}
          />
        </>
        : null
      }

      {/* Search Bar */}
      <div className='search-container'>
        <input
          className='search-input'
          type='text'
          spellCheck='false'
          value={search}
          placeholder='enter zip code'
          onChange={handleSearch}
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) =>
            (e.target.placeholder = 'please enter location')
          }
          onKeyPress={handleKeyPress}
        />

        {/* Previous Tailwind css: self-end mb-1 */}
        <div className=''>
          <SearchIcon
            className=''
            onClick={handleButtonClick}
          />
        </div>
      </div>

      {/* Hidden info display, reveals after search button click */}
      <div className=''>
        <div className=''>
          {info.temp ? (
            <p className=''>
              {info.temp?.current}
              <span className=' '>
                °
              </span>
            </p>
          ) : null}
        </div>
        <div className=''>
          <p className=' '>
            {info.condition}
          </p>
          {info.temp ? (
            <p className=''>
              <ArrowUpIcon className='s' />
              {info.temp?.max}
              <span className=''>
                °
              </span>{' '}
              <ArrowDownIcon className='' />
              {info.temp?.min}
              <span className=''>
                °
              </span>
            </p>
          ) : null}

          <p className=''>
            {info.country}
          </p>
          {zone.zone ? (
            <p className=''>
              Hardiness Zone {zone.zone}
            </p>
          ) : null}
        </div>


        {props.userId ?

          <PlantSuggestions userId={props.userId} /> :
          <PlantSuggestions userId={"NA"} />
        }

      </div>

    </div>
  );
}
