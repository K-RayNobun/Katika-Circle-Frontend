import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface Metadata {
    theme: 'light' | 'dark';
    isCookieConsent: boolean;
    pushSubscription: PushSubscriptionData | null,
}

interface PushSubscriptionData {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

const initialState: Metadata = {
    theme: 'light',
    isCookieConsent: false,
    pushSubscription: null,
}

const metadataSlice = createSlice({
    name: 'metadata',
    initialState,
    reducers: {
        // THEME RELATED
        changeTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
            document.documentElement.classList.toggle("dark", action.payload === "dark"); // Apply class to <html>
            // console.log('### Theme set to', state.theme);
        },
        detectSystemTheme: (state) => {
            if (typeof window !== 'undefined') {
                const storedTheme =  localStorage.getItem("teheme") as 'light' | 'dark' | null;
                const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                const newTheme =  storedTheme ?? (systemPrefersDark ? 'dark' : 'light');
                state.theme = newTheme;

                // The dark mode toggle has the functionnality to add `dark` to the html class
                document.documentElement.classList.toggle('dark', newTheme === 'dark');
            }
        },
        // COOKIES RELATED
        setCookieConsent: (state, action: PayloadAction<boolean>) => {
            state.isCookieConsent = action.payload;
            console.log('### Cookie consent set to', action.payload);
        },
        setPushSubscription: (state, action: PayloadAction<PushSubscriptionData | null>) => {
            state.pushSubscription = action.payload;
            // Optionally persist to localStorage
            if (action.payload) {
                localStorage.setItem('pushSubscription', JSON.stringify(action.payload));
            } else {
                localStorage.removeItem('pushSubscription');
            }
        },
        
        // Load stored subscription on app initialization
        loadStoredSubscription: (state) => {
        if (typeof window !== 'undefined') {
            const storedSub = localStorage.getItem('pushSubscription');
            if (storedSub) {
            state.pushSubscription = JSON.parse(storedSub);
            }
        }
        },
    }
});

export const { changeTheme, detectSystemTheme, setCookieConsent, setPushSubscription, loadStoredSubscription } = metadataSlice.actions;

export default metadataSlice.reducer;