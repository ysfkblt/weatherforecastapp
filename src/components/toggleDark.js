import React from "react";

//If you want to want to use toggleDark to change the css of a component, here is how you do that: First you need to import the ThemeContext from themeContext.js. Then you need to wrap the component in the ThemeContext.Consumer. Then you need to pass the theme to the component as a prop. Then you need to use the theme to change the css of the component.

export default function ToggleDark(props) {
  return (
    <div className="toggle-dark-wrapper">
      <div className="wrapper">
        <label className="switch">
          <input
            type="checkbox"
            id="checkbox-toggle"
            onClick={() => {
              props.toggleDark();
            }}
          />
          <span className="slider"></span>
          <span className="wave"> </span>
          {/* <div className="boat">
                        <div className="bottom"></div>
                        <div className="mast"></div>
                        <div className="rectangle-sm"></div>
                        <div className="rectangle-lg"></div>
                    </div> */}
          <div className="sky">
            <div className="sun">
              <div className="outer"></div>
              <div className="inner"></div>
            </div>
            <div className="cloud cloud1">
              <div className="rect"></div>
              <div className="circle circle-lg"></div>
              <div className="circle circle-sm"></div>
            </div>
            <div className="cloud cloud2">
              <div className="rect"></div>
              <div className="circle circle-lg"></div>
              <div className="circle circle-sm"></div>
            </div>
          </div>
        </label>
      </div>

      <svg viewBox="0 0 180 100" width="100%">
        <filter width="100%" height="100%" x="0%" y="0%" id="wave">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.000001"
            id="turbulence"
            numOctaves="1"
            result="turbulence"
          >
            <animate
              id="noiseAnimate"
              attributeName="baseFrequency"
              values="0.095,0.000001;0.025,0.2;"
              dur="1.4s"
              repeatCount="indefinite"
            ></animate>
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="warpOffset"
            scale="6"
            dy="100px"
            xChannelSelector="R"
            yChannelSelector="G"
          ></feDisplacementMap>
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </svg>
    </div>
  );
}
