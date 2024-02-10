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
        selectFile: (regex?: string) => Promise<string | string[]>;
        selectFolder: (regex?: string) => Promise<string | string[]>;
    };
    wallpaperList: () => Promise<any>;
    state: {
        resizing: boolean;
    };
    page: () => Promise<any>;
    setNewWallpaper(wallpaperObj: WallpaperObject): void;
    getCurrentWallpaper(): WallpaperObject;
    loadWallpaperManifest(): Promise<any>;
    updateCurrentWallpaperElements(): void;
    setWallpaper(url: string): void;
    constructor();
    open(): Promise<WMWindow | undefined>;
}
