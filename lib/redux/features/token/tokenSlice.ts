import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Token {
  token: string|null;
  expiresIn?: number|null;
}

const initialState: Token = {
  token: null,
};

const tokenSlice = createSlice({
    name: 'accesstoken',
    initialState,
    reducers: {
        renewToken: (state, action: PayloadAction<Token>) => {
            state.token = action.payload.token;
            state.expiresIn = action.payload.expiresIn;
            console.log('Token : ', state.token + ' is valid for ' + state.expiresIn + ' time')
        },
        clearToken: (state) => {
            state.token = null;
            state.expiresIn = null;
        },
        resetToken: (state) => {
            state.token = null;
            state.expiresIn = null;
            console.log('Token has been reset')
        }
    }
});

export const { renewToken, clearToken, resetToken } = tokenSlice.actions;

export default tokenSlice.reducer;