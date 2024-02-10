// We have fully typed access to the anura api!
anura.settings.set("some_key", Math.random() * 1000);

let win = AliceWM.create("Popup");
win.content.innerHTML = "Hello, World!";
win.content.innerHTML += "<br>Some value: " + anura.settings.get("some_key");
