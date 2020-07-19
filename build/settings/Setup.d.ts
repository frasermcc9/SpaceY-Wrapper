export declare abstract class Setup {
    static socketPort: number;
    static socketUrl: string;
    static restPort: number;
    static restUrl: string;
    static changeSocketPort(port: number): void;
    static changeRestPort(port: number): void;
    static changeSocketUrl(url: string): void;
    static changeRestUrl(url: string): void;
}
