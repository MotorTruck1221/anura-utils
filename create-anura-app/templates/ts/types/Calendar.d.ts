/// <reference types="dreamland" />
declare class Calendar {
    state: Stateful<{
        show?: boolean;
    }>;
    element: HTMLElement;
    calCSS: string;
    transition: string;
    show: string;
    hide: string;
    clickoffChecker: HTMLDivElement;
    updateClickoffChecker: (show: boolean) => void;
    open(): void;
    close(): void;
    toggle(): void;
    constructor(clickoffChecker: HTMLDivElement, updateClickoffChecker: (show: boolean) => void);
    init(): Promise<void>;
}
//# sourceMappingURL=Calendar.d.ts.map