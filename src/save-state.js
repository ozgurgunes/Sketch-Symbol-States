import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import * as UI from './ui.js'
import analytics from './analytics.js'

var doc = sketch.getSelectedDocument()
var libraries = sketch.getLibraries()
var selection = doc.selectedLayers

export default function(context) {
  var eventLabel, message
  if (selection.length != 1 || selection.layers[0].type != sketch.Types.SymbolInstance) {
    analytics(context, "error", "selection")
    return UI.message("Please select a symbol instance.")
  } else {
    eventLabel = "save"
    message = " saved."
    var symbol = selection.layers[0]
    var overrides = []
    var states = settings.layerSettingForKey(symbol.master, context.plugin.identifier()) || []
    states.sort((a, b) => a.name - b.name)
    var stateName = saveStateDialog(
      "State Name",
      "Please give a name to symbol state",
      states.map(state => state.name));
    if (stateName) {
      if (states.some(state => state.name == stateName)) {
        var response = UI.createDialog('Are you sure?', 'This will update "' + stateName + '" state.');
        if (response != 1000) {
          analytics(context, "cancel", stateName)
          return false;
        }
        states = states.filter(state => state.name.toString() != stateName.toString())
        eventLabel = "update",
        message = " updated."
      }
      symbol.overrides.map(override => {
        if (override.editable && override.property != "image") {
          var stateOverride = {
            id: override.id,
            property: override.property,
            value: override.value
          }
          overrides.push(stateOverride)
        }
      })
      // TODO: An option to save state to library if this is an imported symbol.
      states.push({
        name: stateName,
        overrides: overrides
      })
      settings.setLayerSettingForKey(symbol.master, context.plugin.identifier(), states)
      analytics(context, eventLabel, stateName)
      return UI.message(stateName + message)
    }
  }
}

function saveStateDialog(msg, info, items) {
  var buttons = ['Save', 'Cancel']
  var accessory = UI.createCombobox(items)
  var response = UI.createDialog(msg, info, accessory, buttons)
  var result = accessory.stringValue()
  if (response === 1000) {
    if (!result.length() > 0) {
      analytics(context, "error", "name")
      return saveStateDialog(msg, info, items)
    }
    return result
  }
}

