"""
Automatically insert `ll_notify.js` into the Lovelace frontend.

This trick is taken from here:
https://github.com/thomasloven/hass-browser_mod/blob/master/custom_components/browser_mod/mod_view.py
"""
import logging
import asyncio

from aiohttp import web

from homeassistant.components.http import HomeAssistantView

from .const import DATA_EXTRA_MODULE_URL, FRONTEND_SCRIPT_URL, SCRIPT_PATH, VIEW_NAME

_LOGGER = logging.getLogger(__name__)


async def auto_load_ll_notify_js(hass, config):
    """Auto-load ll_notify.js in frontend."""
    # Will autoload anything named 'frontend_extra_module_url'
    if DATA_EXTRA_MODULE_URL not in hass.data:
        hass.data[DATA_EXTRA_MODULE_URL] = set()
    hass.data[DATA_EXTRA_MODULE_URL].add(FRONTEND_SCRIPT_URL)

    hass.http.register_view(ModView(hass, FRONTEND_SCRIPT_URL))
    return True


class ModView(HomeAssistantView):
    """View for ll_notify.js."""

    name = VIEW_NAME
    requires_auth = False

    def __init__(self, hass, url):
        """Init."""
        self.url = url

    async def get(self, request):
        """Get."""
        try:
            # filecontent = SCRIPT_PATH.read_text(encoding="utf-8", errors="ignore")

            loop = asyncio.get_running_loop()
            filecontent = await loop.run_in_executor(
                None, lambda: SCRIPT_PATH.read_text(encoding="utf-8", errors="ignore")
            )
        except (FileNotFoundError, PermissionError) as err:
            _LOGGER.error("Unable to read %s. Err: %s", str(SCRIPT_PATH), str(err))
            filecontent = ""
            return 
        except Exception as e:
            _LOGGER.error(f"Unexpected error serving ll_notify.js. err:{e}")
            return

        return web.Response(
            body=filecontent, content_type="text/javascript", charset="utf-8"
        )
