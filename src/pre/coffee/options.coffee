# PROJECT: Better-Google-Tasks
#
# AUTHOR : Niklas Heer <niklas.heer@gmail.com>, Chris Wiegman
# DATE   : 6.04.2014
# LICENSE: GPL 3.0

###
Load options into support form
###
window.loadOptions = ->
	taskLists = chrome.extension.getBackgroundPage().taskLists
	hide_zero = localStorage.getItem("com.bit51.chrome.bettergoogletasks.hide_zero") or TASKS_ZERO
	default_count = localStorage.getItem("com.bit51.chrome.bettergoogletasks.default_count") or TASKS_COUNT
	countinterval = localStorage.getItem("com.bit51.chrome.bettergoogletasks.countinterval") or TASKS_COUNTINTERVAL
	count_list = localStorage.getItem("com.bit51.chrome.bettergoogletasks.count_list") or TASKS_LIST
	default_pop = localStorage.getItem("com.bit51.chrome.bettergoogletasks.default_pop") or TASKS_POPUP
	default_width = localStorage.getItem("com.bit51.chrome.bettergoogletasks.default_width") or TASKS_WIDTH
	default_height = localStorage.getItem("com.bit51.chrome.bettergoogletasks.default_height") or TASKS_HEIGHT
	notify = localStorage.getItem("com.bit51.chrome.bettergoogletasks.notify") or TASKS_NOTIFY
	openbehavior = localStorage.getItem("com.bit51.chrome.bettergoogletasks.openbehavior") or TASKS_OPENBEHAVIOR
	default_list = localStorage.getItem("com.bit51.chrome.bettergoogletasks.default_list") or TASKS_DEFAULT_LIST
	$("input[name=hide_zero]").val [hide_zero]
	$("input[name=default_count]").val [default_count]
	$("input[name=count_list]").val [count_list]
	$("input[name=default_pop]").val [default_pop]
	$("input[name=countinterval]").val countinterval
	$("input[name=default_width]").val default_width
	$("input[name=default_height]").val default_height
	$("input[name=notify]").val [notify]
	$("input[name=openbehavior]").val [openbehavior]
	i = 0

	while i < taskLists.length
		listSel = document.getElementById("lists")
		listSelected = false
		listSelected = true  if taskLists[i].id is default_list
		listSel.add new Option(taskLists[i].title, taskLists[i].id, listSelected), null
		i++
	setSelectByValue "opform", "default_list", default_list
	return

###
Save all options
###
window.saveOptions = ->
	default_count = $("input[name=default_count]:checked").val() or TASKS_COUNT
	hide_zero = $("input[name=hide_zero]:checked").val() or TASKS_ZERO
	default_pop = $("input[name=default_pop]:checked").val() or TASKS_POPUP
	count_list = $("input[name=count_list]:checked").val() or TASKS_LIST
	countinterval = $("input[name=countinterval]").val() or TASKS_COUNTINTERVAL
	default_list = $("select[name=default_list]").val() or TASKS_DEFAULT_LIST
	default_width = $("input[name=default_width]").val() or TASKS_WIDTH
	default_height = $("input[name=default_height]").val() or TASKS_HEIGHT
	notify = $("input[name=notify]:checked").val() or TASKS_NOTIFY
	openbehavior = $("input[name=openbehavior]:checked").val() or TASKS_OPENBEHAVIOR
	localStorage.setItem "com.bit51.chrome.bettergoogletasks.default_count", default_count
	localStorage.setItem "com.bit51.chrome.bettergoogletasks.hide_zero", hide_zero
	localStorage.setItem "com.bit51.chrome.bettergoogletasks.default_list", default_list
	localStorage.setItem "com.bit51.chrome.bettergoogletasks.countinterval", countinterval
	localStorage.setItem "com.bit51.chrome.bettergoogletasks.default_pop", default_pop
	localStorage.setItem "com.bit51.chrome.bettergoogletasks.count_list", count_list
	localStorage.setItem "com.bit51.chrome.bettergoogletasks.default_width", default_width
	localStorage.setItem "com.bit51.chrome.bettergoogletasks.default_height", default_height
	localStorage.setItem "com.bit51.chrome.bettergoogletasks.notify", notify
	localStorage.setItem "com.bit51.chrome.bettergoogletasks.openbehavior", openbehavior
	port = chrome.extension.connect(name: "BGT")
	port.postMessage message: "Update"
	$("div#saved").fadeIn("slow").delay(500).fadeOut "slow"
	return

###
Select default list

@param formName
@param elemName
@param defVal
@returns {boolean}
###
window.setSelectByValue = (formName, elemName, defVal) ->
	combo = document.forms[formName].elements[elemName]
	rv = false
	if combo.type is "select-one"
		i = 0

		while i < combo.options.length and combo.options[i].value isnt defVal
			i++
		combo.selectedIndex = i  if rv = (i isnt combo.options.length)
	rv

###
reset uptions to default
###
window.resetOptions = ->
	localStorage.removeItem "com.bit51.chrome.bettergoogletasks.default_count"
	localStorage.removeItem "com.bit51.chrome.bettergoogletasks.hide_zero"
	localStorage.removeItem "com.bit51.chrome.bettergoogletasks.default_list"
	localStorage.removeItem "com.bit51.chrome.bettergoogletasks.countinterval"
	localStorage.removeItem "com.bit51.chrome.bettergoogletasks.default_pop"
	localStorage.removeItem "com.bit51.chrome.bettergoogletasks.count_list"
	localStorage.removeItem "com.bit51.chrome.bettergoogletasks.default_width"
	localStorage.removeItem "com.bit51.chrome.bettergoogletasks.default_height"
	localStorage.removeItem "com.bit51.chrome.bettergoogletasks.notify"
	localStorage.removeItem "com.bit51.chrome.bettergoogletasks.notifyExp"
	localStorage.removeItem "com.bit51.chrome.bettergoogletasks.openbehavior"
	port = chrome.extension.connect(name: "BGT")
	port.postMessage message: "Update"
	window.close()
	return

$(document).ready ->
	loadOptions()
	$("#extVersion").prepend localStorage.getItem("com.bit51.chrome.bettergoogletasks.version")
	$("#saveOptions").click ->
		saveOptions()
		return

	$("#resetOptions").click ->
		resetOptions()
		return

	return
