declare class OobeView {
    content: HTMLElement;
    state: {
        color: string;
        text: string;
    };
    css: string;
    element: any;
    nextButton: HTMLElement;
    steps: {
        elm: any;
        on: () => void;
    }[];
    i: number;
    constructor();
    nextStep(): void;
    complete(): void;
}
declare function installx86(): Promise<void>;
declare function preloadFiles(): Promise<void>;
