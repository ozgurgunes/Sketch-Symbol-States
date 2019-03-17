import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import send from 'sketch-module-google-analytics'
import * as UI from './ui.js'

export const getSymbol = selection => {
  if (selection.length != 1 ||
    selection.layers[0].type != sketch.Types.SymbolInstance) {
    analytics("Selection Error")
    throw UI.error("Please select a symbol instance.")
  } else {
    return selection.layers[0]
  }
}

export const getStates = (symbol, error) => {
  let states = settings
    .layerSettingForKey(symbol.master, context.plugin.identifier()) || []
  if (error && states.length < 1) {
    analytics("No States")
    throw UI.dialog("There are not any states.")
  }
  return states.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase())
}

export const getValueForOverride = (doc, symbol, override) => {
  let value
  switch (true) {
    case (override.property == "symbolID"):
      value = getValueForSymbolOverride(doc, symbol, override)
      break;
    case (override.property == "textStyle"):
      value = getValueForTextStyleOverride(doc, symbol, override)
      break;
    case (override.property == "layerStyle"):
      value = getValueForLayerStyleOverride(doc, symbol, override)
      break;
  }
  return (value) ? value : override.value
}

export const analytics = (label, value) => {
  const ID = "UA-5738625-2"
  const payload = {}
  payload.ec = context.plugin.name()
  payload.ea = context.command.name()
  if (label) {
    payload.el = label
  }
  if (value) {
    payload.ev = value
  }
  return send(context, ID, 'event', payload)
}

const getValueForSymbolOverride = (doc, symbol, override) => {
  let master = doc.getSymbolMasterWithID(override.value)
  if (master) {
    return master.symbolId
  } else {
    let library = symbol.master.getLibrary()
    if (library) {
      let importable = library.getImportableSymbolReferencesForDocument(doc)
        .find(importable => importable.id == override.value)
      if (importable) {
        return importable.import().symbolId
      } else {
        master = library.getDocument().getSymbols()
          .find(master => master.symbolId == override.value)
        if (master) {
          if (master.getLibrary()) {
            importable = master.getLibrary()
              .getImportableSymbolReferencesForDocument(doc)
              .find(importable => importable.name == master.name)
          } else {
            importable = library.getImportableSymbolReferencesForDocument(doc)
              .find(importable => importable.name == master.name)
          }
          if (importable) {
            return importable.import().symbolId
          }
        }
      }
    }
  }
}

const getValueForTextStyleOverride = (doc, symbol, override) => {
  let id = getStyleID(override.value),
    textStyle = doc.getSharedTextStyleWithID(override.value) ||
    doc.getSharedTextStyleWithID(id)
  if (textStyle) {
    return textStyle.id
  } else {
    let library = symbol.master.getLibrary()
    if (library) {
      let importable = library
        .getImportableTextStyleReferencesForDocument(doc)
        .find(importable => importable.id.includes(id))
      if (importable) {
        return importable.import().id
      } else {
        textStyle = library.getDocument().sharedTextStyles
          .find(style => style.id.includes(id))
        if (textStyle) {
          if (textStyle.getLibrary()) {
            importable = textStyle.getLibrary()
              .getImportableTextStyleReferencesForDocument(doc)
              .find(importable => importable.name == textStyle.name)
          } else {
            importable = library
              .getImportableTextStyleReferencesForDocument(doc)
              .find(importable => importable.name == textStyle.name)
          }
          if (importable) {
            return importable.import().id
          }
        }
      }
    }
  }
}

const getValueForLayerStyleOverride = (doc, symbol, override) => {
  let id = getStyleID(override.value),
    layerStyle = doc.getSharedLayerStyleWithID(override.value) ||
    doc.getSharedLayerStyleWithID(id)
  if (layerStyle) {
    return layerStyle.id
  } else {
    let library = symbol.master.getLibrary()
    if (library) {
      let importable = library
        .getImportableLayerStyleReferencesForDocument(doc)
        .find(importable => importable.id.includes(id))
      if (importable) {
        return importable.import().id
      } else {
        layerStyle = library.getDocument().sharedLayerStyles
          .find(style => style.id.includes(id))
        if (layerStyle) {
          if (layerStyle.getLibrary()) {
            importable = layerStyle.getLibrary()
              .getImportableLayerStyleReferencesForDocument(doc)
              .find(importable => importable.name == layerStyle.name)
          } else {
            importable = library
              .getImportableLayerStyleReferencesForDocument(doc)
              .find(importable => importable.name == layerStyle.name)
          }
          if (importable) {
            return importable.import().id
          }
        }
      }
    }
  }
}

const getStyleID = value => {
  let matches = value.match(/\[(.*?)\]/)
  return (matches) ? matches[1] : value
}
