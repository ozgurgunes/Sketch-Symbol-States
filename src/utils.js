import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import analytics from './analytics'
import * as UI from './ui'

export const getSymbol = selection => {
  if (selection.length != 1 ||
    selection.layers[0].type != sketch.Types.SymbolInstance) {
    analytics('Selection Error')
    throw UI.error('Please select a symbol instance.')
  } else {
    return selection.layers[0]
  }
}

export const getStates = (symbol, error) => {
  let states = settings
    .layerSettingForKey(symbol.master, context.plugin.identifier()) || []
  if (symbol.master.getLibrary()) {
    states = states.map(state => {
      state.name = state.name + ' *'
      return state
    }).concat(getStatesFromDocument(symbol))
  }
  if (error && states.length < 1) {
    analytics('No States')
    throw UI.dialog('There are not any states.')
  }
  return states.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase())
}

export const getStatesFromDocument = (symbol, sort) => {
  let doc = sketch.getSelectedDocument()
  let identifier = context.plugin.identifier() + ':' + symbol.symbolId
  let states = settings.documentSettingForKey(doc, identifier) || []
  if (sort) {
    states.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase())
  }
  return states
}

export const saveSymbolStates = (symbol, states) => {
  if (symbol.master.getLibrary()) {
    let doc = sketch.getSelectedDocument()
    let identifier = context.plugin.identifier() + ':' + symbol.symbolId
    settings.setDocumentSettingForKey(doc, identifier, states)
  } else {
    settings.setLayerSettingForKey(symbol.master,
      context.plugin.identifier(), states)
  }
}
