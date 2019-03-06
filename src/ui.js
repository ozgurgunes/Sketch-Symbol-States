import sketch from 'sketch/dom'
import UI from "sketch/ui"

var app = NSApplication.sharedApplication()

export function message(message) {
  UI.message(context.plugin.name() + ": " + message)
}

export function createDialog(message, info, accessory, buttons) {
  var buttons = buttons || ['OK']
  var alert = NSAlert.alloc().init()
  alert.setMessageText(message)
  alert.setInformativeText(info)
  buttons.map(button => alert.addButtonWithTitle(button))
  if (context.plugin.alertIcon()) {
    alert.icon = context.plugin.alertIcon()
  }
  if (accessory) {
    alert.setAccessoryView(accessory)
    alert.window().setInitialFirstResponder(accessory)
  }
  return alert.runModal()
}

export function createCombobox(items) {
  var accessory = NSComboBox.alloc().initWithFrame(NSMakeRect(0, 0, 240, 25))
  accessory.addItemsWithObjectValues(items)
  accessory.setEditable(true)
  accessory.setCompletes(true)
  return accessory
}

export function createSelect(items) {
  var accessory = NSPopUpButton.alloc().initWithFrame(NSMakeRect(0, 0, 240, 25))
  accessory.addItemsWithTitles(items)
  return accessory
}

export function createList(items) {
  var accessory = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 240, 120))
  var scrollView = NSScrollView.alloc().initWithFrame(NSMakeRect(0, 0, 240, 120))
  var scrollContent = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 240, items.length * 24 + 10))
  var options = [];
  items.map((item, i) => {
    options[i] = NSButton.alloc().initWithFrame(NSMakeRect(5, 5 + i * 24, 200, 20));
    options[i].setButtonType(NSSwitchButton);
    options[i].setTitle(item);
    options[i].setState(false);
    scrollContent.addSubview(options[i]);
  })
  scrollContent.setFlipped(true);
  scrollView.setHasVerticalScroller(true);
  scrollView.setHasHorizontalScroller(false);
  scrollView.setDocumentView(scrollContent);
  accessory.addSubview(scrollView)
  return [accessory, options]
}
