export function trackMatomoEvent(
    category: string,
    action: string,
    name?: string,
    value?: number
): void {
    if (typeof window !== 'undefined' && window._mtm) {
        window._mtm.push({
            'event': 'mtm.Event',
            'mtm.eventCategory': category,
            'mtm.eventAction': action,
            'mtm.eventName': name,
            'mtm.eventValue': value
        });
    }
}