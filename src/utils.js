import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import { error, dialog } from '@ozgurgunes/sketch-plugin-ui'
import analytics from '@ozgurgunes/sketch-plugin-analytics'

export function getSymbol(selection) {
  if (
    selection.length != 1 ||
    selection.layers[0].type != sketch.Types.SymbolInstance
  ) {
    analytics('Selection Error')
    throw error('Please select a symbol instance.')
  } else {
    return selection.layers[0]
  }
}

export function getStates(symbol, error) {
  let states =
    settings.layerSettingForKey(symbol.master, context.plugin.identifier()) ||
    []
  if (symbol.master.getLibrary()) {
    states = states
      .map(state => {
        state.name = state.name + ' *'
        return state
      })
      .concat(getStatesFromDocument(symbol))
  }
  if (error && states.length < 1) {
    analytics('No States')
    throw dialog('There are not any states.')
  }
  return states.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase())
}

export function getStatesFromDocument(symbol, sort) {
  let doc = sketch.getSelectedDocument()
  let identifier = context.plugin.identifier() + ':' + symbol.symbolId
  let states = settings.documentSettingForKey(doc, identifier) || []
  if (sort) {
    states.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase())
  }
  return states
}

export function saveSymbolStates(symbol, states) {
  if (symbol.master.getLibrary()) {
    let doc = sketch.getSelectedDocument()
    let identifier = context.plugin.identifier() + ':' + symbol.symbolId
    settings.setDocumentSettingForKey(doc, identifier, states)
  } else {
    settings.setLayerSettingForKey(
      symbol.master,
      context.plugin.identifier(),
      states
    )
  }
}

export function errorList(items) {
  let listView = NSView.alloc().initWithFrame(
    NSMakeRect(0, 0, 300, items.length * 24 + 10)
  )
  let font = NSFont.systemFontOfSize(NSFont.smallSystemFontSize())
  let errors = []
  items.map((item, i) => {
    errors[i] = NSTextView.alloc().initWithFrame(
      NSMakeRect(5, 10 + i * 24, 290, 20)
    )
    errors[i].insertText(item)
    errors[i].setFont(font)
    errors[i].setEditable(false)
    listView.addSubview(errors[i])
  })
  listView.setFlipped(true)
  return listView
}
