const device = new LaunchpadMKII
let boxes = []
let realBoxes = []
let form
let animateBackground = true
let vegas = false

function toggleBg() {
  animateBackground = !animateBackground
  if (animateBackground) {
    loop()
  } else {
    noLoop()
  }
}

function toggleVegas() {
    vegas = !vegas
    device.clear()
}

////////////////////////////////////////////////////////////////////////////////
// main launchpad communication functionality
window.onload = function () {
  form = document.getElementById("userTextForm")
  form.addEventListener("submit", (ev) => {
    passText()
    ev.preventDefault()
  })
}

function passText() {
  let inputText = document.getElementById('inputText').value
  let color = document.getElementById('colorSelect').value % 128
  let speed = document.getElementById('speed').value
  let loop = document.getElementById('loopText').checked ? 1 : 0

  device.sendText(inputText, color, speed, loop)
}

////////////////////////////////////////////////////////////////////////////////
// helper functions for random output
function rInt(max, min=0) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

function rColor() {
  return color(rInt(255),rInt(255),rInt(255))
}

////////////////////////////////////////////////////////////////////////////////
// draw a colorful background canvas
class canvasPad {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.lastColor = rColor()
    this.nextColor = rColor()
    this.elapsed = 0
    this.width = 50
    this.lerpTime = 3000
  }
  render(delta) {
    if (this.elapsed > this.lerpTime) {
      this.elapsed = 0
      this.newColor()
    }
    fill(lerpColor(this.lastColor, this.nextColor, (this.elapsed / this.lerpTime)))
    rect(this.x, this.y, this.width, this.width)
    this.elapsed += delta
  }
  newColor() {
    this.lastColor = this.nextColor
    this.nextColor = rColor()
    this.lerpTime = rInt(6000,900)
  }
}

// Equivalent code for generating color boxes for the pads on the LPMKII
class realPad extends canvasPad {
  constructor(a) {
    super(0, 0)
    this.address = a
    this.lerpTime = 100
  }

  render(delta) {
    if (this.elapsed > this.lerpTime) {
      this.elapsed = 0
      this.newColor()
    }
    let lc = lerpColor(this.lastColor, this.nextColor, (this.elapsed / this.lerpTime))
    let payload = [11, this.address]
    payload.push(floor(red(lc)/8))
    payload.push(floor(green(lc)/8))
    payload.push(floor(blue(lc)/8))
    device.sendCommand(payload)
    this.elapsed += delta
  }
  newColor() {
    this.lastColor = this.nextColor
    this.nextColor = rColor()
    this.lerpTime = rInt(4000,125)
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  frameRate(12)
  noStroke()
  makeBoxes()
  for (let a of device.layout) {
    let p = new realPad(a)
    realBoxes.push(p)
  }
}

function draw() {
  let delta = 1000 / frameRate()
  for (b of boxes) {
    b.render(delta)
  }
  if (vegas) {
    for (let r of realBoxes) {
      r.render(delta)
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  makeBoxes()
}

function makeBoxes() {
  boxes = []
  for (let x = 10; x < (windowWidth - 30); x += 70) {
    for (let y = 10; y < (windowHeight - 30); y += 70){
      let p = new canvasPad(x, y)
      boxes.push(p)
    }
  }
}
