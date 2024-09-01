/// <reference types="dreamland" />
declare class NotificationService {
    state: Stateful<{
        notifications: AnuraNotification[];
        render: boolean;
    }>;
    css: string;
    element: JSX.Element;
    get notifications(): AnuraNotification[];
    set notifications(value: AnuraNotification[]);
    constructor();
    add(params: NotifParams): void;
    remove(notification: AnuraNotification, rendererOnly?: boolean): void;
    subscribe(callback: (notifications: AnuraNotification[]) => void): () => void;
    setRender(render: boolean): void;
}
interface NotifParams {
    title?: string;
    description?: string;
    timeout?: number | "never";
    callback?: (notif: AnuraNotification) => void;
    closeIndicator?: boolean;
    buttons?: Array<{
        text: string;
        style?: "contained" | "outlined" | "text";
        callback: (notif: AnuraNotification) => void;
        close?: boolean;
    }>;
}
declare class AnuraNotification implements NotifParams {
    title: string;
    description: string;
    timeout: number | "never";
    closeIndicator: boolean;
    callback: (_notif: AnuraNotification) => null;
    buttons: Array<{
        text: string;
        style?: "contained" | "outlined" | "text";
        callback: (notif: AnuraNotification) => void;
    }>;
    close: () => void;
    state: Stateful<{
        timedOut: boolean;
    }>;
    css: string;
    element: HTMLElement;
    constructor(params: NotifParams, close: () => void);
}
//# sourceMappingURL=NotificationService.d.ts.map