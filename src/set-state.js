import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import * as UI from './ui.js'
import analytics from './analytics.js'

var doc = sketch.getSelectedDocument(),
  libraries = sketch.getLibraries(),
  selection = doc.selectedLayers

const COMMAND = context.command.name()

export default context => {
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
      return UI.dialog(COMMAND, "There are not any states.")
    }
    states.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase())    
    var result = setStateDialog(states.map(state => state.name))
    if (result && (states[result.index])) {
      var stateName = states[result.index].name
      var stateOverrides = states[result.index].overrides
      var value, errors = []
      stateOverrides.map(stateOverride => {
        symbol.overrides.map(symbolOverride => {
          if (symbolOverride.editable &&
            symbolOverride.property != "image" &&
            stateOverride.id == symbolOverride.id) {
            try {
              value = valueForOverride(symbol, stateOverride)
            } catch (e) {
              errors.push(symbolOverride)
            }
            symbol.setOverrideValue(symbolOverride, (value) ? value : "")
          }
        })
      })
      if (errors.length > 0) {
        analytics(context, "error", "import")
        return errorDialog(symbol, stateName, errors)
      }
      analytics(context, "success", stateName)
      return UI.message(stateName + " state set.")
    }
  }
}

const setStateDialog = items => {
  var buttons = ['Apply', 'Cancel']
  var message = COMMAND
  var info = "Please select a symbol state."
  var accessory = UI.select(items)
  var response = UI.dialog(message, info, accessory, buttons)
  var result = {
    index: accessory.indexOfSelectedItem(),
    title: accessory.titleOfSelectedItem()
  }
  if (response === 1000) {
    return result
  }
}

const errorDialog = (symbol, stateName, overrides) => {
  var message = COMMAND
  var info = stateName + " state set but some overrides could not be found:"

  var errorList = getErrorList(symbol, overrides)

  var accessory = NSTextView.alloc().initWithFrame(NSMakeRect(0, 0, 280, 25))
  var font = NSFont.systemFontOfSize(NSFont.smallSystemFontSize())
  var text = NSString.alloc().initWithString(errorList + "\n")
  accessory.insertText(text)
  accessory.setFont(font)
  accessory.setEditable(false)
  accessory.setDrawsBackground(false)
  UI.dialog(message, info, accessory)
  context.document.reloadInspector()
}

const getErrorList = (symbol, overrides) => {
  var properties = {
    "textStyle": "Text Style",
    "layerStyle": "Layer Style",
    "symbolID": "Symbol",
    "stringValue": "Text",
    "image": "Image"
  }
  return overrides.map(override => {
    var layers = override.path.split("/")
    var error = []
    layers.map((layer, i) => {
      error.push(symbol.overrides.find(symbolOverride => {
        return symbolOverride.path == layers.slice(0, i + 1).join("/")
      }).affectedLayer.name)
    })
    var path = error.join(" > ")
    if (path.length > 32) {
      path = "..." + error.join(" > ").slice(-32)
    }
    return "• " + properties[override.property] + ":  " + path
  }).join("\n")
}

const valueForOverride = (symbol, override) => {
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

const valueForSymbolOverride = (symbol, override) => {
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

const valueForTextStyleOverride = (symbol, override) => {
  var id = getStyleID(override.value)
  var textStyle = doc.getSharedTextStyleWithID(override.value) ||
    doc.getSharedTextStyleWithID(id)
  if (textStyle) {
    return textStyle.id
  } else {
    var library = symbol.master.getLibrary()
    if (library) {
      var importable = library
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

const valueForLayerStyleOverride = (symbol, override) => {
  var id = getStyleID(override.value)
  var layerStyle = doc.getSharedLayerStyleWithID(override.value) ||
    doc.getSharedLayerStyleWithID(id)
  if (layerStyle) {
    return layerStyle.id
  } else {
    var library = symbol.master.getLibrary()
    if (library) {
      var importable = library
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
  var matches = value.match(/\[(.*?)\]/)
  return (matches) ? matches[1] : value
}
