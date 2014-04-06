# PROJECT: Better-Google-Tasks
#
# AUTHOR : Niklas Heer <niklas.heer@gmail.com>, Chris Wiegman
# DATE   : 6.04.2014
# LICENSE: GPL 3.0

$(document).ready ->
	localStorage.removeItem "com.bit51.chrome.bettergoogletasks.last_notify"
	address = "https://mail.google.com/tasks/m"
	frame = document.createElement("iframe")
	frame.setAttribute "src", address
	frame.setAttribute "id", "tasksPage"
	document.getElementById("content").appendChild frame
	return


#Initialize the extension
updateData()

#Set the extension version
getManifest (manifest) ->
	localStorage.setItem "com.bit51.chrome.bettergoogletasks.version", manifest.version
	return

#Set up the appropriate listeners
chrome.extension.onConnect.addListener (port) ->
	console.assert port.name is "BGT"
	port.onMessage.addListener (msg) ->
		if msg.message is "Update"
			updateData()
		else inOpen()  if msg.message is "Open"
		return
	return
