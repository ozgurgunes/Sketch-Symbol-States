import sketch from 'sketch/dom'
import analytics from '@ozgurgunes/sketch-plugin-analytics'
import {
  successMessage,
  errorMessage,
  alert,
  optionList,
  scrollView,
} from '@ozgurgunes/sketch-plugin-ui'
import {
  getSymbols,
  getStates,
  getStatesFromDocument,
  saveSymbolStates,
} from './utils'

var selection = sketch.getSelectedDocument().selectedLayers

export default function () {
  let symbols = getSymbols(selection)
  if (!symbols) return
  let symbol = symbols[0]
  let states
  // Get only deletable states for symbol depend on master's source.
  if (symbol.master.getLibrary()) {
    states = getStatesFromDocument(symbol, true)
    if (states.length < 1) {
      analytics('No States')
      return alert('There are not any deletable states.').runModal()
    }
  } else {
    states = getStates(symbol, true)
  }
  if (!states) return
  // Create a selection list of existing states.
  let list = optionList(states.map(state => state.name))
  let accessory = scrollView(list.view)
  let response = deleteStatesDialog(accessory)
  if (response === 1002) {
    // User clicked to "Delete All".
    // Get a confirmation before deleting all states.
    let confirmed = deleteAllDialog()
    if (confirmed === 1000) {
      // User is sure to delete all states.
      // So, save an empty states data.
      saveSymbolStates(symbol, [])
      analytics('Delete All', states.length)
      return successMessage('All ' + states.length + ' states deleted.')
    }
  }
  if (response === 1000) {
    if (list.getSelection().length == 0) {
      // User clicked to "Delete" button, without selecting any state.
      analytics('Delete None')
      return errorMessage('Nothing deleted.')
    }
    // Remove selected states from states data.
    list
      .getSelection()
      .reverse()
      .map(item => states.splice(item, 1))
    // Save new states data.
    saveSymbolStates(symbol, states)
    analytics('Delete Selected', list.getSelection().length)
    return successMessage(list.getSelection().length + ' states deleted.')
  }
}

function deleteStatesDialog(accessory) {
  let buttons = ['Delete', 'Cancel', 'Delete All']
  let info = 'Please select stated to be deleted.'
  return alert(info, buttons, accessory).runModal()
}

function deleteAllDialog() {
  let buttons = ['Delete All', 'Cancel']
  let message = 'Are you sure?'
  let info = 'All symbol states will be deleted!'
  return alert(info, buttons, null, message).runModal()
}
