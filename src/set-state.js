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
    if (states.length < 1) {
      analytics(context, "error", "states")
      return UI.createDialog("Set States", "There are not any states.")
    }
    states.sort((a, b) => a.name - b.name)
    var result = setStateDialog(states.map(state => state.name))
    if (result && (states[result.index])) {
      var stateOverrides = states[result.index].overrides
      stateOverrides.map(stateOverride => {
        symbol.overrides.map(symbolOverride => {
          if (symbolOverride.editable && symbolOverride.property != "image" &&
            stateOverride.id == symbolOverride.id) {
            var value = valueForOverride(symbol, stateOverride)
            symbol.setOverrideValue(symbolOverride, (value) ? value : "")
          }
        })
      })
      analytics(context, "success", states[result.index].name)
      return UI.message(states[result.index].name + " activated.")
    }
  }
}

function setStateDialog(items) {
  var buttons = ['Apply', 'Cancel']
  var message = "Set State"
  var info = "Please select a symbol state."
  var accessory = UI.createSelect(items)
  var response = UI.createDialog(message, info, accessory, buttons)
  var result = {
    index: accessory.indexOfSelectedItem(),
    title: accessory.titleOfSelectedItem()
  }
  if (response === 1000) {
    return result
  }
}

function valueForOverride(symbol, override) {
  var value
  switch (true) {
    case (override.property == "symbolID"):
      value = valueForSymbolOverride(symbol, override)
      break;
    case (override.property == "textStyle"):
      value = valueForTextStyleOverride(symbol, override)
      break;
    case (override.property == "layerStyle"):
      value = valueForLayerStyleOverride(symbol, override)
      break;
  }
  return (value) ? value : override.value
}


function valueForSymbolOverride(symbol, override) {
  var master = doc.getSymbolMasterWithID(override.value)
  if (master) {
    return master.symbolId
  } else {
    var library = symbol.master.getLibrary()
    if (library) {
      var importable = library.getImportableSymbolReferencesForDocument(doc)
        .find(importable => importable.id == override.value)
      if (importable) {
        return importable.import().symbolId
      } else {
        master = library.getDocument().getSymbols()
          .find(master => master.symbolId == override.value)
        if (master) {
          if (master.getLibrary()) {
            importable = master.getLibrary().getImportableSymbolReferencesForDocument(doc)
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

function valueForTextStyleOverride(symbol, override) {
  var id = getStyleID(override.value)
  var textStyle = doc.getSharedTextStyleWithID(override.value) ||
    doc.getSharedTextStyleWithID(id)
  if (textStyle) {
    return textStyle.id
  } else {
    var library = symbol.master.getLibrary()
    if (library) {
      var importable = library.getImportableTextStyleReferencesForDocument(doc)
        .find(importable => importable.id.includes(id))
      if (importable) {
        return importable.import().id
      } else {
        textStyle = library.getDocument().sharedTextStyles
          .find(style => style.id.includes(id))
        if (textStyle) {
          if (textStyle.getLibrary()) {
            importable = textStyle.getLibrary().getImportableTextStyleReferencesForDocument(doc)
              .find(importable => importable.name == textStyle.name)
          } else {
            importable = library.getImportableTextStyleReferencesForDocument(doc)
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

function valueForLayerStyleOverride(symbol, override) {
  var id = getStyleID(override.value)
  var layerStyle = doc.getSharedLayerStyleWithID(override.value) ||
    doc.getSharedLayerStyleWithID(id)
  if (layerStyle) {
    return layerStyle.id
  } else {
    var library = symbol.master.getLibrary()
    if (library) {
      var importable = library.getImportableLayerStyleReferencesForDocument(doc)
        .find(importable => importable.id.includes(id))
      if (importable) {
        return importable.import().id
      } else {
        layerStyle = library.getDocument().sharedLayerStyles
          .find(style => style.id.includes(id))
        if (layerStyle) {
          if (layerStyle.getLibrary()) {
            importable = layerStyle.getLibrary().getImportableLayerStyleReferencesForDocument(doc)
              .find(importable => importable.name == layerStyle.name)
          } else {
            importable = library.getImportableLayerStyleReferencesForDocument(doc)
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

function getStyleID(value) {
  var matches = value.match(/\[(.*?)\]/)
  return (matches) ? matches[1] : value
}
