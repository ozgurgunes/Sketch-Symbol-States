import send from 'sketch-module-google-analytics'
import * as defaults from './defaults.js'

export default function (context, action, label, value) {
  const payload = {}
  payload.ec = defaults.PLUGIN_NAME
  if (action) { payload.ea = action }
  if (label) { payload.el = label }
  if (value) { payload.ev = value }
  return send(context, defaults.GA_TRACKING_ID, 'event', payload)
}
