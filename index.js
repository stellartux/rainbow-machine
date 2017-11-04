
let device

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
  let loop = document.getElementById('loopText').checked ? 1 : 0
  let speed = document.getElementById('speed').value

  device.sendText(inputText, color, speed, loop)
}
