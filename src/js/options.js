/*
Load options into support form
*/


(function() {
  window.loadOptions = function() {
    var count_list, countinterval, default_count, default_height, default_list, default_pop, default_width, hide_zero, i, listSel, listSelected, notify, openbehavior, taskLists;
    taskLists = chrome.extension.getBackgroundPage().taskLists;
    hide_zero = localStorage.getItem("de.wedevelop.chrome.googletasksevolved.hide_zero") || TASKS_ZERO;
    default_count = localStorage.getItem("de.wedevelop.chrome.googletasksevolved.default_count") || TASKS_COUNT;
    countinterval = localStorage.getItem("de.wedevelop.chrome.googletasksevolved.countinterval") || TASKS_COUNTINTERVAL;
    count_list = localStorage.getItem("de.wedevelop.chrome.googletasksevolved.count_list") || TASKS_LIST;
    default_pop = localStorage.getItem("de.wedevelop.chrome.googletasksevolved.default_pop") || TASKS_POPUP;
    default_width = localStorage.getItem("de.wedevelop.chrome.googletasksevolved.default_width") || TASKS_WIDTH;
    default_height = localStorage.getItem("de.wedevelop.chrome.googletasksevolved.default_height") || TASKS_HEIGHT;
    notify = localStorage.getItem("de.wedevelop.chrome.googletasksevolved.notify") || TASKS_NOTIFY;
    openbehavior = localStorage.getItem("de.wedevelop.chrome.googletasksevolved.openbehavior") || TASKS_OPENBEHAVIOR;
    default_list = localStorage.getItem("de.wedevelop.chrome.googletasksevolved.default_list") || TASKS_DEFAULT_LIST;
    $("input[name=hide_zero]").val([hide_zero]);
    $("input[name=default_count]").val([default_count]);
    $("input[name=count_list]").val([count_list]);
    $("input[name=default_pop]").val([default_pop]);
    $("input[name=countinterval]").val(countinterval);
    $("input[name=default_width]").val(default_width);
    $("input[name=default_height]").val(default_height);
    $("input[name=notify]").val([notify]);
    $("input[name=openbehavior]").val([openbehavior]);
    i = 0;
    while (i < taskLists.length) {
      listSel = document.getElementById("lists");
      listSelected = false;
      if (taskLists[i].id === default_list) {
        listSelected = true;
      }
      listSel.add(new Option(taskLists[i].title, taskLists[i].id, listSelected), null);
      i++;
    }
    setSelectByValue("opform", "default_list", default_list);
  };

  /*
  Save all options
  */


  window.saveOptions = function() {
    var count_list, countinterval, default_count, default_height, default_list, default_pop, default_width, hide_zero, notify, openbehavior, port;
    default_count = $("input[name=default_count]:checked").val() || TASKS_COUNT;
    hide_zero = $("input[name=hide_zero]:checked").val() || TASKS_ZERO;
    default_pop = $("input[name=default_pop]:checked").val() || TASKS_POPUP;
    count_list = $("input[name=count_list]:checked").val() || TASKS_LIST;
    countinterval = $("input[name=countinterval]").val() || TASKS_COUNTINTERVAL;
    default_list = $("select[name=default_list]").val() || TASKS_DEFAULT_LIST;
    default_width = $("input[name=default_width]").val() || TASKS_WIDTH;
    default_height = $("input[name=default_height]").val() || TASKS_HEIGHT;
    notify = $("input[name=notify]:checked").val() || TASKS_NOTIFY;
    openbehavior = $("input[name=openbehavior]:checked").val() || TASKS_OPENBEHAVIOR;
    localStorage.setItem("de.wedevelop.chrome.googletasksevolved.default_count", default_count);
    localStorage.setItem("de.wedevelop.chrome.googletasksevolved.hide_zero", hide_zero);
    localStorage.setItem("de.wedevelop.chrome.googletasksevolved.default_list", default_list);
    localStorage.setItem("de.wedevelop.chrome.googletasksevolved.countinterval", countinterval);
    localStorage.setItem("de.wedevelop.chrome.googletasksevolved.default_pop", default_pop);
    localStorage.setItem("de.wedevelop.chrome.googletasksevolved.count_list", count_list);
    localStorage.setItem("de.wedevelop.chrome.googletasksevolved.default_width", default_width);
    localStorage.setItem("de.wedevelop.chrome.googletasksevolved.default_height", default_height);
    localStorage.setItem("de.wedevelop.chrome.googletasksevolved.notify", notify);
    localStorage.setItem("de.wedevelop.chrome.googletasksevolved.openbehavior", openbehavior);
    port = chrome.extension.connect({
      name: "BGT"
    });
    port.postMessage({
      message: "Update"
    });
    $("div#saved").fadeIn("slow").delay(500).fadeOut("slow");
  };

  /*
  Select default list
  
  @param formName
  @param elemName
  @param defVal
  @returns {boolean}
  */


  window.setSelectByValue = function(formName, elemName, defVal) {
    var combo, i, rv;
    combo = document.forms[formName].elements[elemName];
    rv = false;
    if (combo.type === "select-one") {
      i = 0;
      while (i < combo.options.length && combo.options[i].value !== defVal) {
        i++;
      }
      if (rv = i !== combo.options.length) {
        combo.selectedIndex = i;
      }
    }
    return rv;
  };

  /*
  reset uptions to default
  */


  window.resetOptions = function() {
    var port;
    localStorage.removeItem("de.wedevelop.chrome.googletasksevolved.default_count");
    localStorage.removeItem("de.wedevelop.chrome.googletasksevolved.hide_zero");
    localStorage.removeItem("de.wedevelop.chrome.googletasksevolved.default_list");
    localStorage.removeItem("de.wedevelop.chrome.googletasksevolved.countinterval");
    localStorage.removeItem("de.wedevelop.chrome.googletasksevolved.default_pop");
    localStorage.removeItem("de.wedevelop.chrome.googletasksevolved.count_list");
    localStorage.removeItem("de.wedevelop.chrome.googletasksevolved.default_width");
    localStorage.removeItem("de.wedevelop.chrome.googletasksevolved.default_height");
    localStorage.removeItem("de.wedevelop.chrome.googletasksevolved.notify");
    localStorage.removeItem("de.wedevelop.chrome.googletasksevolved.notifyExp");
    localStorage.removeItem("de.wedevelop.chrome.googletasksevolved.openbehavior");
    port = chrome.extension.connect({
      name: "BGT"
    });
    port.postMessage({
      message: "Update"
    });
    window.close();
  };

  $(document).ready(function() {
    loadOptions();
    $("#extVersion").prepend(localStorage.getItem("de.wedevelop.chrome.googletasksevolved.version"));
    $("#saveOptions").click(function() {
      saveOptions();
    });
    $("#resetOptions").click(function() {
      resetOptions();
    });
  });

}).call(this);
