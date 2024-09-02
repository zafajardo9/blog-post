"use client"

import Script from 'next/script'
import { useEffect } from 'react'

declare global {
    interface Window {
        dataLayer: any[]
    }
}

const GA_MEASUREMENT_ID = 'G-H5GM98TPXW'

export function GoogleTag() {
    useEffect(() => {
        window.dataLayer = window.dataLayer || []
        function gtag(...args: any[]) {
            window.dataLayer.push(args)
        }
        gtag('js', new Date())
        gtag('config', GA_MEASUREMENT_ID)
    }, [])

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
            </Script>
        </>
    )
}