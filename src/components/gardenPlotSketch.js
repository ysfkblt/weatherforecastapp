// todo figure out how to import/get props in order to work with the data in this sketch

// ============ CONTROL VARIABLES HERE ===========
// ============ CONTROL VARIABLES HERE ===========
// ============ CONTROL VARIABLES HERE ===========

// **** OBJECT ****
let objArr = []
let objCount = 0
const objSizeX = 50
const objSizeY = 50

// **** ACTUAL PLOT DETAILS ****
const actualPlotLength = 4 //ft
const actualPlotWidth = 8 //ft
const gridSpacingRule = 1 //ft how far apart plants should be

const plotDimensionConversionConstant = 80 // 1 ft = 100 px

// **** PLOT ****
const plotLength = actualPlotLength * plotDimensionConversionConstant
const plotWidth = actualPlotWidth * plotDimensionConversionConstant
const plotSoilColor_R = 150
const plotSoilColor_G = 90
const plotSoilColor_B = 0

// **** GRID ****
const gridSpacing = gridSpacingRule * plotDimensionConversionConstant
const plotColumns = plotLength / gridSpacing
const plotRows = plotWidth / gridSpacing

// SHAPES
let shapeSpawnLocationX = 50
let shapeSpawnLocationY = 50

// UI Button
let createPlantButtonX = 100
let createPlantButtonY = plotWidth + 100

// ============ CONTROL VARIABLES END ===========
// ============ CONTROL VARIABLES END ===========

function gardenPlotSketch(p) {
  let shape1
  let shape2
  let shape3

  p.setup = function () {
    p.createCanvas(plotLength, plotWidth)

    // add plant button
    p.button = p.createButton("add plant")
    p.button.position(createPlantButtonX, createPlantButtonY)
    p.button.mousePressed(p.handleAddPlant)
  }

  p.handleAddPlant = function () {
    console.log("clicked add button")
    console.log(objArr)
    objCount++
    let tempAddObj = new Draggable(
      shapeSpawnLocationX,
      shapeSpawnLocationY,
      objSizeX,
      objSizeY,
      objCount
    )
    objArr.push(tempAddObj)
    console.log(objArr)
  }

  p.draw = function () {
    // clear out old frames
    p.background(plotSoilColor_R, plotSoilColor_G, plotSoilColor_B)
    for (let x = 0; x < p.width; x += p.width / plotColumns) {
      for (let y = 0; y < p.height; y += p.height / plotRows) {
        p.stroke(0)
        p.strokeWeight(1)
        p.line(x, 0, x, p.height)
        p.line(0, y, p.width, y)
      }
    }

    objArr.forEach((curElem) => {
      curElem.over()
      curElem.update()
      curElem.show()
    })

    console.log("hi")
  }

  p.mousePressed = function () {
    objArr.forEach((curElem) => {
      curElem.pressed()
    })
  }

  p.mouseReleased = function () {
    objArr.forEach((curElem) => {
      curElem.released()
    })
  }

  class Draggable {
    constructor(x, y, w, h, id) {
      this.dragging = false // Is the object being dragged?
      this.rollover = false // Is the mouse over the ellipse?
      this.x = x
      this.y = y
      this.w = w
      this.h = h
      this.offsetX = 0
      this.offsetY = 0
      this.id = id
    }

    over() {
      // Is mouse over object
      if (
        p.mouseX > this.x &&
        p.mouseX < this.x + this.w &&
        p.mouseY > this.y &&
        p.mouseY < this.y + this.h
      ) {
        this.rollover = true
      } else {
        this.rollover = false
      }
    }

    update() {
      // Adjust location if being dragged
      if (this.dragging) {
        this.x = p.mouseX + this.offsetX
        this.y = p.mouseY + this.offsetY
      }
    }

    show() {
      p.stroke(0)
      // Different fill based on state
      if (this.dragging) {
        p.fill(50)
      } else if (this.rollover) {
        p.fill(100)
      } else {
        p.fill(175, 200)
      }
      p.rect(this.x, this.y, this.w, this.h)
    }

    pressed() {
      // Did I click on the rectangle?
      if (
        p.mouseX > this.x &&
        p.mouseX < this.x + this.w &&
        p.mouseY > this.y &&
        p.mouseY < this.y + this.h
      ) {
        this.dragging = true
        // If so, keep track of relative location of click to corner of rectangle
        this.offsetX = this.x - p.mouseX
        this.offsetY = this.y - p.mouseY
      }
    }

    released() {
      // Quit dragging
      this.dragging = false
    }
  }
}

export default gardenPlotSketch
