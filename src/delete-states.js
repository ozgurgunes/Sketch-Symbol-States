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

export default context => {
  try {
    let symbol = getSymbol(selection),
      states = getStates(symbol, true),
      list = UI.optionList(states.map(state => state.name)),
      accessory = UI.scrollView(list.view),
      response = deleteStatesDialog(accessory),
      selected = []
    if (response === 1002) {
      let confirmed = deleteAllDialog()
      if (confirmed === 1000) {
        settings.setLayerSettingForKey(symbol.master,
          context.plugin.identifier(), [])
        analytics("Delete All", states.length)
        return UI.message("All " + states.length + " states deleted.")
      }
    }
    if (response === 1000) {
      list.options.map((state, i) => {
        if (state.state()) {
          selected.push(i)
        }
      })
      if (selected.length == 0) {
        analytics("Delete None")
        return UI.message("Nothing deleted.")
      }
      selected.reverse().map(item => states.splice(item, 1))
      settings.setLayerSettingForKey(symbol.master, context.plugin.identifier(), states)
      analytics("Delete Selected", selected.length)
      return UI.message(selected.length + " states deleted.")
    }
  } catch (e) {
    console.log(e)
    return e
  }
}

const deleteStatesDialog = accessory => {
  let buttons = ['Delete', 'Cancel', 'Delete All'],
    message = "Delete States",
    info = "Please select state to be deleted."
  return UI.dialog(message, info, accessory, buttons)
}


const deleteAllDialog = () => {
  let buttons = ['Delete All', 'Cancel'],
    message = "Are you sure?",
    info = "All symbol states will be deleted!"
  return UI.dialog(message, info, null, buttons)
}
