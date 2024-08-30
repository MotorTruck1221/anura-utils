"use strict";
class NotificationService {
    state = $state({
        notifications: [],
        render: true,
    });
    css = css `
        position: absolute;
        float: right;
        display: flex;
        flex-direction: column;
        gap: 10px;
        bottom: 60px;
        right: 10px;
        z-index: 9997;
    `;
    element = (h("div", { class: this.css, style: {
            display: use(this.state.render, (render) => render ? "flex" : "none"),
        } }));
    // For legacy reasons, this is a getter and setter for external use.
    // Internally, you should use this.state.notifications instead.
    get notifications() {
        return this.state.notifications;
    }
    set notifications(value) {
        this.state.notifications = value;
    }
    constructor() { }
    add(params) {
        const notif = new AnuraNotification(params, () => {
            this.remove(notif);
        });
        useChange(use(notif.state.timedOut), (timedOut) => {
            if (timedOut)
                this.remove(notif, true);
        });
        this.element.appendChild(notif.element);
        this.state.notifications = [...this.state.notifications, notif];
    }
    remove(notification, rendererOnly = false) {
        if (!rendererOnly) {
            this.state.notifications = this.state.notifications.filter((n) => n !== notification);
        }
        notification.element.style.opacity = "0";
        setTimeout(() => {
            notification.element.remove();
        }, 360);
    }
    subscribe(callback) {
        let active = true;
        useChange(use(this.state.notifications), () => {
            if (!active)
                return;
            callback(this.state.notifications);
        });
        return () => {
            active = false;
        };
    }
    setRender(render) {
        this.state.render = render;
    }
}
class AnuraNotification {
    title = "Anura Notification";
    description = "Anura Description";
    timeout = 2000;
    closeIndicator = false;
    callback = (_notif) => null;
    buttons = [];
    close;
    state = $state({
        timedOut: false,
    });
    css = css `
        background-color: color-mix(
            in srgb,
            var(--theme-dark-bg) 77.5%,
            transparent
        );
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        border-radius: 1em;
        color: white;
        width: 360px;
        cursor: pointer;
        animation: slideIn 0.35s ease-in-out forwards;
        opacity: 1;
        transition: 250ms ease-in-out;
        box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.5);

        &:hover .nbody .ntitle-container .close-indicator {
            opacity: 1;
        }

        .nbody {
            display: flex;
            flex-direction: column;
            padding: 1em;
            gap: 0.5em;

            .ntitle-container {
                display: flex;
                flex-direction: row;

                .ntitle {
                    color: var(--theme-fg);
                    font-size: 14px;
                    font-weight: 700;
                    flex-grow: 1;
                }

                .close-indicator {
                    width: 16px;
                    height: 16px;
                    opacity: 0;

                    span {
                        font-size: 16px;
                    }
                }
            }

            .ndescription {
                font-size: 12px;
                color: var(--theme-secondary-fg);
            }

            .nbutton-container {
                display: flex;
                gap: 6px;

                .nbutton {
                    flex-grow: 1;
                }
            }
        }
    `;
    element;
    constructor(params, close) {
        Object.assign(this, params);
        this.close = close;
        this.buttons = params.buttons || [];
        this.element = (h("div", { class: `${this.css} notification` },
            h("div", { class: "nbody", "on:click": (e) => {
                    if (e.target.tagName.toLowerCase() !==
                        "button") {
                        this.callback(this);
                        this.close();
                    }
                } },
                h("div", { class: "ntitle-container" },
                    h("div", { class: "ntitle" }, this.title),
                    h("div", { class: "close-indicator", "on:click": (e) => {
                            e.stopPropagation();
                            this.close();
                        } },
                        h("span", { class: "material-symbols-outlined" }, "close"))),
                h("div", { class: "ndescription" }, this.description),
                $if(this.buttons.length > 0, h("div", { class: "nbutton-container" }, this.buttons.map((value) => (h("button", { class: [
                        "nbutton",
                        `matter-button-${value.style || "contained"}`,
                    ], "on:click": () => {
                        value.callback(this);
                        if (typeof value.close ===
                            "undefined" ||
                            value.close)
                            this.close();
                    } }, value.text))))))));
        // Hide to notif center after period
        this.timeout !== "never" &&
            setTimeout(() => {
                this.state.timedOut = true;
            }, this.timeout);
    }
}
//# sourceMappingURL=NotificationService.js.map