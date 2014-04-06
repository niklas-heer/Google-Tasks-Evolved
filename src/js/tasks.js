/*
Find the current tab

@param callback a callback function
*/


(function() {
  window.getTasksTab = function(callback) {
    chrome.tabs.getAllInWindow(undefined, function(tabs) {
      var i, tab;
      i = 0;
      tab = void 0;
      while (tab = tabs[i]) {
        if (tab.url && TASKS_URL_RE_.test(tab.url)) {
          callback(tab);
          return;
        }
        i++;
      }
      callback(null);
    });
  };

  /*
  Handle opening tasks in new window or new tab
  */


  window.openTasks = function() {
    var defaultlist, openbehavior;
    openbehavior = localStorage.getItem("com.bit51.chrome.bettergoogletasks.openbehavior") || TASKS_OPENBEHAVIOR;
    defaultlist = localStorage.getItem("com.bit51.chrome.bettergoogletasks.default_list") || TASKS_DEFAULT_LIST;
    if (openbehavior === "1") {
      if (defaultlist !== "") {
        chrome.windows.create({
          url: "https://mail.google.com/tasks/canvas?listid=" + defaultlist
        });
      } else {
        chrome.windows.create({
          url: "https://mail.google.com/tasks/canvas"
        });
      }
    } else {
      if (defaultlist !== "") {
        chrome.tabs.create({
          url: "https://mail.google.com/tasks/canvas?listid=" + defaultlist
        });
      } else {
        chrome.tabs.create({
          url: "https://mail.google.com/tasks/canvas"
        });
      }
    }
    window.close();
  };

  window.printTasks = function() {
    getTasksTab(function(tab) {
      if (tab) {
        chrome.tabs.update(tab.id, {
          selected: true
        });
      } else {
        chrome.tabs.create({
          url: "/html/print.html"
        });
      }
      window.close();
    });
  };

  window.closeTasks = function() {
    window.close();
  };

  /*
  setup the popup
  */


  window.getTaskFrame = function() {
    var address, default_height, default_pop, default_width, defaultlist, footer, frame, port, url;
    chrome.extension.onConnect.addListener(function(port) {
      console.assert(port.name === "BGTOpen");
    });
    port = chrome.extension.connect({
      name: "BGT"
    });
    port.postMessage({
      message: "Open"
    });
    address = void 0;
    defaultlist = localStorage.getItem("com.bit51.chrome.bettergoogletasks.default_list") || TASKS_DEFAULT_LIST;
    default_pop = localStorage.getItem("com.bit51.chrome.bettergoogletasks.default_pop") || TASKS_POPUP;
    default_width = localStorage.getItem("com.bit51.chrome.bettergoogletasks.default_width") || TASKS_WIDTH;
    default_height = localStorage.getItem("com.bit51.chrome.bettergoogletasksJSON.parseeval.default_height") || TASKS_HEIGHT;
    if (default_pop === "full") {
      address = "https://mail.google.com/tasks/canvas";
    } else {
      address = "https://mail.google.com/tasks/ig";
    }
    if (defaultlist !== "") {
      url = address + "?listid=" + defaultlist;
    } else {
      url = address;
    }
    frame = document.createElement("iframe");
    frame.setAttribute("width", default_width);
    frame.setAttribute("height", default_height);
    frame.setAttribute("frameborder", "0");
    frame.setAttribute("src", url);
    document.getElementById("content").appendChild(frame);
    footer = document.getElementById("footer");
    footer.style.width = default_width - 6;
  };

  $(document).ready(function() {
    var openbehavior;
    getTaskFrame();
    openbehavior = localStorage.getItem("com.bit51.chrome.bettergoogletasks.openbehavior") || TASKS_OPENBEHAVIOR;
    if (openbehavior === "1") {
      $("#footer").prepend("<span id=\"windowLink\" class=\"link\">Open in New Window <img src=\"/images/external.png\" alt=\"Open tasks in a new window\" /></span> | ");
    } else {
      $("#footer").prepend("<span id=\"windowLink\" class=\"link\">Open in New Tab <img src=\"/images/external.png\" alt=\"Open tasks in a new tab\" /></span> | ");
    }
    $("#windowLink").click(function() {
      openTasks();
    });
    $("#printLink").click(function() {
      printTasks();
    });
    $("#optionsLink").click(function() {
      chrome.tabs.create({
        url: chrome.extension.getURL("/html/options.html")
      });
    });
    $("#closeLink").click(function() {
      closeTasks();
    });
  });

}).call(this);
