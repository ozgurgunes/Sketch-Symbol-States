import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import * as UI from './ui.js'
import analytics from './analytics.js'

var doc = sketch.getSelectedDocument()
var libraries = sketch.getLibraries()
var selection = doc.selectedLayers

export default function(context) {
  if (selection.length != 1 ||
    selection.layers[0].type != sketch.Types.SymbolInstance) {
    analytics(context, "error", "selection")
    return UI.message("Please select a symbol instance.")
  } else {
    var symbol = selection.layers[0]
    var states = settings
      .layerSettingForKey(symbol.master, context.plugin.identifier()) || []
    if (states.length < 1) {
      analytics(context, "error", "states")
      return UI.dialog("Delete States", "There are not any states.")
    }
    var result = deleteStatesDialog(states
      .sort((a, b) => a.name - b.name)
      .map(state => state.name))
    if (result) {
      result.selection.reverse().map(item => states.splice(item, 1))
      settings.setLayerSettingForKey(symbol.master,
        context.plugin.identifier(), states)
      analytics(context, result.deletion, result.selection.length)
      return UI.message(result.selection.length + " states deleted.")
    }
  }
}

function deleteStatesDialog(items) {
  var buttons = ['Delete', 'Cancel', 'Delete All']
  var message = "Delete States"
  var info = "Please select state to be deleted."
  var accessory = UI.list(items)
  var response = UI.dialog(message, info, accessory[0], buttons)
  var selection = []
  if (response === 1002) {
    var confirmed = deleteAllDialog()
    if (confirmed === 1000) {
      accessory[1].map((state, i) => selection.push(i))
      return {
        deletion: "delete all",
        selection: selection
      }
    }
  }
  if (response === 1000) {
    accessory[1].map((state, i) => {
      if (state.state()) {
        selection.push(i)
      }
    })
    return {
      deletion: "delete",
      selection: selection
    }
  }
}

function deleteAllDialog() {
  var buttons = ['Delete All', 'Cancel']
  var message = "Are you sure?"
  var info = "All symbol states will be deleted!"
  return UI.dialog(message, info, null, buttons)
}
