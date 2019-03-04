import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import * as UI from './ui.js'
import * as defaults from './defaults.js'
import analytics from './analytics.js'

var doc = sketch.getSelectedDocument(),
  libraries = sketch.getLibraries(),
  selection = doc.selectedLayers

export default function(context) {
  if (selection.length != 1 || selection.layers[0].type != sketch.Types.SymbolInstance) {
    UI.message("Please select a symbol instance.")
  } else {
    var symbol = selection.layers[0],
      states = settings.layerSettingForKey(symbol.master, defaults.PLUGIN_KEY) || []
    states.sort((a, b) => a.name - b.name)
    if (states.length < 1) {
      return UI.createDialog("Set States", "There are not any states.")
    }
    var result = UI.createSelect(
      "Set State",
      "Please select a symbol state.",
      states.map(state => state.name));
    if (result && (states[result.index])) {
      var stateOverrides = states[result.index].overrides
      stateOverrides.forEach(stateOverride => {
        symbol.overrides.forEach(symbolOverride => {
          if (symbolOverride.editable && symbolOverride.property != "image" &&
            stateOverride.id == symbolOverride.id) {
            var value = valueForOverride(symbol, stateOverride)
            symbol.setOverrideValue(symbolOverride, (value) ? value : "")
          }
        })
      })
      analytics(context, 'Set State', states[result.index].name)
      UI.message(states[result.index].name + " activated.")
    }
  }
}

function valueForOverride(symbol, override) {
  switch (true) {
    case (override.property == "symbolID"):
      var symbolID = valueForSymbolOverride(symbol, override)
      return (symbolID) ? symbolID : override.value
    case (override.property == "textStyle"):
      var textStyleID = valueForTextStyleOverride(symbol, override)
      return (textStyleID) ? textStyleID : override.value
    case (override.property == "layerStyle"):
      var layerStyleID = valueForLayerStyleOverride(symbol, override)
      return (layerStyleID) ? layerStyleID : override.value
    default:
      return override.value
  }
}


function valueForSymbolOverride(symbol, override) {
  var master = doc.getSymbolMasterWithID(override.value)
  if (master) {
    //console.log("'SYMBOL FOUND': %o", master.name)
    return master.symbolId
  } else {
    var library = symbol.master.getLibrary()
    if (library) {
      //console.log("'LOOKING TO SYMBOL LIBRARY': %o", library.name)
      var importable = library.getImportableSymbolReferencesForDocument(doc)
        .find(importable => importable.id == override.value)
      if (importable) {
        // console.log("'IMPORTING SYMBOL': %o", importable.name)
        return importable.import().symbolId
      } else {
        master = library.getDocument().getSymbols()
          .find(master => master.symbolId == override.value)
        if (master) {
          //console.log("'OVERRIDE MASTER FOUND': %o", master.name)
          if (master.getLibrary()) {
            //console.log("'LOOKING TO OVERRIDES LIBRARY': %o", master.getLibrary().name)
            importable = master.getLibrary().getImportableSymbolReferencesForDocument(doc)
              .find(importable => importable.name == master.name)
          } else {
            //console.log("'LOOKING TO SYMBOLS LIBRARY': %o", library.name)
            importable = library.getImportableSymbolReferencesForDocument(doc)
              .find(importable => importable.name == master.name)
          }
          if (importable) {
            //console.log("'IMPORTING SYMBOL': %o", importable.name)
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
    //console.log("'TEXT STYLE FUND': %o", textStyle.name)
    return textStyle.id
  } else {
    var library = symbol.master.getLibrary()
    if (library) {
      //console.log("'LOOKING TO TEXT STYLE LIBRARY': %o", library.name)
      var importable = library.getImportableTextStyleReferencesForDocument(doc)
        .find(importable => importable.id.includes(id))
      if (importable) {
        //console.log("'IMPORTING TEXT STYLE': %o", importable.name)
        return importable.import().id
      } else {
        textStyle = library.getDocument().sharedTextStyles
          .find(style => style.id.includes(id))
        if (textStyle) {
          //console.log("'LOOKING FOR TEXT STYLE': %o", textStyle.name)
          if (textStyle.getLibrary()) {
            importable = textStyle.getLibrary().getImportableTextStyleReferencesForDocument(doc)
              .find(importable => importable.name == textStyle.name)
          } else {
            importable = library.getImportableTextStyleReferencesForDocument(doc)
              .find(importable => importable.name == textStyle.name)
          }
          if (importable) {
            //console.log("'IMPORTING TEXT STYLE': %o", importable.name)
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
    //console.log("'LAYER STYLE FUND': %o", layerStyle.name)
    return layerStyle.id
  } else {
    var library = symbol.master.getLibrary()
    if (library) {
      var importable = library.getImportableLayerStyleReferencesForDocument(doc)
        .find(importable => importable.id.includes(id))
      if (importable) {
        //console.log("'IMPORTING LAYER STYLE': %o", importable.name)
        return importable.import().id
      } else {
        layerStyle = library.getDocument().sharedLayerStyles
          .find(style => style.id.includes(id))
        if (layerStyle) {
          //console.log("'LOOKING FOR LAYER STYLE': %o", layerStyle.name)
          if (layerStyle.getLibrary()) {
            importable = layerStyle.getLibrary().getImportableLayerStyleReferencesForDocument(doc)
              .find(importable => importable.name == layerStyle.name)
          } else {
            importable = library.getImportableLayerStyleReferencesForDocument(doc)
              .find(importable => importable.name == layerStyle.name)
          }
          if (importable) {
            //console.log("'IMPORTING LAYER STYLE': %o", importable.name)
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
