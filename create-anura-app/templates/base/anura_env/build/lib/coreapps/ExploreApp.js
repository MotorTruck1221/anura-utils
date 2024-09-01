"use strict";
class ExploreApp extends App {
    hidden = false;
    constructor() {
        super();
        this.name = "Explore";
        this.icon = "/assets/icons/explore2.png";
        this.package = "anura.explore";
    }
    css = css `
        background-color: var(--theme-bg);
        color: var(--theme-fg);
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;

        #sidebar {
            width: 22rem;
            padding: 1rem;
            padding-left: 0;

            & div {
                padding-block: 0.7rem;
                font-size: 1.1rem;
                border-radius: 0 3rem 3rem 0;
                padding-left: 1.25em;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 600;
                width: 100%;

                transition: 0.2s;
            }

            & div.selected {
                color: color-mix(
                    in srgb,
                    var(--theme-accent) 35%,
                    var(--theme-fg)
                );
                background-color: color-mix(
                    in srgb,
                    var(--theme-accent) 30%,
                    transparent
                );
                font-weight: 700;

                transition: 0.15s ease;
            }
        }

        h1 {
            font-size: 2em;
        }

        article {
            width: 100%;
            height: 100%;
            overflow-y: auto;
        }

        a,
        a:link {
            color: var(--theme-accent);
        }

        a:visited {
            color: var(--theme-accent);
        }

        #body {
            font-size: 1.05rem;
            padding: 1rem;
            padding-left: 2rem;

            & p {
                margin-block: 0.5rem;
            }

            & p img {
                width: 1.05rem;
                height: 1.05rem;
                margin-top: 0.5rem;
            }

            & span:has(img) {
                gap: 0.2rem;
                align-items: center;
                font-weight: 600;
            }

            & code {
                background-color: var(--theme-secondary-bg);
                padding: 0.1rem 0.3rem;
                border-radius: 0.2rem;
                font-family: "Roboto Mono", monospace;
            }

            & h2 {
                margin-block: 1.5rem 0;
            }

            & h2:first-of-type {
                margin-block-start: 0.25rem;
            }
        }

        .head {
            display: flex;
            flex-direction: row;

            gap: 1rem;
            align-items: center;

            & img {
                width: 2.5rem;
                height: 2.5rem;
            }
        }

        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-thumb {
            background-color: var(--theme-secondary-bg);
            border-radius: 8px;
        }

        ::-webkit-scrollbar-button {
            display: none;
        }
    `;
    whatsnew = (h("div", { id: "body" },
        h("h1", null,
            "What's new in AnuraOS ",
            anura.version.pretty,
            "?"),
        h("h2", null, "Themes"),
        h("p", null,
            "You can now completely customize how Anura looks! Just open the",
            h("span", null,
                h("a", { href: "javascript:anura.apps['anura.ui.themeeditor'].open();" },
                    h("img", { src: "/assets/icons/themeeditor.png", alt: "Theme Editor Icon" }),
                    " ",
                    "Theme Editor"))),
        h("h2", null, "Support for more platforms"),
        h("p", null, "Anura now supports tablets and phones through the new redesigned mobile shell to provide better support to those platforms."),
        h("h2", null, "Overhauled Marketplace"),
        h("p", null, "The Marketplace app has been completely redesigned from the ground up for a better experience."),
        h("h2", null, "Task Manager"),
        h("p", null, "A brand new Task Manager app has been added! You can manage running apps from there."),
        h("h2", null, "Other"),
        h("ul", null,
            h("li", null, "A calendar was added to the system tray."),
            h("li", null, "A quick settings menu was added."),
            h("li", null, "Various UI elements were reworked to create a more cohesive user experience."),
            h("li", null, "Various bugs were squashed."),
            h("li", null, "Removed Herobrine."))));
    v86 = (h("div", { id: "body" },
        h("h1", null, "Using the x86 Subsystem"),
        h("p", null,
            "AnuraOS includes an x86 subsystem (based on",
            " ",
            h("a", { href: "javascript:anura.apps['anura.browser'].open(['https://github.com/copy/v86']);" // using dreamland on:click or html onclick makes the link not blue
             }, "v86"),
            "), which lets you run real Linux within Anura.",
            $if(anura.x86 === undefined, h("p", null,
                " ",
                "It seems like you dont have the subsystem enabled. You can install it from",
                " ",
                h("span", null,
                    h("img", { src: "/assets/icons/settings.png", alt: "Settings icon" }),
                    " ",
                    h("a", { href: "javascript:anura.apps['anura.settings'].open();" }, "Settings")),
                ".")),
            $if(anura.x86 !== undefined, h("p", null,
                "You can open a terminal using the",
                " ",
                h("span", null,
                    h("img", { src: "/assets/icons/terminal.png", alt: "v86 Terminal Icon" }),
                    " ",
                    h("a", { href: "javascript:anura.apps['anura.term'].open();" }, "v86 Terminal")),
                " ",
                "app."))),
        h("p", null,
            "The x86 subsystem is based on an Alpine Linux, a lightweight distro commonly used in containers. To install packages, you can run ",
            h("code", null, "apk add <package>"),
            "."),
        h("p", null,
            "If you want to create a shortcut for an X11 app in the launcher, you can do so from",
            " ",
            h("span", null,
                h("img", { src: "/assets/icons/settings.png", alt: "Settings icon" }),
                " ",
                h("a", { href: "javascript:anura.apps['anura.settings'].open();" }, "Settings")),
            ".")));
    welcome = (h("div", { id: "body" },
        h("div", { class: "head" },
            h("img", { src: "/icon.png", alt: "AnuraOS Logo" }),
            h("h1", null, "Welcome to AnuraOS!")),
        h("h2", null, "What is AnuraOS?"),
        h("p", null, "AnuraOS is a desktop environment made for development that runs right in your browser. It features full Linux emulation and a robust app ecosystem."),
        h("h2", null, "Getting Started"),
        h("p", null, "AnuraOS functions just like your average desktop: you can launch apps from the launcher (accessible via the button in the bottom-left, or pressing the Meta key), drag windows around, and pin apps to the taskbar. AnuraOS is visually based off of Google's ChromeOS."),
        h("h2", null, "Get new apps"),
        h("p", null,
            "To install more native Anura apps, you can head to the",
            " ",
            h("span", null,
                h("img", { src: "/apps/marketplace.app/playstore.webp", alt: "Marketplace Icon" }),
                " ",
                h("a", { href: "javascript:anura.apps['anura.store'].open();" }, "Marketplace"),
                ".")),
        h("h2", null, "Customize your experience"),
        h("p", null,
            "AnuraOS has robust customization features. You can change the wallpaper using",
            " ",
            h("span", null,
                h("a", { href: "javascript:anura.apps['anura.wallpaper'].open();" },
                    h("img", { src: "/assets/icons/wallpaper.png", alt: "Wallpaper Selector Icon" }),
                    " ",
                    "Wallpaper Selector")),
            ", and change the system colors using",
            " ",
            h("span", null,
                h("a", { href: "javascript:anura.apps['anura.ui.themeeditor'].open();" },
                    h("img", { src: "/assets/icons/themeeditor.png", alt: "Theme Editor Icon" }),
                    " ",
                    "Theme Editor")),
            "."),
        h("p", null, "For advanced users, Anura will execute any files in the /usr/init folder as JavaScript code on boot.")));
    state = $state({
        screen: this.welcome,
    });
    page = async () => (h("div", { class: this.css },
        h("div", { id: "sidebar" },
            h("div", { "on:click": () => {
                    this.state.screen = this.welcome;
                }, "class:selected": use(this.state.screen, (sc) => sc === this.welcome) },
                h("span", { class: "material-symbols-outlined" }, "kid_star"),
                "Welcome"),
            h("div", { "on:click": () => {
                    this.state.screen = this.whatsnew;
                }, "class:selected": use(this.state.screen, (sc) => sc === this.whatsnew) },
                h("span", { class: "material-symbols-outlined" }, "history"),
                "What's new"),
            h("div", { "on:click": () => {
                    this.state.screen = this.v86;
                }, "class:selected": use(this.state.screen, (sc) => sc === this.v86) },
                h("span", { class: "material-symbols-outlined" }, "memory"),
                "x86 Subsystem")),
        h("article", null, use(this.state.screen))));
    async open(args = []) {
        const win = anura.wm.create(this, {
            title: "Explore AnuraOS",
            width: `calc(${window.innerHeight * 0.6}px * 16 / 10)`,
            height: `${window.innerHeight * 0.6}px`,
        });
        win.content.style.backgroundColor = "var(--theme-bg)";
        win.content.style.color = "var(--theme-fg)";
        win.content.style.height = "calc(100% - 24px)"; // very dirty hack
        win.content.appendChild(await this.page());
        return win;
    }
}
//# sourceMappingURL=ExploreApp.js.map