import sketch from 'sketch/dom'
import UI from "sketch/ui"

export const message = message => {
  UI.message(context.command.name() + ": " + message)
}

export const dialog = (message, info, accessory, buttons) => {
  var buttons = buttons || ['OK'],
    alert = NSAlert.alloc().init()
  alert.setMessageText(message)
  alert.setInformativeText(info)
  buttons.map(button => alert.addButtonWithTitle(button))
  if (context.plugin.alertIcon()) {
    alert.icon = context.plugin.alertIcon()
  }
  if (accessory) {
    alert.setAccessoryView(accessory)
    if (!accessory.isMemberOfClass(NSTextView)) {
      alert.window().setInitialFirstResponder(accessory)
    }
  }
  return alert.runModal()
}

export const comboBox = items => {
  let accessory = NSComboBox.alloc()
    .initWithFrame(NSMakeRect(0, 0, 240, 25))
  accessory.addItemsWithObjectValues(items)
  accessory.setEditable(true)
  accessory.setCompletes(true)
  return accessory
}

export const popUpButton = items => {
  let accessory = NSPopUpButton.alloc()
    .initWithFrame(NSMakeRect(0, 0, 240, 25))
  accessory.addItemsWithTitles(items)
  return accessory
}

export const scrollView = view => {
  let accessory = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 280, 120)),
    scrollView = NSScrollView.alloc()
    .initWithFrame(NSMakeRect(0, 0, 280, 120))
  scrollView.setHasVerticalScroller(true)
  scrollView.setHasHorizontalScroller(false)
  scrollView.setDocumentView(view)
  accessory.addSubview(scrollView)
  return accessory
}

export const optionList = items => {
  let listView = NSView.alloc()
    .initWithFrame(NSMakeRect(0, 0, 270, items.length * 24 + 10)),
    options = []
  items.map((item, i) => {
    options[i] = NSButton.alloc()
      .initWithFrame(NSMakeRect(5, 5 + i * 24, 270, 20))
    options[i].setButtonType(NSSwitchButton)
    options[i].setTitle(item)
    options[i].setState(false)
    listView.addSubview(options[i])
    listView.setFlipped(true)
  })
  return {
    options: options,
    view: listView
  }
}

export const errorList = items => {
  let listView = NSView.alloc()
    .initWithFrame(NSMakeRect(0, 0, 280, items.length * 24 + 10)),
    font = NSFont.systemFontOfSize(NSFont.smallSystemFontSize()),
    errors = []
  items.map((item, i) => {
    errors[i] = NSTextView.alloc()
      .initWithFrame(NSMakeRect(5, 10 + i * 24, 270, 20))
    errors[i].insertText(item)
    errors[i].setFont(font)
    errors[i].setEditable(false)
    listView.addSubview(errors[i])
  })
  listView.setFlipped(true)
  return listView
}
