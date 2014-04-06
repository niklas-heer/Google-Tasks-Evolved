# PROJECT: Better-Google-Tasks
#
# AUTHOR : Niklas Heer <niklas.heer@gmail.com>, Chris Wiegman
# DATE   : 6.04.2014
# LICENSE: GPL 3.0

#load print content safely

###
Get Task items for printing
###
getPrint = ->
	url = "https://mail.google.com/tasks/ig?listid="
	murl = "https://mail.google.com/tasks/m"
	$.ajax
		type: "GET"
		url: murl
		async: false
		data: null
		dataType: "html"
		success: (html) ->
			listids = []
			listtitles = []
			startpos = undefined
			strlength = undefined
			str = undefined
			currid = undefined
			currtitle = undefined
			i = undefined
			today = new Date()
			yy = today.getFullYear()
			mm = today.getMonth() + 1
			dd = today.getDate()
			output = "<h1>Task list printed " + mm + "/" + dd + "/" + yy + "</h1>"
			output = output + "<ul>"
			str = html
			strlength = str.length
			startpos = str.indexOf("<option value=")
			i = 0
			while strlength > 0 and startpos > -1
				str = str.substr(startpos + 15, strlength)
				strlength = str.length
				currid = str.substr(0, str.indexOf("\""))
				str = str.substr(str.indexOf(">") + 1, strlength)
				currtitle = str.substr(0, str.indexOf("</option>"))
				strlength = str.length
				startpos = str.indexOf("<option value=")
				if listids.length > 0
					j = 0

					while j < listids.length
						currid = -1  if listids[j] is currid
						j++
				else
					listids[i] = currid
					listtitles[i] = currtitle
				unless currid is -1
					listids[i] = currid
					listtitles[i] = currtitle
				i++
			l = 0

			while l < listids.length
				output = output + "<li class=\"list\">"
				output = output + "<h2>" + listtitles[l] + "</h2>"
				output = output + "<ul>"
				$.ajax
					type: "GET"
					url: url + listids[l]
					async: false
					data: null
					dataType: "html"
					success: (html) ->
						if html.match(/_setup\((.*)\)\}/)
							data = JSON.parse(RegExp.$1)
							odd = false
							$.each data.t.tasks, (i, val) ->
								if val.name.length > 0
									if odd
										output = output + "<li class=\"task\">"
										odd = false
									else
										output = output + "<li class=\"task even\">"
										odd = true
									output = output + "<s>"  if val.completed
									output = output + "<h3>" + val.name + "</h3>"
									if val.task_date
										month = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")
										eyear = val.task_date.substr(0, 4)
										emonth = val.task_date.substr(4, 2) - 1
										eday = val.task_date.substr(6, 2)
										output = output + "<span class=\"due\">Due: " + month[emonth] + " " + eday + ", " + eyear + "</span>"
									output = output + "<span class=\"notes\">" + val.notes + "</span>"  if val.notes
									output = output + "</s>"  if val.completed
									output = output + "</li>"
								return

						return

				output = output + "</ul>"
				output = output + "</li>"
				l++
			output = output + "</ul>"
			document.write output
			return

	return
$(document).ready ->
	$("body").append getPrint()
	return
