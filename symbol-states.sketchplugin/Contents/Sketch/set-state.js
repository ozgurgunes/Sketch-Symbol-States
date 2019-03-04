var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/set-state.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/sketch-module-google-analytics/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/sketch-module-google-analytics/index.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var kUUIDKey = 'google.analytics.uuid'
var uuid = NSUserDefaults.standardUserDefaults().objectForKey(kUUIDKey)
if (!uuid) {
  uuid = NSUUID.UUID().UUIDString()
  NSUserDefaults.standardUserDefaults().setObject_forKey(uuid, kUUIDKey)
}

function jsonToQueryString(json) {
  return '?' + Object.keys(json).map(function (key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
  }).join('&')
}

module.exports = function (context, trackingId, hitType, props) {
  var payload = {
    v: 1,
    tid: trackingId,
    ds: 'Sketch ' + NSBundle.mainBundle().objectForInfoDictionaryKey("CFBundleShortVersionString"),
    cid: uuid,
    t: hitType,
    an: context.plugin.name(),
    aid: context.plugin.identifier(),
    av: context.plugin.version()
  }
  if (props) {
    Object.keys(props).forEach(function (key) {
      payload[key] = props[key]
    })
  }

  var url = NSURL.URLWithString(
    NSString.stringWithFormat("https://www.google-analytics.com/collect%@", jsonToQueryString(payload))
  )

  if (url) {
    NSURLSession.sharedSession().dataTaskWithURL(url).resume()
  }
}


/***/ }),

/***/ "./src/analytics.js":
/*!**************************!*\
  !*** ./src/analytics.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var sketch_module_google_analytics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch-module-google-analytics */ "./node_modules/sketch-module-google-analytics/index.js");
/* harmony import */ var sketch_module_google_analytics__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch_module_google_analytics__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _defaults_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./defaults.js */ "./src/defaults.js");


/* harmony default export */ __webpack_exports__["default"] = (function (context, action, label, value) {
  var payload = {};
  payload.ec = _defaults_js__WEBPACK_IMPORTED_MODULE_1__["PLUGIN_NAME"];

  if (action) {
    payload.ea = action;
  }

  if (label) {
    payload.el = label;
  }

  if (value) {
    payload.ev = value;
  }

  return sketch_module_google_analytics__WEBPACK_IMPORTED_MODULE_0___default()(context, _defaults_js__WEBPACK_IMPORTED_MODULE_1__["GA_TRACKING_ID"], 'event', payload);
});

/***/ }),

/***/ "./src/defaults.js":
/*!*************************!*\
  !*** ./src/defaults.js ***!
  \*************************/
/*! exports provided: PLUGIN_NAME, PLUGIN_KEY, GA_TRACKING_ID */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PLUGIN_NAME", function() { return PLUGIN_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PLUGIN_KEY", function() { return PLUGIN_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GA_TRACKING_ID", function() { return GA_TRACKING_ID; });
var PLUGIN_NAME = "Symbol States",
    PLUGIN_KEY = "com.gunesozgur.sketch.symbol-states",
    GA_TRACKING_ID = "UA-5738625-2";

/***/ }),

/***/ "./src/set-state.js":
/*!**************************!*\
  !*** ./src/set-state.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var sketch_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch/dom */ "sketch/dom");
/* harmony import */ var sketch_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch_dom__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var sketch_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sketch/settings */ "sketch/settings");
/* harmony import */ var sketch_settings__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sketch_settings__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ui_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui.js */ "./src/ui.js");
/* harmony import */ var _defaults_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./defaults.js */ "./src/defaults.js");
/* harmony import */ var _analytics_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./analytics.js */ "./src/analytics.js");





var doc = sketch_dom__WEBPACK_IMPORTED_MODULE_0___default.a.getSelectedDocument(),
    libraries = sketch_dom__WEBPACK_IMPORTED_MODULE_0___default.a.getLibraries(),
    selection = doc.selectedLayers;
