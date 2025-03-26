import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
    id?: string,
    name: string,
    surname: string,
    email: string,
    pwdhash?: string,
    walletAddress?: string,
    country?: string,
    countryCodeISO2?: string,
    verified?: boolean,
    referralCode?: string,
    referralGain?: number,
    referralList?: Array<Referral>,
    cashback?: number,
    firstReferringCode?: string,
    profileImageKey?: string,
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
    country: '',
    verified: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
       createUser: (state, action: PayloadAction<User>) => {
        console.log('Hello I am creating a user...');
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.surname = action.payload.surname;
        state.email = action.payload.email;
        state.pwdhash = action.payload.pwdhash;
        state.country = action.payload.country;
        console.log('The user information are : ', state.name + state.pwdhash  + state.email);
       },
       provideId: (state, action: Payload<string>) => {
        state.id = action.payload;
       },
       verifyUser: (state, action:PayloadAction<boolean>) => {
        state.verified = action.payload;
        console.log('\t ###Verifying the user as ', state.verified);
       },
       setWalletAdress : (state, action:PayloadAction<string>) => {
        state.walletAddress = action.payload
        console.log('\t ### The wallet address has been set as ', state.walletAddress);
       },
       setReferralCode: (state, action:PayloadAction<string>) => {
        state.referralCode = action.payload
        console.log('\t ### The referral Code is ', state.referralCode);
       },
       setFirstReferringCode: (state, action:PayloadAction<string>) => {
        state.firstReferringCode = action.payload
        console.log('\t ### The First Referring code has been set to ', state.firstReferringCode);
       },
       setReferralList: (state, action:PayloadAction<Array<Referral>>) => {
        state.referralList = action.payload
        console.log('\t  ### Just registered the user referrals as ', state.referralList)
       },
       setProfileImageKey: (state, action:PayloadAction<string>) => {
        state.profileImageKey = action.payload
        console.log('\t  ### This user profile image has the key ', state.profileImageKey)
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
       // Logout logic
       resetUser: (state) => {
        state.id = '';
        state.name = '';
        state.surname = '';
        state.email = '';
        state.pwdhash = '';
        state.walletAddress = '';
        state.country = '';
        state.referralCode = '';
        state.referralGain = 0;
        state.referralList = [];
        state.cashback = 0;
       }
    }
});

export const { createUser, verifyUser, setWalletAdress, setReferralCode, setFirstReferringCode, setProfileImageKey, setReferralList, provideCashback, provideId, provideFilleulsList, provideReferralGain, resetUser } = userSlice.actions;

export default userSlice.reducer;