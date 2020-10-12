import sketch from 'sketch/dom'
import * as UI from './ui'
import analytics from './analytics'
import { getSymbol, getStates } from './utils'

var doc = sketch.getSelectedDocument()
var selection = doc.selectedLayers

export default function(context) {
  try {
    let symbol = getSymbol(selection)
    let states = getStates(symbol, true)
    states.unshift({
      name: '- Select a State -',
      overrides: []
    })
    // Display a dialog for popup button of existing states.
    let result = setStateDialog(states.map(state => state.name))
    if (result && states[result]) {
      let stateName = states[result].name
      let stateOverrides = states[result].overrides
      let errors = []
      // Reset overrides before set a state.
      symbol.sketchObject.setOverrides(nil)
      // Set symbol overrides for every override data in chosen state.
      stateOverrides.map(stateOverride => {
        let symbolOverride = symbol.overrides.find(
          override => override.id == stateOverride.id
        )
        // Symbol and style ids change for every document,
        // if they have been imported from a library.
        // So, try to get correct override value for current document.
        try {
          let value = getValueForOverride(doc, symbol, stateOverride)
          symbol.setOverrideValue(symbolOverride, value)
        } catch (e) {
          errors.push(symbolOverride)
        }
      })
      // Reload inspector panel with new overrides.
      // This seems unnecessary actually but lets be sure.
      context.document.reloadInspector()
      if (errors.length > 0) {
        analytics('State Errors', errors.length / stateOverrides.length)
        // If there are any overrides whose values couldn't be get,
        // display a list of their layers (and parents) name.
        return errorDialog(symbol, stateName, errors)
      }
      analytics('State Set', 1)
      return UI.success(stateName + ' state set.')
    }
  } catch (e) {
    if (e) {
      console.log(e)
      context.document.reloadInspector()
      return e
    }
  }
}

function setStateDialog(items) {
  let buttons = ['Set', 'Cancel']
  let info = 'Please select a symbol state.'
  let accessory = UI.comboBox(items)
  accessory.selectItemAtIndex(0)
  let response = UI.dialog(info, accessory, buttons)
  let result = accessory.indexOfSelectedItem()
  if (response === 1000) {
    if (!result > 0) {
      // User clicked "OK" without selecting a state.
      // Return dialog until user selects a state or clicks "Cancel".
      analytics('No Selection')
      UI.error('Please select a state.')
      return setStateDialog(items)
    }
    return result
  }
}

function errorDialog(symbol, stateName, overrides) {
  let info = stateName + ' has errors. Some overrides could not be found:'
  let items = getErrorList(symbol, overrides)
  let list = UI.errorList(items)
  let accessory = UI.scrollView(list)
  UI.dialog(info, accessory)
}

function getErrorList(symbol, overrides) {
  var properties = {
    textStyle: 'Text Style',
    layerStyle: 'Layer Style',
    symbolID: 'Symbol',
    stringValue: 'Text',
    fillColor: 'Tint Color'
  }
  // Create an informative report for overrides
  // whose values couldn't be get.
  // Showing only overrides layer name is not enough,
  // Most of overrides share same name like "Text" or "Background".
  // So, generate a path with their parent layers name.
  return overrides.map(override => {
    let layers = override.path.split('/')
    let error = []
    layers.map((layer, i) => {
      error.push(
        symbol.overrides.find(symbolOverride => {
          return symbolOverride.path == layers.slice(0, i + 1).join('/')
        }).affectedLayer.name
      )
    })
    let path = error.join(' > ')
    // Paths may be too long to fit in dialog window.
    // So, display first and last 16 characters only,
    // to help identify which overrides could not be found.
    if (path.length > 36) {
      path = path.slice(0, 16) + ' ... ' + path.slice(-16)
    }
    // Display override type before the path for a comprehensible report.
    return properties[override.property] + ':  ' + path
  })
}

export function getValueForOverride(doc, symbol, override) {
  let value
  // Run the appropriate function according to override type
  // to get override value.
  switch (true) {
    case override.value == '':
      break
    case override.property == 'symbolID':
      value = getValueForSymbolOverride(doc, symbol, override)
      break
    case override.property == 'textStyle':
      value = getValueForTextStyleOverride(doc, symbol, override)
      break
    case override.property == 'layerStyle':
      value = getValueForLayerStyleOverride(doc, symbol, override)
      break
    case override.property == 'fillColor':
      value = getValueForFillColorOverride(doc, symbol, override)
      break
  }
  // Return saved value if we couldn't get the correct one or it is "None".
  return value || override.value
}

