export function set_globals(conn) {
  // conn is already resolved by the caller — set immediately, no race
  window.hassConn = conn

  // window.hass is a separate debug convenience; the <home-assistant>
  // element's .hass property is populated asynchronously after auth,
  // so poll for it.
  const tryAttach = () => {
    const haEl = document.querySelector("home-assistant")
    if (haEl && haEl.hass) {
      window.hass = haEl.hass
    } else {
      setTimeout(tryAttach, 500)
    }
  }
  tryAttach()
}

export function do_5sec_test() {
  let hassConn = document.querySelector("home-assistant").hass.connection
  window.setInterval(() => {
    hassConn.sendMessage({
      type: "call_service",
      domain: "ll_notify",
      service: "success",
      service_data: {
        message: "TEST: from FRONTEND",
        wait: 5
      }
    })
  }, 5000)
}
