import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { increment } from '../counterSlice';

interface User {
    name: string,
    surname: string,
    email: string,
    pwdhash: string,
    walletId: number | null,
    country: string,
    countryCodeISO2?: string,
    verified: boolean,
}

const initialState: User = {
    name: '',
    surname: '',
    email: '',
    pwdhash: '',
    walletId: null,
    country: '',
    verified: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
       createUser: (state, action: PayloadAction<User>) => {
        console.log('Hello I am creating a user...');
        state.name = action.payload.name;
        state.surname = action.payload.surname;
        state.email = action.payload.email;
        state.pwdhash = action.payload.pwdhash;
        state.walletId = action.payload.walletId;
        state.country = action.payload.country;
        console.log('The user information are : ', state.name + state.pwdhash  + state.email);
       },
       verifyUser: (state, action:PayloadAction<boolean>) => {
        state.verified = action.payload
        console.log('\t ###Verifying the user as ', state.verified);
       }
    }
});

export const { createUser, verifyUser } = userSlice.actions;

export default userSlice.reducer;