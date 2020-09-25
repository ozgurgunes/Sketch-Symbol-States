import sketch from "sketch/dom"
import * as UI from "./ui"
import analytics from "./analytics"
import {
  getSymbol,
  getStates,
  getStatesFromDocument,
  saveSymbolStates,
} from "./utils"

var doc = sketch.getSelectedDocument()
var selection = doc.selectedLayers

const saveState = (context) => {
  try {
    let symbol = getSymbol(selection)
    let states
    // Get only updatable states for symbol depend on master's source.
    if (symbol.master.getLibrary()) {
      states = getStatesFromDocument(symbol, true)
    } else {
      states = getStates(symbol)
    }
    // Get input from user for state name.
    let stateName = saveStateDialog(states.map((state) => state.name))
    if (stateName) {
      if (states.some((state) => state.name == stateName)) {
        // User entered an existing state name.
        // Get a confirmation to update state.
        let response = updateStateDialog(stateName)
        if (response != 1000) {
          // User clicked "Cancel" in confirmation dialog.
          // Startover the script.
          return saveState(context)
        }
        let i = states.findIndex((state) => state.name == stateName)
        // Update state with new overrides data.
        states[i].overrides = getSymbolOverrides(symbol)
        // Save updated states.
        saveSymbolStates(symbol, states)
        analytics("Update", 1)
        return UI.success(stateName + " updated.")
      } else {
        // Add new state to states data.
        states.push({
          name: stateName,
          overrides: getSymbolOverrides(symbol),
        })
        // Save states data with new state.
        saveSymbolStates(symbol, states)
        analytics("Save", 1)
        return UI.success(stateName + " saved.")
      }
    }
  } catch (e) {
    if (e) {
      // If there were errors, log it and return error.
      console.log(e)
      return e
    }
  }
}

export default saveState

const getSymbolOverrides = (symbol) => {
  // Prepare overrides data to save as a state.
  let stateOverride
  let overrides = []
  symbol.overrides.map((override) => {
    // Ignore uneditable, default and image overrides.
    switch (true) {
      case !override.editable ||
        override.isDefault ||
        override.property == "image":
        break
      case override.property == "fillColor" &&
        override.sketchObject.overrideValue() != null:
        stateOverride = {
          id: override.id,
          property: override.property,
          value: getFillColorOverrideValue(override),
        }
        overrides.push(stateOverride)
        break
      case override.property != "fillColor":
        stateOverride = {
          id: override.id,
          property: override.property,
          value: override.value,
        }
        overrides.push(stateOverride)
        break
    }
  })
  console.log(overrides)
  return overrides
}

const getFillColorOverrideValue = (override) => {
  let color = override.sketchObject.overrideValue()
  if (!color.swatchID()) {
    let red = Math.round(color.red() * 255)
    let green = Math.round(color.green() * 255)
    let blue = Math.round(color.blue() * 255)
    let alpha = color.alpha()
    return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")"
  }
  return color.swatchID() + "|" + color.CSSAttributeString()
}

const saveStateDialog = (items) => {
  let buttons = ["Save", "Cancel"]
  let info = "Please give a name to symbol state."
  let accessory = UI.comboBox(items)
  let response = UI.dialog(info, accessory, buttons)
  let result = accessory.stringValue()
  if (response === 1000) {
    if (!result.length() > 0) {
      // User clicked "OK" without entering a name.
      // Return dialog until user enters a name or clicks "Cancel".
      analytics("No Name")
      UI.error("Please enter a name for state.")
      return saveStateDialog(items)
    }
    return result
  }
}

const updateStateDialog = (stateName) => {
  let buttons = ["Update", "Cancel"]
  let message = "Are you sure?"
  let info = 'This will update "' + stateName + '" state.'
  return UI.dialog(info, null, buttons, message)
}
