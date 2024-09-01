import { init as amplitudeInit } from '@amplitude/analytics-browser';

export const initAmplitude = () => {
    if (typeof window !== 'undefined') {
        amplitudeInit('2e677af5b10413eb24afa8d1c28b9b29', {
            defaultTracking: true,
        });
    }
};