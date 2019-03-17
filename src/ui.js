import sketch from 'sketch/dom'
import UI from "sketch/ui"

export const message = (msg, status) => {
  let emoji = ""
  switch (status) {
  case "error":
    emoji = "⚠️   "
    break;
  case "success":
    emoji = "✅   "
    break;
  }
  UI.message(emoji + context.command.name() + ": " + msg)
}

export const error = msg => message(msg, "error")
export const success = msg => message(msg, "success")

export const dialog = (info, accessory, buttons, message) => {
  var buttons = buttons || ['OK'],
    message = message || context.command.name(),
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
  let accessory = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 120)),
    scrollView = NSScrollView.alloc()
    .initWithFrame(NSMakeRect(0, 0, 300, 120))
  scrollView.setHasVerticalScroller(true)
  scrollView.setHasHorizontalScroller(false)
  scrollView.setDocumentView(view)
  accessory.addSubview(scrollView)
  return accessory
}

export const optionList = items => {
  let listView = NSView.alloc()
    .initWithFrame(NSMakeRect(0, 0, 300, items.length * 24 + 10)),
    options = []
  items.map((item, i) => {
    options[i] = NSButton.alloc()
      .initWithFrame(NSMakeRect(5, 5 + i * 24, 290, 20))
    options[i].setButtonType(NSSwitchButton)
    options[i].setTitle(item)
    options[i].setState(false)
    listView.addSubview(options[i])
    listView.setFlipped(true)
  })
  return {
    options: options,
    view: listView,
    getSelection: () => {
    let selection = []
    options.map((option, i) => {
      if (option.state()) {
        selection.push(i)
      }
    })
    return selection
  }
  }
}

export const errorList = items => {
  let listView = NSView.alloc()
    .initWithFrame(NSMakeRect(0, 0, 300, items.length * 24 + 10)),
    font = NSFont.systemFontOfSize(NSFont.smallSystemFontSize()),
    errors = []
  items.map((item, i) => {
    errors[i] = NSTextView.alloc()
      .initWithFrame(NSMakeRect(5, 10 + i * 24, 290, 20))
    errors[i].insertText(item)
    errors[i].setFont(font)
    errors[i].setEditable(false)
    listView.addSubview(errors[i])
  })
  listView.setFlipped(true)
  return listView
}
