import React from 'react';


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
                    <span className="slider">
                        <div className="fish">
                            <div className="body"></div>
                            <div className="eye"></div>
                            <div className="tail"></div>
                        </div>
                    </span>
                    <span className="wave"> </span>
                    <div className="boat">
                        <div className="bottom"></div>
                        <div className="mast"></div>
                        <div className="rectangle-sm"></div>
                        <div className="rectangle-lg"></div>
                    </div>
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
