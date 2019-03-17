import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import * as UI from './ui.js'
import {
  getSymbol,
  getStates,
  analytics
} from './utils.js'

var doc = sketch.getSelectedDocument(),
  libraries = sketch.getLibraries(),
  selection = doc.selectedLayers

const saveState = context => {
  try {
    let symbol = getSymbol(selection),
      states = getStates(symbol),
      stateName = saveStateDialog(states.map(state => state.name))
    if (stateName) {
      if (states.some(state => state.name == stateName)) {
        let response = updateStateDialog(stateName);
        if (response != 1000) {
          return saveState(context);
        }
        let i = states.findIndex(state => state.name == stateName)
        states[i].overrides = getSymbolOverrides(symbol)
        settings.setLayerSettingForKey(symbol.master,
          context.plugin.identifier(), states)
        analytics("Update", true)
        return UI.success(stateName + " updated.")
      } else {
        states.push({
          name: stateName,
          overrides: getSymbolOverrides(symbol)
        })
        settings.setLayerSettingForKey(symbol.master,
          context.plugin.identifier(), states)
        analytics("Save", true)
        return UI.success(stateName + " saved.")
      }
    }
  } catch (e) {
    console.log(e)
    return e
  }
}

export default saveState

const getSymbolOverrides = symbol => {
  let stateOverride, overrides = []
  symbol.overrides.map(override => {
    if (override.editable && override.property != "image") {
      stateOverride = {
        id: override.id,
        property: override.property,
        value: override.value
      }
      overrides.push(stateOverride)
    }
  })
  return overrides
}


const saveStateDialog = items => {
  let buttons = ['Save', 'Cancel'],
    info = "Please give a name to symbol state.",
    accessory = UI.comboBox(items),
    response = UI.dialog(info, accessory, buttons),
    result = accessory.stringValue()
  if (response === 1000) {
    if (!result.length() > 0) {
      return saveStateDialog(items)
    }
    return result
  }
}

const updateStateDialog = stateName => {
  let buttons = ['Update', 'Cancel'],
    message = "Are you sure?",
    info = 'This will update "' + stateName + '" state.'
  return UI.dialog(info, null, buttons, message)
}
