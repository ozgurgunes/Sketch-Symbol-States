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
      response = deleteStatesDialog(accessory)
    if (response === 1002) {
      let confirmed = deleteAllDialog()
      if (confirmed === 1000) {
        settings.setLayerSettingForKey(symbol.master,
          context.plugin.identifier(), [])
        analytics("Delete All", states.length)
        return UI.success("All " + states.length + " states deleted.")
      }
    }
    if (response === 1000) {
      console.log(list)
      if (list.getSelection().length == 0) {
        analytics("Delete None")
        return UI.error("Nothing deleted.")
      }
      list.getSelection().reverse().map(item => states.splice(item, 1))
      settings.setLayerSettingForKey(symbol.master, context.plugin.identifier(), states)
      analytics("Delete Selected", list.getSelection().length)
      return UI.success(list.getSelection().length + " states deleted.")
    }
  } catch (e) {
    console.log(e)
    return e
  }
}

const deleteStatesDialog = accessory => {
  let buttons = ['Delete', 'Cancel', 'Delete All'],
    info = "Please select state to be deleted."
  return UI.dialog(info, accessory, buttons)
}


const deleteAllDialog = () => {
  let buttons = ['Delete All', 'Cancel'],
    message = "Are you sure?",
    info = "All symbol states will be deleted!"
  return UI.dialog(info, null, buttons, message)
}
