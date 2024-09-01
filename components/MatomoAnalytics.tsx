"use client"

import Script from 'next/script';
import { useEffect } from 'react';

export function MatomoAnalytics(): JSX.Element {
    useEffect(() => {
        window._mtm = window._mtm || [];
        window._mtm.push({ 'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start' });
    }, []);

    return (
        <Script
            strategy="afterInteractive"
            src="https://cdn.matomo.cloud/blogposttwoberylvercelapp.matomo.cloud/container_Pjg4ndHn.js"
        />
    );
}