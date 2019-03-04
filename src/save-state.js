import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import * as UI from './ui.js'
import * as defaults from './defaults.js'
import analytics from './analytics.js'

var doc = sketch.getSelectedDocument(),
  libraries = sketch.getLibraries(),
  selection = doc.selectedLayers

export default function(context) {
  if (selection.length != 1 || selection.layers[0].type != sketch.Types.SymbolInstance) {
    UI.message("Please select a symbol instance.")
  } else {
    var symbol = selection.layers[0],
      action = "save",
      message = " saved.",
      overrides = [],
      states = settings.layerSettingForKey(symbol.master, defaults.PLUGIN_KEY) || []
    states.sort((a, b) => a.name - b.name)
    var stateName = UI.createCombobox(
      "State Name",
      "Please give a name to symbol state",
      states.map(state => state.name));
    if (stateName) {
      if (states.some(state => state.name == stateName)) {
        var response = UI.createDialog('Are you sure?', 'This will update "' + stateName + '" state.');
        if (response != 1000) {
          return false;
        }
        states = states.filter(state => state.name.toString() != stateName.toString())
        action = "update",
        message = " updated."
      }
      symbol.overrides.forEach(override => {
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
      settings.setLayerSettingForKey(symbol.master, defaults.PLUGIN_KEY, states)
      analytics(context, "Save State", action, stateName)
      UI.message(stateName + message)
    }
  }
}
