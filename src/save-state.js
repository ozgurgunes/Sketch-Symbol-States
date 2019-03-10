import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import * as UI from './ui.js'
import analytics from './analytics.js'

var doc = sketch.getSelectedDocument(),
  libraries = sketch.getLibraries(),
  selection = doc.selectedLayers

const saveState = context => {
  if (selection.length != 1 ||
    selection.layers[0].type != sketch.Types.SymbolInstance) {
    analytics(context, "error", "selection")
    return UI.message("Please select a symbol instance.")
  } else {
    var eventLabel = "save", message = " saved."
    var symbol = selection.layers[0]
    var states = settings
      .layerSettingForKey(symbol.master, context.plugin.identifier()) || []
    states.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase())
    var stateName = saveStateDialog(states.map(state => state.name))
    if (stateName) {
      var stateOverride, overrides = []
      if (states.some(state => state.name == stateName)) {
        var response = updateStateDialog(stateName);
        if (response != 1000) {
          return saveState(context);
        }
        states.splice(states.map(state => state.name).indexOf(stateName),1)
        eventLabel = "update", message = " updated."
      }
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
        // TODO: Option to save state to library if this is an imported symbol.
      states.push({
        name: stateName,
        overrides: overrides
      })
      settings.setLayerSettingForKey(symbol.master,
        context.plugin.identifier(), states)
      analytics(context, eventLabel, stateName)
      return UI.message(stateName + message)
    }
  }
}

export default saveState

const saveStateDialog = items => {
  var buttons = ['Save', 'Cancel']
  var message = context.command.name()
  var info = "Please give a name to symbol state."
  var accessory = UI.combobox(items)
  var response = UI.dialog(message, info, accessory, buttons)
  var result = accessory.stringValue()
  if (response === 1000) {
    if (!result.length() > 0) {
      return saveStateDialog(items)
    }
    return result
  }
}

const updateStateDialog = stateName => {
  var buttons = ['Update', 'Cancel']
  var message = "Are you sure?"
  var info = 'This will update "' + stateName + '" state.'
  return UI.dialog(message, info, null, buttons)
}
