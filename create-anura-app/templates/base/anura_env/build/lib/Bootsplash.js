"use strict";
const bootsplash = (h("div", { class: "bootsplash" },
    h("img", { src: "/assets/images/bootsplash.png" }),
    h("br", { id: "systemstatus-br", style: "display: none;" }),
    h("h2", { id: "systemstatus", style: "display: none;" })));
const bootsplashMobile = (h("div", { class: "bootsplash" },
    h("img", { src: "/icon.png", width: "125", height: "108.5" }),
    h("br", { id: "systemstatus-br", style: "display: none;" }),
    h("h2", { id: "systemstatus", style: "display: none;" })));
const gangstaBootsplash = (h("div", { class: "bootsplash" },
    h("img", { src: "/assets/images/bootsplash.png" }),
    h("h2", { style: "font-size: 55px; margin-top: 1rem; color: #DFDEDE;" }, "Gangster Edition"),
    h("img", { src: "/assets/images/gangsta.jpeg", style: "position: absolute; top: 0; bottom: 0; right: 0; width: auto; height: 100%; filter: brightness(0.95)" }),
    h("br", { id: "systemstatus-br", style: "display: none;" }),
    h("h2", { id: "systemstatus", style: "display: none;" }),
    h("span", { style: "position: absolute; bottom: 1rem; left: 1rem; text-align: left;" },
        "Copyright \u00A9 2022-2024",
        h("br", null),
        "Mercury Workshop")));
//# sourceMappingURL=Bootsplash.js.map