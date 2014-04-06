# PROJECT: Google-Tasks-Evolved
#
# AUTHOR : Niklas Heer <niklas.heer@gmail.com>
# DATE   : 6.04.2014
# LICENSE: GPL 2.0

$(document).ready ->
	localStorage.removeItem "de.wedevelop.chrome.googletasksevolved.last_notify"
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
	localStorage.setItem "de.wedevelop.chrome.googletasksevolved.version", manifest.version
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
