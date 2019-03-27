import settings from 'sketch/settings'

export default (label, value) => {
  let analyticsAllowed = (settings.settingForKey('analyticsAllowed')) || false

  if (analyticsAllowed != true) {
    let dialog = NSAlert.alloc().init()
    if (context.plugin.alertIcon()) {
      dialog.icon = context.plugin.alertIcon()
    }
    dialog.setMessageText('Allow Google Analytics')
    dialog.setInformativeText(
      'Please allow ' + context.plugin.name() + ' ' +
        'plugin to use Google Analytics for tracking statistics.'
    )
    dialog.addButtonWithTitle('Allow')
    dialog.addButtonWithTitle('Disallow')
    let response = dialog.runModal()
    if (response == 1000) {
      analyticsAllowed = true
      settings.setSettingForKey('analyticsAllowed', analyticsAllowed)
    }
  }

  if (analyticsAllowed) {
    return analytics(label, value)
  }
}

const analytics = (label, value) => {
  let kUUIDKey = 'google.analytics.uuid'
  let uuid = NSUserDefaults.standardUserDefaults().objectForKey(kUUIDKey)
  if (!uuid) {
    uuid = NSUUID.UUID().UUIDString()
    NSUserDefaults.standardUserDefaults().setObject_forKey(uuid, kUUIDKey)
    NSUserDefaults.standardUserDefaults().synchronize()
  }

  let payload = {
    v: 1,
    tid: 'UA-5738625-2',
    ds: 'Sketch ' + MSApplicationMetadata.metadata().appVersion,
    cid: uuid,
    t: 'event',
    an: context.plugin.name(),
    aid: context.plugin.identifier(),
    av: context.plugin.version(),
    ec: context.plugin.name(),
    ea: context.command.name()
  }
  if (label) { payload.el = label }
  if (value) { payload.ev = value }

  let url = NSURL.URLWithString(
    NSString.stringWithFormat('https://www.google-analytics.com/collect%@',
      jsonToQueryString(payload))
  )

  console.log(context.command.name())
  console.log(url)

  if (url) {
    NSURLSession.sharedSession().dataTaskWithURL(url).resume()
  }
}

const jsonToQueryString = json => {
  return '?' + Object.keys(json).map(key => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
  }).join('&')
}
