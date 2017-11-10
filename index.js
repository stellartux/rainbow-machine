var device
var form
var cnv
var boxes = []

function rInt(max) {return Math.floor(Math.random() * max)}

class canvasPad {
  constructor(_x, _y) {
    this.x = _x
    this.y = _y
    this.color = color(rInt(255),rInt(255),rInt(255))
    this.width = 50
  }
  display() {
    fill(this.color)
    rect(this.x, this.y, this.width, this.width)
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
  makeBoxes()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  makeBoxes()
}

function makeBoxes() {
  boxes = []
  for (let x = 10; x < windowWidth; x += 70) {
    for (let y = 10; y < windowHeight; y += 70){
      let p = new canvasPad(x,y)
      boxes.push(p)
    }
  }
  for (b in boxes) {
    boxes[b].display()
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
