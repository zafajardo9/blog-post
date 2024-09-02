export { };

declare global {
    interface Window {
        _mtm: any[],
        dataLayer: any[]
    }
}