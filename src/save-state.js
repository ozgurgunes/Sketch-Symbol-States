import sketch from 'sketch/dom'
import analytics from '@ozgurgunes/sketch-plugin-analytics'
import {
  successMessage,
  errorMessage,
  alert,
  comboBox,
} from '@ozgurgunes/sketch-plugin-ui'
import {
  getSymbols,
  getStates,
  getStatesFromDocument,
  saveSymbolStates,
} from './utils'

var selection = sketch.getSelectedDocument().selectedLayers

function saveState() {
  let symbols = getSymbols(selection)
  if (!symbols) return
  let symbol = symbols[0]
  let states
  // Get only updatable states for symbol depend on master's source.
  if (symbol.master.getLibrary()) {
    states = getStatesFromDocument(symbol, true)
  } else {
    states = getStates(symbol)
  }
  // Get input from user for state name.
  let result = saveStateDialog(states.map(state => state.name))
  if (result && result.name) {
    let stateName = result.name
    if (states.some(state => state.name == stateName)) {
      // User entered an existing state name.
      // Get a confirmation to update state.
      let response = updateStateDialog(stateName)
      if (response != 1000) {
        // User clicked "Cancel" in confirmation dialog.
        // Startover the script.
        return saveState()
      }
      let i = states.findIndex(state => state.name == stateName)
      // Update state with new overrides data.
      states[i].overrides = getSymbolOverrides(symbol, result.defaults)
      // Save updated states.
      saveSymbolStates(symbol, states)
      analytics('Update', 1)
      return successMessage(stateName + ' updated.')
    } else {
      // Add new state to states data.
      states.push({
        name: stateName,
        overrides: getSymbolOverrides(symbol, result.defaults),
      })
      // Save states data with new state.
      saveSymbolStates(symbol, states)
      analytics('Save', 1)
      return successMessage(stateName + ' saved.')
    }
  }
}

export default saveState

function getSymbolOverrides(symbol, defaults) {
  // Prepare overrides data to save as a state.
  let stateOverride
  let overrides = []
  symbol.overrides.map(override => {
    // Ignore uneditable, default and image overrides.
    switch (true) {
      case !override.editable ||
        override.property == 'image' ||
        (override.isDefault && !defaults) ||
        (!override.sketchObject.overrideValue() && !defaults):
        break
      case override.property == 'fillColor' &&
        override.sketchObject.overrideValue() != null:
        stateOverride = {
          id: override.id,
          property: override.property,
          value: getFillColorOverrideValue(override),
        }
        overrides.push(stateOverride)
        break
      case override.property != 'fillColor':
        stateOverride = {
          id: override.id,
          property: override.property,
          value: override.value,
        }
        overrides.push(stateOverride)
        break
    }
  })
  return overrides
}

function getFillColorOverrideValue(override) {
  let color = override.sketchObject.overrideValue()
  if (!color.swatchID()) {
    let red = Math.round(color.red() * 255)
    let green = Math.round(color.green() * 255)
    let blue = Math.round(color.blue() * 255)
    let alpha = color.alpha()
    return 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')'
  }
  return color.swatchID() + '|' + color.CSSAttributeString()
}

function saveStateDialog(items) {
  let buttons = ['Save', 'Cancel']
  let info = 'Please give a name to symbol state.'

  let combobox = comboBox(items)

  let checkbox = NSButton.alloc().initWithFrame(NSMakeRect(0, 32, 240, 25))
  checkbox.setButtonType(NSSwitchButton)
  checkbox.setTitle('Save defaults.')
  checkbox.setState(false)

  let accessory = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 240, 64))
  accessory.addSubview(combobox)
  accessory.addSubview(checkbox)
  accessory.setFlipped(true)

  let dialog = alert(info, buttons, accessory)
  dialog.window().setInitialFirstResponder(combobox)
  let response = dialog.runModal()

  if (response === 1000) {
    if (!combobox.stringValue().length() > 0) {
      // User clicked "OK" without entering a name.
      // Return dialog until user enters a name or clicks "Cancel".
      analytics('No Name')
      errorMessage('Please enter a name for state.')
      return saveStateDialog(items)
    }
    return { name: combobox.stringValue(), defaults: checkbox.state() }
  }
}

function updateStateDialog(stateName) {
  let buttons = ['Update', 'Cancel']
  let message = 'Are you sure?'
  let info = 'This will update "' + stateName + '" state.'
  return alert(info, buttons, null, message).runModal()
}
