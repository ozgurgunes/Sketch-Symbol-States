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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/delete-states.js");
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

var GA_TRACKING_ID = "UA-5738625-2";
/* harmony default export */ __webpack_exports__["default"] = (function (context, label, value) {
  var payload = {};
  payload.ec = context.plugin.name();
  payload.ea = context.command.name();

  if (label) {
    payload.el = label;
  }

  if (value) {
    payload.ev = value;
  }

  return sketch_module_google_analytics__WEBPACK_IMPORTED_MODULE_0___default()(context, GA_TRACKING_ID, 'event', payload);
});

/***/ }),

/***/ "./src/delete-states.js":
/*!******************************!*\
  !*** ./src/delete-states.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var sketch_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch/dom */ "sketch/dom");
/* harmony import */ var sketch_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch_dom__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var sketch_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sketch/settings */ "sketch/settings");
/* harmony import */ var sketch_settings__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sketch_settings__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ui_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui.js */ "./src/ui.js");
/* harmony import */ var _analytics_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./analytics.js */ "./src/analytics.js");




var doc = sketch_dom__WEBPACK_IMPORTED_MODULE_0___default.a.getSelectedDocument();
var libraries = sketch_dom__WEBPACK_IMPORTED_MODULE_0___default.a.getLibraries();
var selection = doc.selectedLayers;
/* harmony default export */ __webpack_exports__["default"] = (function (context) {
  if (selection.length != 1 || selection.layers[0].type != sketch_dom__WEBPACK_IMPORTED_MODULE_0___default.a.Types.SymbolInstance) {
    Object(_analytics_js__WEBPACK_IMPORTED_MODULE_3__["default"])(context, "error", "selection");
    return _ui_js__WEBPACK_IMPORTED_MODULE_2__["message"]("Please select a symbol instance.");
  } else {
    var symbol = selection.layers[0];
    var states = sketch_settings__WEBPACK_IMPORTED_MODULE_1___default.a.layerSettingForKey(symbol.master, context.plugin.identifier()) || [];
    states.sort(function (a, b) {
      return a.name - b.name;
    });

    if (states.length < 1) {
      Object(_analytics_js__WEBPACK_IMPORTED_MODULE_3__["default"])(context, "error", "no state");
      return _ui_js__WEBPACK_IMPORTED_MODULE_2__["createDialog"]("Delete States", "There are not any states.");
    }

    var result = deleteStatesDialog("Delete States", "Please select state to be deleted.", states.map(function (state) {
      return state.name;
    }));

    if (result) {
      result.selection.reverse().map(function (item) {
        states.splice(item, 1);
      });
      sketch_settings__WEBPACK_IMPORTED_MODULE_1___default.a.setLayerSettingForKey(symbol.master, context.plugin.identifier(), states);
      Object(_analytics_js__WEBPACK_IMPORTED_MODULE_3__["default"])(context, result.deletion, result.selection.length);
      return _ui_js__WEBPACK_IMPORTED_MODULE_2__["message"](result.selection.length + " states deleted.");
    }
  }
});

function deleteStatesDialog(msg, info, items) {
  var buttons = ['Delete', 'Cancel', 'Delete All'];
  var accessory = _ui_js__WEBPACK_IMPORTED_MODULE_2__["createList"](items);
  var response = _ui_js__WEBPACK_IMPORTED_MODULE_2__["createDialog"](msg, info, accessory[0], buttons);
  var selection = [];

  if (response === 1002) {
    var confirmed = _ui_js__WEBPACK_IMPORTED_MODULE_2__["createDialog"]('Are you sure?', 'All symbol states will be deleted!');

    if (confirmed === 1000) {
      accessory[1].map(function (state, i) {
        return selection.push(i);
      });
      return {
        deletion: "delete all",
        selection: selection
      };
    }
  }

  if (response === 1000) {
    accessory[1].map(function (state, i) {
      if (state.state()) {
        selection.push(i);
      }
    });
    return {
      deletion: "delete",
      selection: selection
    };
  }
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
/* harmony import */ var sketch_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch/dom */ "sketch/dom");
/* harmony import */ var sketch_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch_dom__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var sketch_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sketch/ui */ "sketch/ui");
/* harmony import */ var sketch_ui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sketch_ui__WEBPACK_IMPORTED_MODULE_1__);


var app = NSApplication.sharedApplication();
function message(message) {
  sketch_ui__WEBPACK_IMPORTED_MODULE_1___default.a.message(context.plugin.name() + ": " + message);
}
function createDialog(message, info, accessory, buttons) {
  var buttons = buttons || ['OK'];
  var alert = NSAlert.alloc().init();
  alert.setMessageText(message);
  alert.setInformativeText(info);
  buttons.map(function (button) {
    return alert.addButtonWithTitle(button);
  });

  if (context.plugin.alertIcon()) {
    alert.icon = context.plugin.alertIcon();
  }

  if (accessory) {
    alert.setAccessoryView(accessory);
    alert.window().setInitialFirstResponder(accessory);
  }

  return alert.runModal();
}
function createCombobox(items) {
  var accessory = NSComboBox.alloc().initWithFrame(NSMakeRect(0, 0, 240, 25));
  accessory.addItemsWithObjectValues(items);
  accessory.setEditable(true);
  accessory.setCompletes(true);
  return accessory;
}
function createSelect(items) {
  var accessory = NSPopUpButton.alloc().initWithFrame(NSMakeRect(0, 0, 240, 25));
  accessory.addItemsWithTitles(items);
  return accessory;
}
function createList(items) {
  var accessory = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 240, 120));
  var scrollView = NSScrollView.alloc().initWithFrame(NSMakeRect(0, 0, 240, 120));
  var scrollContent = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 240, items.length * 24 + 10));
  var options = [];
  items.map(function (item, i) {
    options[i] = NSButton.alloc().initWithFrame(NSMakeRect(5, 5 + i * 24, 200, 20));
    options[i].setButtonType(NSSwitchButton);
    options[i].setTitle(item);
    options[i].setState(false);
    scrollContent.addSubview(options[i]);
  });
  scrollContent.setFlipped(true);
  scrollView.setHasVerticalScroller(true);
  scrollView.setHasHorizontalScroller(false);
  scrollView.setDocumentView(scrollContent);
  accessory.addSubview(scrollView);
  return [accessory, options];
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

//# sourceMappingURL=delete-states.js.map