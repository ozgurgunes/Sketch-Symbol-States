import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import * as UI from './ui.js'
import analytics from './analytics.js'

var doc = sketch.getSelectedDocument()
var libraries = sketch.getLibraries()
var selection = doc.selectedLayers

export default function(context) {
  if (selection.length != 1 || selection.layers[0].type != sketch.Types.SymbolInstance) {
    analytics(context, "error", "selection")
    return UI.message("Please select a symbol instance.")
  } else {
    var symbol = selection.layers[0]
    var states = settings.layerSettingForKey(symbol.master, context.plugin.identifier()) || []
    states.sort((a, b) => a.name - b.name)
    if (states.length < 1) {
      analytics(context, "error", "no state")
      return UI.createDialog("Delete States", "There are not any states.")
    }
    var result = UI.createList(
      "Delete States",
      "Please select state to be deleted.",
      states.map(state => state.name));
    if (result) {
      result.selection.reverse().map(item => {
        states.splice(item, 1)
      })
      settings.setLayerSettingForKey(symbol.master, context.plugin.identifier(), states)
      analytics(context, result.deletion, result.selection.length)
      return UI.message(result.selection.length + " states deleted.")
    }
  }
}
