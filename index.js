var device
var form
var cnv
var boxes = []

var onCoinHiveSimpleUIReady = function() {
  CoinHive.Miner.on('open', () => showBoxes())
  CoinHive.Miner.on('close', () => hideBoxes())
}

function rInt(max, min=0) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

class canvasPad {
  constructor(_x, _y) {
    this.x = _x
    this.y = _y
    this.lastColor = color(rInt(255),rInt(255),rInt(255))
    this.nextColor = color(rInt(255),rInt(255),rInt(255))
    this.elapsed = 0
    this.width = 50
    this.lerpTime = 3000
  }
  display() {
    this.elapsed += 83
    if (this.elapsed > this.lerpTime) {
      this.elapsed = 0
      this.newColor()
    }
    fill(lerpColor(this.lastColor, this.nextColor, (this.elapsed / this.lerpTime)))
    rect(this.x, this.y, this.width, this.width)


  }
  newColor() {
    this.lastColor = this.nextColor
    this.nextColor = color(rInt(255),rInt(255),rInt(255))
    this.lerpTime = rInt(6000,900)
  }
}

window.onload = function () {
  let connectButton = document.getElementById("connectButton")
  connectButton.addEventListener("onclick", connect())
  form = document.getElementById("userTextForm")
  form.addEventListener("submit", (ev) => {
    passText()
    ev.preventDefault()
  })
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight)
  frameRate(12)
  noStroke()
  noLoop()
  makeBoxes()
}

function draw() {
  for (b in boxes) {
    boxes[b].display()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  makeBoxes()
}

function showBoxes() {
  loop()
}
function hideBoxes() {
  noLoop()
}

function makeBoxes() {
  boxes = []
  for (let x = 10; x < (windowWidth - 30); x += 70) {
    for (let y = 10; y < (windowHeight - 30); y += 70){
      let p = new canvasPad(x,y)
      boxes.push(p)
    }
  }
}

function connect() {
  device = new LaunchpadMKII
  if (device.name === "Launchpad MK2") {
    document.getElementById("connectionStatus").value = `${device.name} connected.`
  } else {
    document.getElementById("connectionStatus").value = "Connection error."
  }
}

function passText() {
  let inputText = document.getElementById('inputText').value
  let color = document.getElementById('colorSelect').value % 128
  let speed = document.getElementById('speed').value
  let loop = document.getElementById('loopText').checked ? 1 : 0

  device.sendText(inputText, color, speed, loop)
}