/* harmony default export */ __webpack_exports__["default"] = (function (context) {
  if (selection.length != 1 || selection.layers[0].type != sketch_dom__WEBPACK_IMPORTED_MODULE_0___default.a.Types.SymbolInstance) {
    _ui_js__WEBPACK_IMPORTED_MODULE_2__["message"]("Please select a symbol instance.");
  } else {
    var symbol = selection.layers[0],
        states = sketch_settings__WEBPACK_IMPORTED_MODULE_1___default.a.layerSettingForKey(symbol.master, _defaults_js__WEBPACK_IMPORTED_MODULE_3__["PLUGIN_KEY"]) || [];
    states.sort(function (a, b) {
      return a.name - b.name;
    });

    if (states.length < 1) {
      return _ui_js__WEBPACK_IMPORTED_MODULE_2__["createDialog"]("Set States", "There are not any states.");
    }

    var result = _ui_js__WEBPACK_IMPORTED_MODULE_2__["createSelect"]("Set State", "Please select a symbol state.", states.map(function (state) {
      return state.name;
    }));

    if (result && states[result.index]) {
      var stateOverrides = states[result.index].overrides;
      stateOverrides.forEach(function (stateOverride) {
        symbol.overrides.forEach(function (symbolOverride) {
          if (symbolOverride.editable && symbolOverride.property != "image" && stateOverride.id == symbolOverride.id) {
            var value = valueForOverride(symbol, stateOverride);
            symbol.setOverrideValue(symbolOverride, value ? value : "");
          }
        });
      });
      Object(_analytics_js__WEBPACK_IMPORTED_MODULE_4__["default"])(context, 'Set State', states[result.index].name);
      _ui_js__WEBPACK_IMPORTED_MODULE_2__["message"](states[result.index].name + " activated.");
    }
  }
});

function valueForOverride(symbol, override) {
  var value;

  switch (true) {
    case override.property == "symbolID":
      value = valueForSymbolOverride(symbol, override);
      break;

    case override.property == "textStyle":
      value = valueForTextStyleOverride(symbol, override);
      break;

    case override.property == "layerStyle":
      value = valueForLayerStyleOverride(symbol, override);
      break;
  }

  return value ? value : override.value;
}

function valueForSymbolOverride(symbol, override) {
  var master = doc.getSymbolMasterWithID(override.value);

  if (master) {
    //console.log("'SYMBOL FOUND': %o", master.name)
    return master.symbolId;
  } else {
    var library = symbol.master.getLibrary();

    if (library) {
      //console.log("'LOOKING TO SYMBOL LIBRARY': %o", library.name)
      var importable = library.getImportableSymbolReferencesForDocument(doc).find(function (importable) {
        return importable.id == override.value;
      });

      if (importable) {
        // console.log("'IMPORTING SYMBOL': %o", importable.name)
        return importable.import().symbolId;
      } else {
        master = library.getDocument().getSymbols().find(function (master) {
          return master.symbolId == override.value;
        });

        if (master) {
          //console.log("'OVERRIDE MASTER FOUND': %o", master.name)
          if (master.getLibrary()) {
            //console.log("'LOOKING TO OVERRIDES LIBRARY': %o", master.getLibrary().name)
            importable = master.getLibrary().getImportableSymbolReferencesForDocument(doc).find(function (importable) {
              return importable.name == master.name;
            });
          } else {
            //console.log("'LOOKING TO SYMBOLS LIBRARY': %o", library.name)
            importable = library.getImportableSymbolReferencesForDocument(doc).find(function (importable) {
              return importable.name == master.name;
            });
          }

          if (importable) {
            //console.log("'IMPORTING SYMBOL': %o", importable.name)
            return importable.import().symbolId;
          }
        }
      }
    }
  }
}

