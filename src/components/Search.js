// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { auth } from "../database/firebase-config";

// const Search = () => {
//   const [user, setUser] = useState("");
//   const [search, setSearch] = useState("");
//   const [info, setInfo] = useState({});
//   const [grad, setgrad] = useState(null);
//   const [zone, setZone] = useState("");
//   const [zip, setZip] = useState("");

  

//   const handleButtonClick = () => {
//     fetch(
//       `https://api.weatherapi.com/v1/forecast.json?key=f676e0d30686474d99b160351221104&q=${search}&days=1&aqi=no&alerts=no`
//     )
//       .then((r) => r.json())
//       .then((d) =>
//         setInfo({
//           name: d.location.name,
//           country: d.location.country,
//           condition: d.current.condition.text,
//           temp: {
//             current: d.current.temp_c,
//             max: d.forecast.forecastday[0].day.maxtemp_c,
//             min: d.forecast.forecastday[0].day.mintemp_c,
//           },
//         })
//       );
//   };



//   // ZONE API

//   // const fetchZone = async (search) => {
//   //   const response = await fetch(`https://phzmapi.org/${search}.json`);
//   //   const data = await response.json();
//   //   return data;
//   // };



//   // useEffect(() => {
//   //   onAuthStateChanged(auth, (currentUser) => {
//   //     setUser(currentUser);
//   //   });
//   // }, []);

//   // useEffect(() => {
//   //   async function getZone() {
//   //     let zoneResults = await fetchZone(search)
//   //     {
//   //       zoneResults ? setZone(zoneResults) : setZone("")
//   //     }
//   //   }
//   //   getZone()
//   // }, [search])


//   // const logout = async () => {
//   //   await signOut(auth);
//   // };

//   return (
//     <>


//       <section className="search-container">
//         <article className="search-input-container">
//           <input
//             className="search-input"
//             type="text"
//             spellCheck="false"
//             value={search}
//             placeholder="please enter zip"
//             onChange={handleSearch}
//             onFocus={(e) => (e.target.placeholder = "")}
//             onBlur={(e) => (e.target.placeholder = "please enter location")}
//             onKeyPress={handleKeyPress}
//           />
//         </article>

//         <article className="search-icon-container">
//           <button className="search-icon" onClick={handleButtonClick}>
//             <i className="fa fa-search fa-2x" aria-hidden="true"></i>
//           </button>
//         </article>
//       </section>

//       {/* Hidden info display, reveals after search button click */}

//       <div className="search-results-container">
//         <div className="search-results-temp">
//           {info.temp ? (
//             <p className="search-results-temp-text">
//               {info.temp?.current}
//               <span className="search-results-temp-text-degrees">
//                 °f
//               </span>

//             </p>
//           ) : null}
//         </div>


//         <div className="search-results-sub-container">
//           <p className="search-results-condition-text">
//             {info.condition}
//           </p>
//           {info.temp ? (
//             <p className="search-results-temp-range">

//               <div className="search-results-temp-range-icon" >
//                 <i className="fa fa-arrow-up" aria-hidden="true"></i>
//               </div>
//               {info.temp?.max}

//               <span className="search-results-temp-range-degrees">
//                 °
//               </span>{" "}
//               <div className="search-results-temp-range-icon">
//                 <i class="fa fa-arrow-down" aria-hidden="true"></i>
//               </div>

//               {info.temp?.min}

//               <span className="search-results-temp-range-degrees">
//                 °
//               </span>
//             </p>
//           ) : null}

//           <p className="search-results-location">
//             {info.country}
//           </p>
//           {zone.zone ? <p className="search-results-zone">
//             Hardiness Zone {zone.zone}</p> : null}
//         </div>
//       </div>

//     </>
//   );
// };

// export default Search;


