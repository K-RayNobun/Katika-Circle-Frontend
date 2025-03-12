import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
    name: string,
    surname: string,
    email: string,
    pwdhash: string,
    walletId: number | null,
    walletAdress?: string,
    country: string,
    countryCodeISO2?: string,
    verified: boolean,
    referralCode?: string,
    referralGain?: number,
    referralList?: Array<Referral>,
    cashback?: number,
}
interface Referral {
    id: number,
    fullname: string,
    gain: number
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
       },
       setWalletAdress : (state, action:PayloadAction<string>) => {
        state.walletAdress = action.payload
        console.log('\t ### The wallet address has been set as ', state.walletAdress);
       },
       setReferralCode: (state, action:PayloadAction<string>) => {
        state.referralCode = action.payload
        console.log('\t ### The referral Code is ', state.referralCode);
       },
       setReferralList: (state, action:PayloadAction<Array<Referral>>) => {
        state.referralList = action.payload
        console.log('\t  ### Just registered the user referrals as ', state.referralList)
       },
       provideCashback: (state, action:PayloadAction<number>) => {
        state.cashback = action.payload 
        console.log('\t ### The user cashback is ', state.cashback);
       },
       provideReferralGain: (state, action:PayloadAction<number>) => {
        state.referralGain = action.payload
        console.log('\t ### The user referral gain is ', state.referralGain);
       },
       provideFilleulsList: (state, action:PayloadAction<Array<Referral>>) => {
        state.referralList = action.payload
        console.log('\t ### The user referral list is ', state.referralList);
       },
    }
});

export const { createUser, verifyUser, setWalletAdress, setReferralCode, setReferralList, provideCashback, provideFilleulsList, provideReferralGain } = userSlice.actions;

export default userSlice.reducer;