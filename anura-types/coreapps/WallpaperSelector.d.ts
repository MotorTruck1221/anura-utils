/// <reference types="dreamland" />
declare const wallpaperCSS: string;
type WallpaperObject = {
    name: string;
    url: string;
};
declare class WallpaperSelector extends App {
    name: string;
    package: string;
    icon: string;
    libfilepicker: {
        selectFile: (options?: object) => Promise<string | string[]>;
        selectFolder: (options?: object) => Promise<string | string[]>;
    };
    wallpaperList: () => Promise<any>;
    state: Stateful<{
        resizing: boolean;
    }>;
    page: () => Promise<JSX.Element>;
    setNewWallpaper(wallpaperObj: WallpaperObject): void;
    getCurrentWallpaper(): WallpaperObject;
    loadWallpaperManifest(): Promise<any>;
    updateCurrentWallpaperElements(): void;
    setWallpaper(url: string): void;
    constructor();
    open(): Promise<WMWindow | undefined>;
}
//# sourceMappingURL=WallpaperSelector.d.ts.map