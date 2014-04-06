(function() {
  $(document).ready(function() {
    var address, frame;
    localStorage.removeItem("de.wedevelop.chrome.googletasksevolved.last_notify");
    address = "https://mail.google.com/tasks/m";
    frame = document.createElement("iframe");
    frame.setAttribute("src", address);
    frame.setAttribute("id", "tasksPage");
    document.getElementById("content").appendChild(frame);
  });

  updateData();

  getManifest(function(manifest) {
    localStorage.setItem("de.wedevelop.chrome.googletasksevolved.version", manifest.version);
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
