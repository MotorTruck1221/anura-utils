//this is fully typed!!!
anura.settings.set("some_key", Math.random() * 1000);
let win = AliceWM.create("popup");
win.content.innerHTML = "Hello, World!";
win.content.innerHTML += "<br>Some value: " + anura.settings.get("some_key");
