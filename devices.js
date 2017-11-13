class GenericMIDIDevice {
  constructor() {
    this.connected = false
  }

  connect() {
    WebMidi.enable((err) => {
      if (err) {
        console.log(err)
        return false
      } else {
        this.output = WebMidi.getOutputByName(this.name)
        this.input = WebMidi.getInputByName(this.name)
        if (this.output && this.input) {
          this.connected = true
          this.flash()
        }
      }
    }, true)
}
  clear() {} // Clear the display
  stopText() {} // Stop any text
  sendText(message, color, speed, loop) {}
  sendCommand() {}
  flash() {}
}

class LaunchpadMKII extends GenericMIDIDevice {
  constructor() {
    super()
    this.name = "Launchpad MK2" // The name of the device as it appears in the menu
    this.manufacturer = [0, 32, 41, 2, 24] // Manufacturer's SysEx header bytes
    this.colorDepth = 8 // per-channel color bitdepth
    this.connect()
  }

  sendCommand(cmd) {
    this.output.sendSysex(this.manufacturer, cmd)
  }

  clear() {
    this.stopText()
    this.sendCommand([14,0])
  }

  parseColor(color) {
    return color
  }

  parseTextColor(color) {
    return color
  }

  sendText(message, color=2, speed=4, loop=false) {
    let parsedText = Array.from(message, letter => letter.charCodeAt(0))
    color = this.parseTextColor(color)
    this.sendCommand([20, color, (loop?1:0), speed].concat(parsedText))
  }

  stopText() {
    this.sendCommand([20])
  }

  flash(i=3) {
    this.sendText("|", i, 7)
  }
}
