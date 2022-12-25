# Lovelace Notify (ll_notify)

ll_notify is a Home Assistant component that allows you to easily add notifications and alerts to a Lovelace dashboard.

![screen recording](screenshot.gif)

## Install

### Install manually

*Note - be sure to clone it into a directory named "ll_notify"!*

```bash
cd config/custom_components
git clone git@github.com:rr326/ha_ll_notify.git ll_notify

# Double-check
if [[  -d 'll_notify' ]]; then echo "Success" ; else echo "Error! Make sure the directory is called 'll_notify'" ; fi
```

### Install with HACS

1. Open **HACS**.
2. Click "Integrations".
2. Click on the 3 dots in the top right corner.
3. Select "Custom repositories".
4. Paste `https://github.com/rr326/ha_ll_notify` into the "Repository" field.
5. Select `Integration` from the "Category" field.
6. Click the "Add" button.
7. Click the "+ Explore & download repositories".
8. Search for "Lovelace Notify".
9. Click the "Download this repository to HACS" button.

## Configure

```yaml
# config/configuration.yaml

ll_notify:  # required
  defaults: # optional
    notifier:
      position: bottom-right
```

After installing and configuring, restart Home Assistant.

**Defaults** - Full list of defaults [here](https://alertifyjs.com/guide.html#defaults).

## Test

In your Home Assistant Dashboard, go to Developer Tools > Services. Under service, select "ll_notify.success", then click "GO TO YAML MODE". In the code box (the one with line numbers), type:

```yaml
service: ll_notify.success
data: { message: "test" }
```

Then click the "Call Service" button. If a notification appears on the screen, you are set.


If not, in your dashboard open your browser [developer tools](https://balsamiq.com/support/faqs/browserconsole/) window. At the top of the window you should see something like, 'll_notify: Successfully loaded.' If not, make sure you installed it properly. Check your HA logs. Or file an issue here.

## Example - Using in a Dashboard
In one of your Dashboards, click the three dots in the top right corner and select "Edit Dashboard". Click "ADD CARD" and select a Button card. Then in the card config, click "SHOW CODE EDITOR" and paste the following code:

```yaml
name: Success
type: button
tap_action:
  action: call-service
  service: ll_notify.success
  service_data:
    message: Test success
    wait: 2
```

Click "SAVE" and then click the new button to test it. Note that the alert won't be visible on the config page, you have to have a Dashboard open in another window to be able to see it. Another example: 

```yaml

# Complicated - with "callbacks"
  - type: button
    name: Success w/ callbacks
    tap_action:
        action: call-service
        service: ll_notify.success
        service_data:
            message: "Success w/ callbacks"
            wait: 1
            after_close:
                - action: call_service
                domain: ll_notify
                service: ping
                service_data:
                    field1: val1
                - action: fire_event
                event_name: fake_event
                event_data:
                    field1: val1
                - action: js_fire_event
                event_name: fake_js_event
                event_data:
                    field1: val1
```

## Services

`ll_notify` exposes several services and you can trigger notifications wherever you like. 

* `ll_notify.success`
* `ll_notify.error`
* `ll_notify.warning`
* `ll_notify.dismiss_all`

These are very simple to use, as documented above. (`dismiss_all` requires no `service_data`.)

Advanced

* `ll_notify.message`
* `ll_notify.notify`
* `ll_notify.alert`
* `ll_notify.confirm`

These are just a bit more complicated. See **Actions** below, and read about the parameters on the [AlertifyJS website](https://alertifyjs.com/). ll_notify will simply pass through `service_data` to Alertify. 

## Actions / "callbacks"

Alertify uses callbacks after a notification is dismissed, or after a confirm dialog is accepted or rejected. ll_notify instead implements 3 types of actions:

1. `call_service` - Call a Home Assistant service
2. `fire_event` - Fire a HomeAssistant event
3. `js_fire_event` - Fire a Javascript event, solely in the browser.

You can trigger one action, or multiple actions. See the example dashboard above.

## Missing Alertify features

Every AlertifyJS feature has not been implemented.

Alertify's [notifications](https://alertifyjs.com/notifier.html) are implemented fully and are quite easy to use.

Aleritify's [alerts](https://alertifyjs.com/alert.html) and [confirm dialogs](https://alertifyjs.com/confirm.html) are also implemented. You can set all the properties by sending key:value pairs in `service_data`, but most of the methods are not implemented.

Alertify's [prompt](https://alertifyjs.com/prompt.html) is not implemented at all.

## AppDaemon

If you used AppDaemon, check out my [AdPlus](https://github.com/rr326/adplus#ll_notify-helpers) helper functions. It makes adding a lovelace notification easy:

```python
self.ll_error('Whoops - your alarm failed to turn on. Better check it out!')
```
