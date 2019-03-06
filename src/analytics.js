import send from 'sketch-module-google-analytics'

const GA_TRACKING_ID = "UA-5738625-2"

export default function (context, label, value) {
  const payload = {}
  payload.ec = context.plugin.name()
  payload.ea = context.command.name()
  if (label) { payload.el = label }
  if (value) { payload.ev = value }
  return send(context, GA_TRACKING_ID, 'event', payload)
}
