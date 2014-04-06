(function() {
  $(document).ready(function() {
    var address, frame;
    localStorage.removeItem("com.bit51.chrome.bettergoogletasks.last_notify");
    address = "https://mail.google.com/tasks/m";
    frame = document.createElement("iframe");
    frame.setAttribute("src", address);
    frame.setAttribute("id", "tasksPage");
    document.getElementById("content").appendChild(frame);
  });

  updateData();

  getManifest(function(manifest) {
    localStorage.setItem("com.bit51.chrome.bettergoogletasks.version", manifest.version);
  });

  chrome.extension.onConnect.addListener(function(port) {
    console.assert(port.name === "BGT");
    port.onMessage.addListener(function(msg) {
      if (msg.message === "Update") {
        updateData();
      } else {
        if (msg.message === "Open") {
          inOpen();
        }
      }
    });
  });

}).call(this);
