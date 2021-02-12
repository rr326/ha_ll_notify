#
# Needed for development only
#
# Requires: gnu make, node / npm, yarn, ffmpeg (for making screenshot gif)
#

.PHONY: help
help:
	@echo
	@echo "Make Targets"
	@echo "============"
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'
	@echo

clean_python:
	@echo "\n*************"
	@echo "Reformat python"
	@echo "Don't do this yet - integrating with HACORE formatting process"

	autoflake --in-place --remove-all-unused-imports --remove-unused-variables --recursive  --exclude "js" .
	isort  --multi-line 2 --skip js .
	black  --exclude 'js/'

clean_js:
	@echo "\n*************"
	@echo "Reformat JS"
	cd js ; npm run fix

clean: clean_js clean_python

build:
	@echo "\n*************"
	@echo "Build Frontend"
	cd js ; npm run build

install:
	cd js; yarn install

screenshot.gif: tmp/screen_recording.mov
	@echo "Create a screen recording (sh-cmd-5 on MacOS) and save in tmp/screen_recording.mov"
	ffmpeg -i tmp/screen_recording.mov -vf "fps=15,scale=640:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse"  -loop 0 screenshot.gif
	ls -lh screenshot.gif