function getValueForFillColorOverride(doc, symbol, override) {
  if (override.value.startsWith('rgba(')) {
    // If override value is a CSSAttributeString,
    // simply return a MSColor object.
    return MSImmutableColor.colorWithSVGString(
      override.value
    ).newMutableCounterpart()
  }
  // This is a swatch override. Start to search matching swatch.
  // Lets look in to document first.
  let swatch = doc.swatches.find(swatch =>
    swatch.referencingColor.swatchID().includes(override.value.split('|')[0])
  )
  if (swatch) {
    // Found it, easy one.
    return swatch.referencingColor
  }
  // Swatch is not in document, start to search libraries.
  let library = symbol.master.getLibrary()
  if (library) {
    // Let's assume that state is saved locally first.
    let importable = library
      .getImportableSwatchReferencesForDocument(doc)
      .find(importable => importable.id.includes(override.value.split('|')[0]))
    if (importable) {
      // State is local but swatch found in symbol masters library.
      return importable.import().referencingColor
    }
    // Not found! Mayve state is also coming from library.
    let swatch = library
      .getDocument()
      .swatches.find(swatch =>
        swatch.referencingColor
          .swatchID()
          .includes(override.value.split('|')[0])
      )
    if (swatch) {
      // Swatch found, now we have to get it as importable.
      // Searching by name is not realiable but no other way.
      let importable = library
        .getImportableSwatchReferencesForDocument(doc)
        .find(importable => importable.name == swatch.name)
      if (importable) {
        // Swatch found in symbol masters library.
        return importable.import().referencingColor
      }
    }
  }
  // Still not found! Search all libraries by assuming
  // that state is saved locally.
  for (let lib of sketch.getLibraries()) {
    let importable = lib
      .getImportableSwatchReferencesForDocument(doc)
      .find(importable => importable.id.includes(override.value.split('|')[0]))
    if (importable) {
      // Swatch found in some other library.
      return importable.import().referencingColor
    }
  }
  // Damn! Most likely state is set in the library and swatch is
  // in another library. Search all libraries again by color string.
  // If a matching swatch found, find it as an importable by its name.
  // This is not a reliable way but we have no other chance.
  for (let lib of sketch.getLibraries()) {
    let swatch = lib
      .getDocument()
      .swatches.find(swatch =>
        swatch.referencingColor
          .CSSAttributeString()
          .includes(override.value.split('|')[1])
      )
    if (swatch) {
      let importable = lib
        .getImportableSwatchReferencesForDocument(doc)
        .find(importable => importable.name.includes(swatch.name))
      if (importable) {
        // Swatch found in some other library.
        return importable.import().referencingColor
      }
    }
  }
  throw 'Swatch not found!'
}

function getValueForSymbolOverride(doc, symbol, override) {
  // Look for overriding symbol master in this document.
  let master = doc.getSymbolMasterWithID(override.value)
  // If master is in this document return symbolId.
  if (master) {
    return master.symbolId
  }
  // If overriding symbol master not in this document,
  // then look in symbol master's library's importable references.
  let library = symbol.master.getLibrary()
  if (library) {
    let importable = library
      .getImportableSymbolReferencesForDocument(doc)
      .find(importable => importable.id == override.value)
    // If overriding symbol master's reference found in
    // symbol master's library, import it and return symbolId.
    if (importable) {
      return importable.import().symbolId
    }
    // If overriding symbol master's reference not found in symbol master's
    // library too, lets try to find it as an object to get more info about it.
    master = library
      .getDocument()
      .getSymbols()
      .find(master => master.symbolId == override.value)
    if (master) {
      // Ok, we found local overriding master in symbol master's library.
      // We know its objectID and name now.
      // Is that master imported to that library from another too?
      if (master.getLibrary()) {
        // Then lets try to find it in its own library.
        importable = master
          .getLibrary()
          .getImportableSymbolReferencesForDocument(doc)
          .find(importable => {
            return (
              importable.sketchObject.symbolMaster().objectID() == master.id
            )
          })
      } else {
        // So, overriding symbol master is not imported to library from
        // another. It is an original symbol of the library which we imported
        // to document from. Lets try to find it as an importable.
        importable = library
          .getImportableSymbolReferencesForDocument(doc)
          .find(importable => {
            return (
              importable.sketchObject.symbolMaster().objectID() == master.id
            )
          })
      }
      // If overriding symbol found, import it and return symbolId.
      if (importable) {
        return importable.import().symbolId
      }
    }
  }
  throw 'Symbol not found!'
}

function getValueForTextStyleOverride(doc, symbol, override) {
  // Get original style id (within brackets) if it is an imported style.
  let id = getStyleID(override.value)
  // Then look for overriding style in this document.
  let textStyle =
    doc.getSharedTextStyleWithID(override.value) ||
    doc.getSharedTextStyleWithID(id)
  // Rest of the code is very similar to "getValueForSymbolOverride"
  // function. So, it wont be explained here again.
  if (textStyle) {
    return textStyle.id
  }
  let library = symbol.master.getLibrary()
  if (library) {
    let importable = library
      .getImportableTextStyleReferencesForDocument(doc)
      .find(importable => importable.id.includes(id))
    if (importable) {
      return importable.import().id
    }
    textStyle = library
      .getDocument()
      .sharedTextStyles.find(style => style.id.includes(id))
    if (textStyle) {
      if (textStyle.getLibrary()) {
        importable = textStyle
          .getLibrary()
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
  throw 'Text Style not found!'
}

function getValueForLayerStyleOverride(doc, symbol, override) {
  // Get original style id (within brackets) if it is an imported style.
  let id = getStyleID(override.value)
  // Then look for overriding style in this document.
  let layerStyle =
    doc.getSharedLayerStyleWithID(override.value) ||
    doc.getSharedLayerStyleWithID(id)
  // Rest of the code is very similar to "getValueForSymbolOverride"
  // function. So, it wont be explained here again.
  if (layerStyle) {
    return layerStyle.id
  }
  let library = symbol.master.getLibrary()
  if (library) {
    let importable = library
      .getImportableLayerStyleReferencesForDocument(doc)
      .find(importable => importable.id.includes(id))
    if (importable) {
      return importable.import().id
    }
    layerStyle = library
      .getDocument()
      .sharedLayerStyles.find(style => style.id.includes(id))
    if (layerStyle) {
      if (layerStyle.getLibrary()) {
        importable = layerStyle
          .getLibrary()
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
  throw 'Layer Style not found!'
}

function getStyleID(value) {
  // Return id within brackets if any.
  let matches = value.match(/\[(.*?)\]/)
  return matches ? matches[1] : value
}
