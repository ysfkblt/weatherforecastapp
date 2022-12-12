import React from "react"
import { ReactP5Wrapper } from "react-p5-wrapper"
import gardenPlotSketch from "../components/gardenPlotSketch.js"

function GardenPlotViz() {
  // stuff

  return (
    <div className="page-container">
    <div className="garden-plot-viz-container">
      <div className="garden-plot-viz-container-inside">
      <h1>Garden Planner</h1>
      
        <ReactP5Wrapper sketch={gardenPlotSketch} />
      </div>
    </div>
    </div>
  )
}

export default GardenPlotViz
