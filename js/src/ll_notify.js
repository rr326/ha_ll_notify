import "./css/default.css"
import "./css/alertify.css"

import { doSetDefaults } from "./setDefaults"
import { subscribeNotifyEvents } from "./notify"
import { subscribeAlertEvents } from "./alert"
import { subscribeConfirmEvents } from "./confirm"
import { subscribePingEvent } from "./ping"
import * as debug from "./debug"
import { getHassConn } from "./getHassConn"

import alertify from "alertifyjs"
import { version } from "../package.json"
window.alertify = alertify // Needed as a window global

let hassConn = null

/**
 * Initialize alertify & websocket listeners
 */
getHassConn()
  .then((conn) => {
    hassConn = conn
    return hassConn
  })
  .then((hassConn) => {
    return hassConn.subscribeEvents(doSetDefaults, "ll_notify/get_defaults")
  })
  .then(() => {
    hassConn.sendMessage({
      type: "call_service",
      domain: "ll_notify",
      service: "get_defaults",
    })
  })
  .then(() => {
    subscribeNotifyEvents(hassConn)
    subscribeAlertEvents(hassConn)
    subscribeConfirmEvents(hassConn)
    subscribePingEvent(hassConn)
  })
  .then(() => {
    console.log(`ll_notify: Successfully loaded. v${version}`)
    // debugging
    debug.set_globals(hassConn)
    // debug.do_5sec_test();
  })