function valueForTextStyleOverride(symbol, override) {
  var id = getStyleID(override.value);
  var textStyle = doc.getSharedTextStyleWithID(override.value) || doc.getSharedTextStyleWithID(id);

  if (textStyle) {
    //console.log("'TEXT STYLE FUND': %o", textStyle.name)
    return textStyle.id;
  } else {
    var library = symbol.master.getLibrary();

    if (library) {
      //console.log("'LOOKING TO TEXT STYLE LIBRARY': %o", library.name)
      var importable = library.getImportableTextStyleReferencesForDocument(doc).find(function (importable) {
        return importable.id.includes(id);
      });

      if (importable) {
        //console.log("'IMPORTING TEXT STYLE': %o", importable.name)
        return importable.import().id;
      } else {
        textStyle = library.getDocument().sharedTextStyles.find(function (style) {
          return style.id.includes(id);
        });

        if (textStyle) {
          //console.log("'LOOKING FOR TEXT STYLE': %o", textStyle.name)
          if (textStyle.getLibrary()) {
            importable = textStyle.getLibrary().getImportableTextStyleReferencesForDocument(doc).find(function (importable) {
              return importable.name == textStyle.name;
            });
          } else {
            importable = library.getImportableTextStyleReferencesForDocument(doc).find(function (importable) {
              return importable.name == textStyle.name;
            });
          }

          if (importable) {
            //console.log("'IMPORTING TEXT STYLE': %o", importable.name)
            return importable.import().id;
          }
        }
      }
    }
  }
}

function valueForLayerStyleOverride(symbol, override) {
  var id = getStyleID(override.value);
  var layerStyle = doc.getSharedLayerStyleWithID(override.value) || doc.getSharedLayerStyleWithID(id);

  if (layerStyle) {
    //console.log("'LAYER STYLE FUND': %o", layerStyle.name)
    return layerStyle.id;
  } else {
    var library = symbol.master.getLibrary();

    if (library) {
      var importable = library.getImportableLayerStyleReferencesForDocument(doc).find(function (importable) {
        return importable.id.includes(id);
      });

      if (importable) {
        //console.log("'IMPORTING LAYER STYLE': %o", importable.name)
        return importable.import().id;
      } else {
        layerStyle = library.getDocument().sharedLayerStyles.find(function (style) {
          return style.id.includes(id);
        });

        if (layerStyle) {
          //console.log("'LOOKING FOR LAYER STYLE': %o", layerStyle.name)
          if (layerStyle.getLibrary()) {
            importable = layerStyle.getLibrary().getImportableLayerStyleReferencesForDocument(doc).find(function (importable) {
              return importable.name == layerStyle.name;
            });
          } else {
            importable = library.getImportableLayerStyleReferencesForDocument(doc).find(function (importable) {
              return importable.name == layerStyle.name;
            });
          }

          if (importable) {
            //console.log("'IMPORTING LAYER STYLE': %o", importable.name)
            return importable.import().id;
          }
        }
      }
    }
  }
}

function getStyleID(value) {
  var matches = value.match(/\[(.*?)\]/);
  return matches ? matches[1] : value;
}

/***/ }),

/***/ "./src/ui.js":
/*!*******************!*\
  !*** ./src/ui.js ***!
  \*******************/
/*! exports provided: message, createDialog, createCombobox, createSelect, createList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "message", function() { return message; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createDialog", function() { return createDialog; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createCombobox", function() { return createCombobox; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createSelect", function() { return createSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createList", function() { return createList; });
// import sketch from 'sketch'
// documentation: https://developer.sketchapp.com/reference/api/
var sketch = __webpack_require__(/*! sketch/dom */ "sketch/dom"),
    UI = __webpack_require__(/*! sketch/ui */ "sketch/ui"),
    app = NSApplication.sharedApplication(),
    defaults = __webpack_require__(/*! ./defaults */ "./src/defaults.js");

