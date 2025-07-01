
export function getDeviceType() {
    // Find if the user is on a real phone or a PC
    const userAgent = navigator.userAgent ||  "";

    const hasTouchScreen = (() => {
        return (
            'ontouchstart' in window ||
            (navigator.maxTouchPoints && navigator.maxTouchPoints > 1)
        )
    })();

    const isMobile = /Android|iPhone|iPad|iPod/i.test(userAgent);

    const textResult  = `User is on a ${isMobile ? 'mobile' : 'desktop'} device \n Touch screen support: ${hasTouchScreen}`;
    return {isMobile, hasTouchScreen, textResult};
}

// Check if the app is a WPA
export function detectAppNature() {
    const isStandAlone = window.matchMedia?.('(display-mode: standalone)').matches ||
                         (window.matchMedia?.('(display-mode: fullscreen)').matches)

    return { isStandAlone };
}

