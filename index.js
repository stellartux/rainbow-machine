var device
var form

window.onload = function () {
  let connectButton = document.getElementById("connectButton")
  connectButton.addEventListener("onclick", connect())
  form = document.getElementById("userTextForm")
  form.addEventListener("submit", (ev) => {
    passText()
    ev.preventDefault()
  })
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
