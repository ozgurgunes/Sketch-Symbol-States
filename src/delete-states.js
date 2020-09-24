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

export default (context) => {
  try {
    let symbol = getSymbol(selection)
    let states
    // Get only deletable states for symbol depend on master's source.
    if (symbol.master.getLibrary()) {
      states = getStatesFromDocument(symbol, true)
      if (states.length < 1) {
        analytics("No States")
        throw UI.dialog("There are not any deletable states.")
      }
    } else {
      states = getStates(symbol, true)
    }
    // Create a selection list of existing states.
    let list = UI.optionList(states.map((state) => state.name))
    let accessory = UI.scrollView(list.view)
    let response = deleteStatesDialog(accessory)
    if (response === 1002) {
      // User clicked to "Delete All".
      // Get a confirmation before deleting all states.
      let confirmed = deleteAllDialog()
      if (confirmed === 1000) {
        // User is sure to delete all states.
        // So, save an empty states data.
        saveSymbolStates(symbol, [])
        analytics("Delete All", states.length)
        return UI.success("All " + states.length + " states deleted.")
      }
    }
    if (response === 1000) {
      if (list.getSelection().length == 0) {
        // User clicked to "Delete" button, without selecting any state.
        analytics("Delete None")
        return UI.error("Nothing deleted.")
      }
      // Remove selected states from states data.
      list
        .getSelection()
        .reverse()
        .map((item) => states.splice(item, 1))
      // Save new states data.
      saveSymbolStates(symbol, states)
      analytics("Delete Selected", list.getSelection().length)
      return UI.success(list.getSelection().length + " states deleted.")
    }
  } catch (e) {
    if (e) {
      // If there were errors, log it and return error.
      console.log(e)
      return e
    }
  }
}

const deleteStatesDialog = (accessory) => {
  let buttons = ["Delete", "Cancel", "Delete All"]
  let info = "Please select stated to be deleted."
  return UI.dialog(info, accessory, buttons)
}

const deleteAllDialog = () => {
  let buttons = ["Delete All", "Cancel"]
  let message = "Are you sure?"
  let info = "All symbol states will be deleted!"
  return UI.dialog(info, null, buttons, message)
}
