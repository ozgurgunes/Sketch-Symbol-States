import UI from 'sketch/ui'

export function message(msg, status) {
  let emoji = ''
  switch (status) {
    case 'error':
      emoji = '⚠️   '
      break
    case 'success':
      emoji = '✅   '
      break
  }
  UI.message(emoji + context.command.name() + ': ' + msg)
}

export function error(msg) {
  return message(msg, 'error')
}

export function success(msg) {
  return message(msg, 'success')
}

export function dialog(info, accessory, buttons, message) {
  buttons = buttons || ['OK']
  message = message || context.command.name()
  var alert = NSAlert.alloc().init()
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

export function comboBox(items) {
  let accessory = NSComboBox.alloc().initWithFrame(NSMakeRect(0, 0, 240, 25))
  accessory.addItemsWithObjectValues(items)
  accessory.setEditable(true)
  accessory.setCompletes(true)
  return accessory
}

export function scrollView(view) {
  let accessory = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 120))
  let scrollView = NSScrollView.alloc().initWithFrame(
    NSMakeRect(0, 0, 300, 120)
  )
  scrollView.setHasVerticalScroller(true)
  scrollView.setHasHorizontalScroller(false)
  scrollView.setDocumentView(view)
  accessory.addSubview(scrollView)
  return accessory
}

export function optionList(items) {
  let listView = NSView.alloc().initWithFrame(
    NSMakeRect(0, 0, 300, items.length * 24 + 10)
  )
  let options = []
  items.map((item, i) => {
    options[i] = NSButton.alloc().initWithFrame(
      NSMakeRect(5, 5 + i * 24, 290, 20)
    )
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

export function errorList(items) {
  let listView = NSView.alloc().initWithFrame(
    NSMakeRect(0, 0, 300, items.length * 24 + 10)
  )
  let font = NSFont.systemFontOfSize(NSFont.smallSystemFontSize())
  let errors = []
  items.map((item, i) => {
    errors[i] = NSTextView.alloc().initWithFrame(
      NSMakeRect(5, 10 + i * 24, 290, 20)
    )
    errors[i].insertText(item)
    errors[i].setFont(font)
    errors[i].setEditable(false)
    listView.addSubview(errors[i])
  })
  listView.setFlipped(true)
  return listView
}
