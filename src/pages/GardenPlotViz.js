import React from "react"
import { ReactP5Wrapper } from "react-p5-wrapper"
import gardenPlotSketch from "../components/gardenPlotSketch.js"

function GardenPlotViz() {
  // stuff

  return (
    <div className="garden-plot-viz-container">
      <h1>Garden Planner</h1>
      
        <ReactP5Wrapper sketch={gardenPlotSketch} />
    
    </div>
  )
}

export default GardenPlotViz
