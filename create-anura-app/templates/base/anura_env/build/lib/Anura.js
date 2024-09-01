"use strict";
class Anura {
    version = {
        semantic: {
            major: "2",
            minor: "0",
            patch: "0",
        },
        buildstate: "alpha",
        codename: "Idol",
        get pretty() {
            const semantic = anura.version.semantic;
            return `${semantic.major}.${semantic.minor}.${semantic.patch} ${anura.version.buildstate}`;
        },
    };
    initComplete = false;
    x86;
    settings;
    fs;
    config;
    notifications;
    x86hdd;
    net;
    platform;
    ui = new AnuraUI();
    processes;
    dialog;
    sw;
    anurad;
    constructor(fs, settings, config, hdd, platform, net) {
        this.fs = fs;
        this.settings = settings;
        this.config = config;
        this.x86hdd = hdd;
        this.platform = platform;
        this.net = net;
        this.notifications = new NotificationService();
        this.processes = new Processes();
        document.body.appendChild(this.notifications.element);
    }
    static async new(config) {
        // File System Initialization //
        const filerProvider = new FilerAFSProvider(new Filer.FileSystem({
            name: "anura-mainContext",
            provider: new Filer.FileSystem.providers.IndexedDB(),
        }));
        const fs = new AnuraFilesystem([filerProvider]);
        const settings = await Settings.new(fs, config.defaultsettings);
        const hdd = await InitV86Hdd();
        const platform = new Platform();
        const net = new Networking(settings.get("wisp-url"));
        const anuraPartial = new Anura(fs, settings, config, hdd, platform, net);
        return anuraPartial;
    }
    wm = new WMAPI();
    apps = {};
    libs = {};
    logger = {
        log: console.log.bind(console, "anuraOS:"),
        debug: console.debug.bind(console, "anuraOS:"),
        warn: console.warn.bind(console, "anuraOS:"),
        error: console.error.bind(console, "anuraOS:"),
    };
    async registerApp(app) {
        if (app.package in this.apps) {
            throw "Application already installed";
        }
        launcher.addShortcut(app);
        this.apps[app.package] = app;
        if (this.initComplete) {
            taskbar.updateTaskbar();
            alttab.update();
        }
        return app;
    }
    async registerExternalApp(source) {
        const resp = await fetch(`${source}/manifest.json`);
        const manifest = (await resp.json());
        if (manifest.type === "auto" ||
            manifest.type === "manual" ||
            manifest.type === "webview") {
            const app = new ExternalApp(manifest, source);
            await anura.registerApp(app); // This will let us capture error messages
            return app;
        }
        const handlers = anura.settings.get("ExternalAppHandlers");
        if (!handlers || !handlers[manifest.type]) {
            const error = `Could not register external app from source: "${source}" because no external handlers are registered for type "${manifest.type}"`;
            anura.notifications.add({
                title: "AnuraOS",
                description: error,
            });
            throw error;
        }
        const handler = handlers[manifest.type];
        const handlerModule = await anura.import(handler);
        if (!handlerModule) {
            const error = `Failed to load external app handler ${handler}`;
            anura.notifications.add({
                title: "AnuraOS",
                description: error,
            });
            throw error;
        }
        if (!handlerModule.createApp) {
            const error = `Handler ${handler} does not have a createApp function`;
            anura.notifications.add({
                title: "AnuraOS",
                description: error,
            });
            throw error;
        }
        const app = handlerModule.createApp(manifest, source);
        await anura.registerApp(app); // This will let us capture error messages
        return app;
    }
    registerExternalAppHandler(id, handler) {
        const handlers = anura.settings.get("ExternalAppHandlers") || {};
        handlers[handler] = id;
        anura.settings.set("ExternalAppHandlers", handlers);
    }
    async registerLib(lib) {
        if (lib.package in this.libs) {
            throw "Library already installed";
        }
        this.libs[lib.package] = lib;
        return lib;
    }
    async registerExternalLib(source) {
        const resp = await fetch(`${source}/manifest.json`);
        const manifest = await resp.json();
        const lib = new ExternalLib(manifest, source);
        await anura.registerLib(lib); // This will let us capture error messages
        return lib;
    }
    ContextMenu = ContextMenuAPI;
    removeStaleApps() {
        for (const appName in anura.apps) {
            const app = anura.apps[appName];
            app.windows.forEach((win) => {
                if (!win.element.parentElement) {
                    app.windows.splice(app.windows.indexOf(win), 1);
                }
            });
        }
        taskbar.updateTaskbar();
        alttab.update();
    }
    systray;
    async import(packageName, searchPath) {
        if (searchPath) {
            // Using node-style module resolution
            let scope;
            let name;
            let filename;
            if (packageName.startsWith("@")) {
                const [_scope, _name, ...rest] = packageName.split("/");
                scope = _scope;
                name = _name;
                filename = rest.join("/");
            }
            else {
                const [_name, ...rest] = packageName.split("/");
                scope = null;
                name = _name;
                filename = rest.join("/");
            }
            if (!filename || filename === "") {
                const data = await anura.fs.promises.readFile(`${searchPath}/${scope}/${name}/package.json`);
                const pkg = JSON.parse(data);
                if (pkg.main) {
                    filename = pkg.main;
                }
                else {
                    filename = "index.js";
                }
            }
            const file = await anura.fs.promises.readFile(`${searchPath}/${scope}/${name}/${filename}`);
            const blob = new Blob([file], { type: "application/javascript" });
            const url = URL.createObjectURL(blob);
            return await import(url);
        }
        const splitName = packageName.split("@");
        const pkg = splitName[0];
        const version = splitName[1] || null;
        return await this.libs[pkg].getImport(version);
    }
    uri = new URIHandlerAPI();
    files = new FilesAPI();
    get wsproxyURL() {
        return this.settings.get("wisp-url");
    }
}
class SWProcess extends Process {
    pid = 0;
    title = "Service Worker";
    constructor() {
        super();
        this.stdin = new WritableStream({
            write: (message) => {
                navigator.serviceWorker.controller.postMessage({
                    type: "stdin",
                    message,
                }, [message]);
            },
        });
        this.stdout = new ReadableStream({
            start: (controller) => {
                navigator.serviceWorker.addEventListener("message", (event) => {
                    if (event.data.type === "stdout") {
                        controller.enqueue(event.data.message);
                    }
                });
            },
        });
        this.stderr = new ReadableStream({
            start: (controller) => {
                navigator.serviceWorker.addEventListener("message", (event) => {
                    if (event.data.type === "stderr") {
                        controller.enqueue(event.data.message);
                    }
                });
            },
        });
    }
    kill() {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
            for (const registration of registrations) {
                registration.unregister();
            }
        });
        super.kill();
        location.reload();
    }
    get alive() {
        return navigator.serviceWorker.controller !== null;
    }
}
//# sourceMappingURL=Anura.js.map