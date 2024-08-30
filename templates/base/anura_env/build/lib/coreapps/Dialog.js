"use strict";
// this has now been redone, nobody is getting sent to hell anymore
class Dialog extends App {
    name = "Anura Dialog";
    package = "anura.dialog";
    icon = "/assets/icons/generic.png";
    source;
    hidden = true;
    css = css `
        margin: 16px;
        h2 {
            font-size: 1.2rem;
        }
        .buttons {
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;

            .matter-button-contained {
                background-color: var(--theme-accent);
                color: var(--theme-fg);
            }
        }
        .confirm {
            margin-left: 5px;
        }
    `;
    constructor() {
        super();
    }
    alert(message, title = "Alert") {
        const dialog = this;
        dialog.title = "";
        dialog.width = "350px";
        dialog.height = "170px";
        const win = anura.wm.create(this, dialog);
        // MARK: The DAMN CSS
        win.content.style.background = "var(--material-bg)";
        win.content.style.color = "white";
        // MARK: good idea?
        // (win.element as HTMLElement).querySelectorAll(".windowButton").forEach((el: HTMLElement) => {
        //     el.style.display = "none";
        // })
        win.content.appendChild(h("div", { class: [this.css] },
            h("h2", null, title),
            h("p", null, message),
            h("div", { class: ["buttons"] },
                h("button", { class: ["matter-button-contained"], "on:click": () => {
                        win.close();
                    } }, "OK"))));
    }
    async confirm(message, title = "Confirmation") {
        return new Promise((resolve, reject) => {
            const dialog = this;
            dialog.title = "";
            dialog.width = "350px";
            dialog.height = "170px";
            const win = anura.wm.create(this, dialog);
            win.onclose = () => {
                resolve(false);
            };
            win.content.style.background = "var(--material-bg)";
            win.content.style.color = "white";
            win.content.appendChild(h("div", { class: [this.css] },
                h("h2", null, title),
                h("p", null, message),
                h("div", { class: "buttons" },
                    h("button", { class: "matter-button-outlined", "on:click": () => {
                            resolve(false);
                            win.close();
                        } }, "Cancel"),
                    h("button", { class: ["matter-button-contained", "confirm"], "on:click": () => {
                            resolve(true);
                            win.close();
                        } }, "OK"))));
        });
    }
    async prompt(message, defaultValue) {
        return new Promise((resolve, reject) => {
            const dialog = this;
            dialog.title = "";
            dialog.width = "350px";
            dialog.height = "200px";
            const win = anura.wm.create(this, dialog);
            win.onclose = () => {
                resolve(null);
            };
            win.content.style.background = "var(--material-bg)";
            win.content.style.color = "white";
            let input;
            win.content.appendChild(h("div", { class: [this.css] },
                h("h2", null, message),
                h("label", { class: "matter-textfield-filled" }, (input = (h("input", { placeholder: " " })))),
                h("div", { class: "buttons" },
                    h("button", { class: "matter-button-outlined", "on:click": () => {
                            resolve(null);
                            win.close();
                        } }, "Cancel"),
                    h("button", { class: ["matter-button-contained", "confirm"], "on:click": () => {
                            const value = input.value;
                            if (value && value !== "") {
                                resolve(value);
                            }
                            else if (defaultValue) {
                                resolve(defaultValue);
                            }
                            else {
                                resolve(null);
                            }
                            win.close();
                        } }, "OK"))));
        });
    }
}
//# sourceMappingURL=Dialog.js.map