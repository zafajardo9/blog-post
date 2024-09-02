// lib/gtag.ts

// Declare the gtag function
declare global {
    interface Window {
        gtag: (
            command: 'config' | 'event',
            targetId: string,
            params?: { [key: string]: any }
        ) => void;
    }
}

export const GA_MEASUREMENT_ID = 'G-H5GM98TPXW'

// Pageview function
export const pageview = (url: string): void => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: url,
        });
    }
};

// Event function
export const event = ({ action, category, label, value }: {
    action: string;
    category: string;
    label: string;
    value: number;
}): void => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};