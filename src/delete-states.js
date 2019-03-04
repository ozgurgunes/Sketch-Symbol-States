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
      states = settings.layerSettingForKey(symbol.master, defaults.PLUGIN_KEY) || []
    states.sort((a, b) => a.name - b.name)
    if (states.length < 1) {
      return UI.createDialog("Delete States", "There are not any states.")
    }
    var result = UI.createList(
      "Delete States",
      "Please select state to be deleted.",
      states.map(state => state.name));
    if (result) {
      if (result.length == states.length) {
        settings.setLayerSettingForKey(symbol.master, defaults.PLUGIN_KEY, [])
        sendEvent(context, 'Delete States', "delete all", result.length)
        UI.message("All states deleted.")
      } else {
        result.reverse().forEach(item => {
          states.splice(item, 1)
        })
        settings.setLayerSettingForKey(symbol.master, defaults.PLUGIN_KEY, states)
        analytics(context, 'Delete States', "delete", result.length)
        UI.message(result.length + " states deleted.")
      }
    }
  }
}