function message(message) {
  UI.message(defaults.PLUGIN_NAME + ": " + message);
}
function createDialog(message, info, accessory, buttons) {
  buttons = buttons || ['OK'];
  var alert = NSAlert.alloc().init();
  alert.setMessageText(message);
  alert.setInformativeText(info);
  buttons.forEach(function (data) {
    alert.addButtonWithTitle(data);
  });

  if (accessory) {
    alert.setAccessoryView(accessory);
    alert.window().setInitialFirstResponder(accessory);
  }

  return alert.runModal();
}
function createCombobox(msg, info, items, selectedItemIndex) {
  var buttons = ['Save', 'Cancel'];
  var accessory = NSComboBox.alloc().initWithFrame(NSMakeRect(0, 0, 240, 25));
  accessory.addItemsWithObjectValues(items); // accessory.addItemsWithTitles(items)
  //accessory.selectItemAtIndex(selectedItemIndex)

  accessory.setEditable(true); //accessory.setCompletes(true)

  var response = createDialog(msg, info, accessory, buttons);
  var result = accessory.stringValue();

  if (response === 1000) {
    if (!result.length() > 0) {
      app.displayDialog("Please give a name to new symbol state");
      items.shift();
      return createCombobox(msg, info, items, selectedItemIndex);
    }

    return result;
  }
}
function createSelect(msg, info, items, selectedItemIndex) {
  var buttons = ['Apply', 'Cancel'];
  var accessory = NSPopUpButton.alloc().initWithFrame(NSMakeRect(0, 0, 240, 25)); //accessory.addItemsWithObjectValues(items)

  accessory.addItemsWithTitles(items); //accessory.selectItemAtIndex(selectedItemIndex)
  // accessory.setEditable(true)
  //accessory.setCompletes(true)

  var response = createDialog(msg, info, accessory, buttons);
  var result = {
    index: accessory.indexOfSelectedItem(),
    title: accessory.titleOfSelectedItem()
  };

  if (response === 1000) {
    return result;
  }
}
function createList(msg, info, items, selectedItemIndex) {
  items.sort();
  selectedItemIndex = selectedItemIndex || 0;
  var buttons = ['Delete', 'Cancel', 'Delete All'];
  var accessory = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 240, 120));
  var scrollView = NSScrollView.alloc().initWithFrame(NSMakeRect(0, 0, 240, 120));
  var scrollContent = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 240, items.length * 24 + 10));
  var states = [];
  items.forEach(function (stateName, i) {
    states[i] = NSButton.alloc().initWithFrame(NSMakeRect(5, 5 + i * 24, 200, 20));
    states[i].setButtonType(NSSwitchButton);
    states[i].setTitle(stateName);
    states[i].setState(false);
    scrollContent.addSubview(states[i]);
  });
  scrollContent.setFlipped(true);
  scrollView.setHasVerticalScroller(true);
  scrollView.setHasHorizontalScroller(false);
  scrollView.setDocumentView(scrollContent);
  accessory.addSubview(scrollView);
  var response = createDialog(msg, info, accessory, buttons);
  var selection = [];

  if (response === 1002) {
    var confirmed = createDialog('Are you sure?', 'All symbol states will be deleted!');

    if (confirmed === 1000) {
      states.forEach(function (state, i) {
        //selection.push(state.title())
        selection.push(i);
      });
      return selection;
    }
  }

  if (response === 1000) {
    states.forEach(function (state, i) {
      if (state.state()) {
        selection.push(i);
      }
    });
    return selection;
  }
}

/***/ }),

/***/ "sketch/dom":
/*!*****************************!*\
  !*** external "sketch/dom" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/dom");

/***/ }),

/***/ "sketch/settings":
/*!**********************************!*\
  !*** external "sketch/settings" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/settings");

/***/ }),

/***/ "sketch/ui":
/*!****************************!*\
  !*** external "sketch/ui" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/ui");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=set-state.js.map