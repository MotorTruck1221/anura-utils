declare class NotificationService {
    element: any;
    notifications: AnuraNotification[];
    constructor();
    add(params: NotifParams): void;
    remove(notification: AnuraNotification): void;
}
interface NotifParams {
    title?: string;
    description?: string;
    timeout?: number;
    callback?: () => void;
    closeIndicator?: boolean;
}
declare class AnuraNotification {
    title: string;
    description: string;
    timeout: number;
    closeIndicator: boolean;
    callback: () => null;
    close: () => void;
    element: HTMLElement;
    constructor(params: NotifParams, close: () => void);
    show(): Promise<void>;
}
