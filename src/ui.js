// import sketch from 'sketch'
// documentation: https://developer.sketchapp.com/reference/api/

var sketch = require('sketch/dom'),
  UI = require('sketch/ui'),
  app = NSApplication.sharedApplication(),
  defaults = require('./defaults')

export function message(message) {
  UI.message(defaults.PLUGIN_NAME + ": " + message)
}

export function createDialog(message, info, accessory, buttons) {
  buttons = buttons || ['OK']
  var alert = NSAlert.alloc().init()
  alert.setMessageText(message)
  alert.setInformativeText(info)
  buttons.forEach(function(data) {
    alert.addButtonWithTitle(data)
  })
  if (accessory) {
    alert.setAccessoryView(accessory)
    alert.window().setInitialFirstResponder(accessory)
  }
  return alert.runModal()
}

export function createCombobox(msg, info, items, selectedItemIndex) {
  var buttons = ['Save', 'Cancel']
  var accessory = NSComboBox.alloc().initWithFrame(NSMakeRect(0, 0, 240, 25))
  accessory.addItemsWithObjectValues(items)
    // accessory.addItemsWithTitles(items)
    //accessory.selectItemAtIndex(selectedItemIndex)
  accessory.setEditable(true)
  //accessory.setCompletes(true)

  var response = createDialog(msg, info, accessory, buttons)
  var result = accessory.stringValue()
  if (response === 1000) {
    if (!result.length() > 0) {
      app.displayDialog("Please give a name to new symbol state");
      items.shift()
      return createCombobox(msg, info, items, selectedItemIndex)
    }
    return result
  }
}

export function createSelect(msg, info, items, selectedItemIndex) {
  var buttons = ['Apply', 'Cancel']
  var accessory = NSPopUpButton.alloc().initWithFrame(NSMakeRect(0, 0, 240, 25))
  //accessory.addItemsWithObjectValues(items)
  accessory.addItemsWithTitles(items)
  //accessory.selectItemAtIndex(selectedItemIndex)
  // accessory.setEditable(true)
  //accessory.setCompletes(true)

  var response = createDialog(msg, info, accessory, buttons)
  var result = {
    index: accessory.indexOfSelectedItem(),
    title: accessory.titleOfSelectedItem()
  }
  if (response === 1000) {
    return result
  }
}

export function createList(msg, info, items, selectedItemIndex) {
  items.sort()
  selectedItemIndex = selectedItemIndex || 0
  var buttons = ['Delete', 'Cancel', 'Delete All']

  var accessory = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 240, 120))
  var scrollView = NSScrollView.alloc().initWithFrame(NSMakeRect(0, 0, 240, 120))
  var scrollContent = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 240, items.length * 24 + 10))

  var states = [];
  items.forEach(function(stateName, i) {
    states[i] = NSButton.alloc().initWithFrame(NSMakeRect(5, 5 + i * 24, 200, 20));
    states[i].setButtonType(NSSwitchButton);
    states[i].setTitle(stateName);
    states[i].setState(false);
    scrollContent.addSubview(states[i]);
  })

  scrollContent.setFlipped(true);
  scrollView.setHasVerticalScroller(true);
  scrollView.setHasHorizontalScroller(false);
  scrollView.setDocumentView(scrollContent);

  accessory.addSubview(scrollView)

  var response = createDialog(msg, info, accessory, buttons)
  var selection = []
  if (response === 1002) {
    var confirmed = createDialog('Are you sure?', 'All symbol states will be deleted!')
    if (confirmed === 1000) {
      states.forEach(function(state, i) {
        //selection.push(state.title())
        selection.push(i)
      })
      return selection
    }
  }
  if (response === 1000) {
    states.forEach(function(state, i) {
      if (state.state()) {
        selection.push(i)
      }
    })
    return selection
  }
}
