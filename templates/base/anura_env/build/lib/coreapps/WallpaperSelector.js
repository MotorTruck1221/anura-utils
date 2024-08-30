"use strict";
const wallpaperCSS = css `
    color: var(--theme-fg);

    .header {
        margin-left: 20px;
    }
    .current-wallpaper {
        margin-left: 20px;
        display: flex;
        align-items: center;
    }
    .current-wallpaper-image {
        aspect-ratio: 16/9;
        height: 125px;
        border-radius: 10px;
        margin-right: 20px;
    }
    .current-wallpaper-image:hover {
        cursor: pointer;
    }
    .curr-wallpaper-text {
        color: var(--theme-secondary-fg);
        margin-bottom: 5px;
    }
    .curr-wallpaper-name {
        margin-top: 0px;
    }
    select {
        background-color: var(--theme-secondary-bg);
        color: var(--theme-fg);
        border: none;
        padding: 5px;
        border-radius: 5px;
        font-family:
            "Roboto",
            RobotoDraft,
            "Droid Sans",
            Arial,
            Helvetica,
            -apple-system,
            BlinkMacSystemFont,
            system-ui,
            sans-serif;
        outline: none;
        height: 25px;
    }
    .separator-hr {
        margin: 20px;
        border: 2px solid var(--theme-border);
        border-radius: 10px;
    }
    *::-webkit-scrollbar {
        width: 8px;
    }

    *::-webkit-scrollbar-thumb {
        background-color: var(--theme-secondary-bg);
        border-radius: 8px;
    }

    *::-webkit-scrollbar-button {
        display: none;
    }
    .wallpaper-list-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        grid-gap: 20px;
        margin-left: 20px;
        text-align: center;
        overflow-y: scroll;
        height: calc(
            100% - 264px
        ); /* i just realized this was a hacky workaround, can someone make it better - fish */
    }
    .wallpaper-list-item {
        cursor: pointer;
    }
    .wallpaper-list-item-image {
        aspect-ratio: 16/9;
        height: 100px;

        border-radius: 10px;
        transition: border 0.2s;
        border: 3px solid transparent; /* another shit workaround :frcoal: */
    }
    .wallpaper-list-item-name {
        margin: 10px;
    }

    .wallpaper-list-item.selected img {
        border-color: var(--theme-accent);
        transition: border 0.2s;
    }

    .custom-wallpaper {
        margin-left: 20px;
        margin-bottom: 20px;
    }

    .matter-button-contained {
        background-color: var(--theme-accent);
        color: var(--theme-fg);
    }

    #custom-wallpaper-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--theme-secondary-bg);
        color: var(--theme-fg);
        border-radius: 10px;
        aspect-ratio: 16 / 9;
        height: 100px;
        width: 177.78px; /* EWW DIRTY HACK PLEASE FIX - fish */
        cursor: pointer;
    }

    input[type="color"] {
        background-color: transparent;
        border: none;
        padding: 0;
        width: 2.5rem;
        height: 25px;
    }

    input[type="color" i]::-webkit-color-swatch {
        /* This will never work on firefox but who gaf */
        border-radius: 0.5rem;
        border: 1px solid var(--theme-border);
        height: 25px;
    }

    input[type="color" i]::-webkit-color-swatch-wrapper {
        padding: 0;
        height: 25px;
    }

    .wall-fit {
        display: flex;
        gap: 5px;
    }
`;
class WallpaperSelector extends App {
    name = "Wallpaper Selector";
    package = "anura.wallpaper";
    icon = "/assets/icons/wallpaper.png";
    libfilepicker;
    wallpaperList = async () => {
        return await this.loadWallpaperManifest();
    };
    state = $state({
        resizing: false,
    });
    page = async () => (h("div", { style: "height:100%;width:100%;position:absolute", class: `background ${wallpaperCSS}` },
        h("div", { class: "header" },
            h("h2", { color: "white" }, "Wallpaper Selector")),
        h("div", { class: "current-wallpaper" },
            h("img", { class: "current-wallpaper-image", src: this.getCurrentWallpaper().url }),
            h("div", { className: "current-wallpaper-attributes" },
                h("h5", { class: "curr-wallpaper-text", color: "gray" }, "Current Wallpaper"),
                h("h3", { class: "curr-wallpaper-name", color: "white" }, this.getCurrentWallpaper().name),
                h("div", { class: "wall-fit" },
                    h("select", { name: "fit-select", id: "fit-select", "on:change": (e) => {
                            anura.settings.set("wallpaper-fit", e.target.value);
                            window.document.body.style.backgroundSize =
                                anura.settings.get("wallpaper-fit");
                        } },
                        h("option", { value: "cover", selected: 
                            // Hacky fix but it works
                            anura.settings.get("wallpaper-fit") ===
                                "cover" }, "Cover"),
                        h("option", { value: "contain", selected: anura.settings.get("wallpaper-fit") ===
                                "contained" }, "Contain"),
                        h("option", { value: "auto", selected: anura.settings.get("wallpaper-fit") ===
                                "auto" }, "Auto")),
                    $if(anura.settings.get("wallpaper-fit") === "contain", h("input", { type: "color", name: "contain-color", id: "contain-color", value: anura.settings.get("wallpaper-contain-color"), "on:change": (e) => {
                            anura.settings.set("wallpaper-contain-color", e.target.value);
                            window.document.documentElement.style.backgroundColor =
                                anura.settings.get("wallpaper-contain-color");
                        } }))))),
        h("hr", { class: "separator-hr" }),
        await this.wallpaperList().then((wallpaperJSON) => {
            const wallpaperList = (h("div", { id: "wallpaper-list", class: "wallpaper-list-container" },
                h("div", { class: "wallpaper-list-item", style: "display: flex;flex-direction: column;align-items: center;" },
                    h("div", { "on:click": () => {
                            this.libfilepicker
                                .selectFile({
                                regex: "(png|jpe?g|gif|bmp|webp|tiff|svg|ico)",
                                app: this,
                            })
                                .then((filename) => {
                                if (filename === undefined)
                                    return;
                                const wallpaperName = filename
                                    .split("/")
                                    .pop();
                                const wallpaperURL = "/fs" + filename;
                                this.setNewWallpaper({
                                    name: wallpaperName,
                                    url: wallpaperURL,
                                });
                            });
                        }, id: "custom-wallpaper-btn" },
                        h("span", { class: "material-symbols-outlined", style: "font-size: 32px;" }, "add")),
                    h("h5", { class: "wallpaper-list-item-name", color: "white" }, "Upload new"))));
            wallpaperJSON["wallpapers"].forEach((wallpaper) => {
                wallpaperList.appendChild(h("div", { "on:click": () => {
                        this.setNewWallpaper(wallpaper);
                    }, class: `wallpaper-list-item ${this.getCurrentWallpaper().name === wallpaper.name ? "selected" : ""}`, id: `wallpaper-${wallpaper.name.replace(" ", "-")}` },
                    h("img", { class: "wallpaper-list-item-image", src: wallpaper.url }),
                    h("h5", { class: "wallpaper-list-item-name", color: "white" }, wallpaper.name)));
            });
            return wallpaperList;
        })));
    setNewWallpaper(wallpaperObj) {
        anura.settings.set("wallpaper", wallpaperObj.url);
        anura.settings.set("wallpaper-name", wallpaperObj.name);
        this.updateCurrentWallpaperElements();
        this.setWallpaper(wallpaperObj.url);
    }
    getCurrentWallpaper() {
        let currWallpaper = anura.settings.get("wallpaper");
        let currWallpaperName = anura.settings.get("wallpaper-name");
        if (currWallpaper === undefined ||
            currWallpaper === null ||
            currWallpaperName === undefined ||
            currWallpaperName === null) {
            currWallpaper = "/assets/wallpaper/bundled_wallpapers/Nocturne.jpg";
            currWallpaperName = "Nocturne";
            anura.settings.set("wallpaper", currWallpaper);
            anura.settings.set("wallpaper-name", currWallpaperName);
        }
        return {
            name: currWallpaperName,
            url: currWallpaper,
        };
    }
    async loadWallpaperManifest() {
        const wallpaperManifest = await fetch("/assets/wallpaper/bundled_wallpapers/manifest.json");
        return JSON.parse(await wallpaperManifest.text());
    }
    updateCurrentWallpaperElements() {
        // Updates the display for the current wallpaper.
        // I'm so sorry for how ugly this function is, this was written in ~30 seconds.
        const currWallpaper = this.getCurrentWallpaper();
        const currWallpaperImage = document.getElementsByClassName("current-wallpaper-image")[0];
        const currWallpaperName = document.getElementsByClassName("curr-wallpaper-name")[0];
        if (currWallpaperImage === undefined || currWallpaperName === undefined)
            return;
        currWallpaperImage.setAttribute("src", currWallpaper.url);
        currWallpaperName.innerText =
            currWallpaper.name;
        // this is where it gets way jankier
        Array.from(document.getElementsByClassName("wallpaper-list-item")) // woah that is jank
            .forEach((item) => {
            item.classList.remove("selected");
        });
        document
            .getElementById("wallpaper-" + currWallpaper.name.replace(" ", "-"))
            ?.classList.add("selected");
    }
    setWallpaper(url) {
        window.document.documentElement.style.backgroundColor =
            anura.settings.get("wallpaper-contain-color"); // this might not be ideal but it works
        window.document.body.style.background = `url("${url}") no-repeat center center fixed`;
        window.document.body.style.backgroundSize =
            anura.settings.get("wallpaper-fit");
    }
    constructor() {
        super();
    }
    async open() {
        const win = anura.wm.create(this, {
            title: "",
            width: "910px",
            height: `${(720 * window.innerHeight) / 1080}px`,
        });
        if (this.libfilepicker === undefined) {
            // Lazy load the filepicker library.
            this.libfilepicker = await anura.import("anura.filepicker");
        }
        win.content.appendChild(await this.page());
        return win;
    }
}
//# sourceMappingURL=WallpaperSelector.js.map