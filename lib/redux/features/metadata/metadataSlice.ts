import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Metadata {
    theme: 'light' | 'dark';
}

const initialState: Metadata = {
    theme: 'light'
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        changeTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
            document.documentElement.classList.toggle("dark", action.payload === "dark"); // Apply class to <html>
            console.log('### Theme set to', state.theme);
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
        }
    }
});

export const { changeTheme, detectSystemTheme } = themeSlice.actions;

export default themeSlice.reducer;