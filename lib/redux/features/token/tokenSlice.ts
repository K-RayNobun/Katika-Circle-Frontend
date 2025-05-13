import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Token {
  token: string|null;
  expiresIn?: number|null;
}

const initialState: Token = {
  token: null,
};

export const renewToken = createAsyncThunk('accesstoken/renewToken',
    async (tokenData: { token: string; expiresIn?: number }) => {
        // Any async logic here
        return tokenData;
    }
)

const tokenSlice = createSlice({
    name: 'accesstoken',
    initialState,
    reducers: {
        // renewToken: (state, action) => {
        //     state.token = action.payload.token;
        //     state.expiresIn = action.payload.expiresIn;
        // },
        clearToken: (state) => {
            state.token = null;
            state.expiresIn = null;
        },
        resetToken: (state) => {
            state.token = null;
            state.expiresIn = null;
            // console.log('Token has been reset')
        }
    },
    extraReducers: (builder) => {
        builder.addCase(renewToken.fulfilled, (state, action) => {
            state.token = action.payload.token;
            state.expiresIn = action.payload.expiresIn;
            //  Display the token in the console
            console.log('------------ The access token is ------------', state.token);
        });
    }
});

export const { clearToken, resetToken } = tokenSlice.actions;

export default tokenSlice.reducer;