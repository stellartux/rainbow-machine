class LaunchpadMKII {
  constructor() {
    this.name = "Launchpad MK2" // The name of the device as it appears in the menu
    this.manufacturer = [0, 32, 41, 2, 24] // Manufacturer's SysEx header bytes
    this.maxColorValue = 63 // highest per-channel color value
    this.layout = [
      11, 12, 13, 14, 15, 16, 17, 18, 19,
      21, 22, 23, 24, 25, 26, 27, 28, 29,
      31, 32, 33, 34, 35, 36, 37, 38, 39,
      41, 42, 43, 44, 45, 46, 47, 48, 49,
      51, 52, 53, 54, 55, 56, 57, 58, 59,
      61, 62, 63, 64, 65, 66, 67, 68, 69,
      71, 72, 73, 74, 75, 76, 77, 78, 79,
      81, 82, 83, 84, 85, 86, 87, 88, 89,
      104, 105, 106, 107, 108, 109, 110, 111
    ] //
    this.connect()
  }

  connect() {
    WebMidi.enable((err) => {
      if (err) {
        console.log(err)
        return false
      } else {
        this.output = WebMidi.getOutputByName(this.name)
        this.input = WebMidi.getInputByName(this.name)
        /*
        this.input.addListener("noteon", "all", e => this.noteOn(e))
        .addListener("noteoff", "all",  e => this.noteOff(e))
        .addListener("controlchange", "all",  e => {
          e.data[2] === 127 ? this.noteOn(e) : this.noteOff(e)
        })
        */
        this.clear()
        this.test()
      }
    }, true)
}

  sendCommand(cmd) {
    this.output.sendSysex(this.manufacturer, cmd)
  }

  clear() {
    this.stopText()
    this.sendCommand([14,0])
  }

  stopText() {
    this.sendCommand([20])
  }

  sendText(message, color=2, speed=4, loop=false) {
    let parsedText = Array.from(message, letter => letter.charCodeAt(0))
    this.sendCommand([20, color, (loop?1:0), speed].concat(parsedText))
  }

  test(i=56) {
    this.sendText("|", i, 7)
  }

  random() {
    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max))
    }
    for (let j = 0; j < 80; j += 10) {
      let payload = [11]
      for (let i = 0; i < 10; i++) {
        payload.push(this.layout[i+j])
        payload.push(getRandomInt(63))
        payload.push(getRandomInt(63))
        payload.push(getRandomInt(63))
      }
      this.sendCommand(payload)
    }
  }

  noteOn(e) {
      this.sendCommand([11, e.data[1], 63, 63, 63])
  }
  noteOff(e) {
      this.sendCommand([11, e.data[1], 0, 0, 0])
  }
}
