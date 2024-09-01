"use strict";
class ExternalApp extends App {
    manifest;
    source;
    icon = "/assets/icons/generic.png";
    constructor(manifest, source) {
        super();
        this.manifest = manifest;
        this.name = manifest.name;
        if (manifest.icon) {
            this.icon = source + "/" + manifest.icon;
        }
        this.source = source;
        this.package = manifest.package;
        this.hidden = manifest.hidden || false;
    }
    static serializeArgs(args) {
        const encoder = new TextEncoder();
        const encodedValues = args.map((value) => {
            const bytes = encoder.encode(value);
            const binString = String.fromCodePoint(...bytes);
            return btoa(binString);
        });
        return encodeURIComponent(encodedValues.join(","));
    }
    static deserializeArgs(args) {
        const decoder = new TextDecoder("utf-8");
        return decodeURIComponent(args)
            .split(",")
            .map((value) => {
            const binString = atob(value);
            return decoder.decode(Uint8Array.from(binString, (c) => c.charCodeAt(0)));
        });
    }
    //@ts-expect-error manual apps exist
    async open(args = []) {
        //  TODO: have a "allowmultiinstance" option in manifest? it might confuse users, some windows open a second, some focus
        // if (this.windowinstance) return;
        if (this.manifest.type === "auto") {
            const win = anura.wm.create(this, this.manifest.wininfo);
            const iframe = document.createElement("iframe");
            // CSS injection here but it's no big deal
            const bg = this.manifest.background || "var(--theme-bg)";
            iframe.setAttribute("style", "top:0; left:0; bottom:0; right:0; width:100%; height:100%; " +
                `border: none; margin: 0; padding: 0; background-color: ${bg};`);
            iframe.setAttribute("src", `${this.source}/${this.manifest.index}${this.manifest.index?.includes("?") ? "&" : "?"}args=${ExternalApp.serializeArgs(args)}`);
            win.content.appendChild(iframe);
            iframe.id = `proc-${win.pid}`;
            if (this.manifest.useIdbWrapper) {
                const idbWrapper = new Proxy(iframe.contentWindow.indexedDB, {
                    get: (target, prop, receiver) => {
                        switch (prop) {
                            case "databases":
                                return async () => {
                                    const dbs = await target.databases();
                                    return dbs
                                        .filter((db) => db.name.startsWith(this.package + "-"))
                                        .map((db) => {
                                        db.name = db.name.slice(this.package.length + 1);
                                        return db;
                                    });
                                };
                            case "open":
                                return (name, version) => {
                                    return target.open(name.startsWith(this.package + "-")
                                        ? name
                                        : `${this.package}-${name}`, version);
                                };
                            case "deleteDatabase":
                                return (name) => {
                                    return target.deleteDatabase(name.startsWith(this.package + "-")
                                        ? name
                                        : `${this.package}-${name}`);
                                };
                            default:
                                return Reflect.get(target, prop, receiver);
                        }
                    },
                });
                Object.defineProperty(iframe.contentWindow, "indexedDB", {
                    value: idbWrapper,
                    writable: false,
                });
            }
            Object.assign(iframe.contentWindow, {
                anura,
                AliceWM,
                ExternalApp,
                LocalFS,
                instance: this,
                instanceWindow: win,
                print: (message) => {
                    iframe.contentWindow.window.postMessage({
                        type: "stdout",
                        message,
                    });
                },
                println: (message) => {
                    iframe.contentWindow.postMessage({
                        type: "stdout",
                        message: message + "\n",
                    });
                },
                printerr: (message) => {
                    iframe.contentWindow.postMessage({
                        type: "stderr",
                        message,
                    });
                },
                printlnerr: (message) => {
                    iframe.contentWindow.postMessage({
                        type: "stderr",
                        message: message + "\n",
                    });
                },
                read: () => {
                    return new Promise((resolve) => {
                        iframe.contentWindow.addEventListener("message", (e) => {
                            if (e.data.type === "stdin") {
                                resolve(e.data.message);
                            }
                        }, { once: true });
                    });
                },
                readln: () => {
                    return new Promise((resolve) => {
                        // Read until a newline
                        let buffer = "";
                        const listener = (e) => {
                            if (e.data.type === "stdin") {
                                buffer += e.data.message;
                                if (buffer.includes("\n")) {
                                    resolve(buffer);
                                    iframe.contentWindow.removeEventListener("message", listener);
                                }
                            }
                        };
                        iframe.contentWindow.addEventListener("message", listener);
                    });
                },
                env: {
                    process: win,
                },
                open: async (url) => {
                    const browser = await anura.import("anura.libbrowser");
                    browser.openTab(url);
                },
            });
            win.stdin = new WritableStream({
                write: (message) => {
                    iframe.contentWindow.postMessage({
                        type: "stdin",
                        message,
                    });
                },
            });
            win.stderr = new ReadableStream({
                start: (controller) => {
                    iframe.contentWindow.addEventListener("error", (e) => {
                        controller.enqueue(e.error);
                    });
                    iframe.contentWindow.addEventListener("message", (e) => {
                        if (e.data.type === "stderr") {
                            controller.enqueue(e.data.message);
                        }
                    });
                },
            });
            win.stdout = new ReadableStream({
                start: (controller) => {
                    iframe.contentWindow.addEventListener("message", (e) => {
                        if (e.data.type === "stdout") {
                            controller.enqueue(e.data.message);
                        }
                    });
                },
            });
            const matter = document.createElement("link");
            matter.setAttribute("rel", "stylesheet");
            matter.setAttribute("href", "/assets/matter.css");
            iframe.contentWindow.addEventListener("load", () => {
                iframe.contentDocument.head.appendChild(matter);
            });
            return win;
        }
        else if (this.manifest.type === "manual") {
            // This type of application is reserved only for scripts meant for hacking anura internals
            const req = await fetch(`${this.source}/${this.manifest.handler}`);
            const data = await req.text();
            top.window.eval(data);
            // @ts-ignore
            loadingScript(this.source, this);
            taskbar.updateTaskbar();
            alttab.update();
            return;
        }
        else if (this.manifest.type === "webview") {
            // FOR INTERNAL USE ONLY
            const win = anura.wm.create(this, this.manifest.wininfo);
            const iframe = document.createElement("iframe");
            // CSS injection here but it's no big deal
            const bg = this.manifest.background || "var(--theme-bg)";
            iframe.setAttribute("style", "top:0; left:0; bottom:0; right:0; width:100%; height:100%; " +
                `border: none; margin: 0; padding: 0; background-color: ${bg};`);
            let encoded = "";
            for (let i = 0; i < this.manifest.src.length; i++) {
                if (i % 2 === 0) {
                    encoded += this.manifest.src[i];
                }
                else {
                    encoded += String.fromCharCode(this.manifest.src.charCodeAt(i) ^ 2);
                }
            }
            iframe.setAttribute("src", `${"/service/" + encodeURIComponent(encoded)}`);
            win.content.appendChild(iframe);
            return win;
        }
    }
}
//# sourceMappingURL=ExternalApp.js.map