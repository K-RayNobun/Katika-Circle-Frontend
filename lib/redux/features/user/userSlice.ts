import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
    id?: string,
    name: string,
    surname: string,
    email: string,
    phoneNumber?: string,
    pwdhash?: string,
    walletAddress?: string,
    country?: string,
    countryCodeISO2?: string,
    currencySymbol?: string,
    verified?: boolean,
    referralCode?: string,
    referralGain?: number,
    referralList?: Array<Referral>,
    cashback?: number,
    firstReferringCode?: string,
    profileImageKey?: string,
    language: string,
    isLoggedOut?: boolean,
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
    language: 'fr'
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
       createUser: (state, action: PayloadAction<User>) => {
        // console.log('CREATING USER...');
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.surname = action.payload.surname;
        state.email = action.payload.email;
        state.pwdhash = action.payload.pwdhash;
        state.country = action.payload.country;
        state.currencySymbol = action.payload.currencySymbol;
        console.log(`------------- USER CREATED : \n Name: ${state.name}\n Password Hash: ${state.pwdhash} \n Email: ${state.email}  -----------------`);
       },
       provideId: (state, action: PayloadAction<string>) => {
        state.id = action.payload;
       },
       verifyUser: (state, action:PayloadAction<boolean>) => {
        state.verified = action.payload;
        console.log('\t ###Verifying the user from email ', state.email, ' as ', state.verified);
       },
       setWalletAdress : (state, action:PayloadAction<string>) => {
        state.walletAddress = action.payload
        // console.log('\t ### The wallet address has been set as ', state.walletAddress);
       },
       setReferralCode: (state, action:PayloadAction<string>) => {
        state.referralCode = action.payload
        // console.log('\t ### The referral Code is ', state.referralCode);
       },
       setDefaultReferringCode: (state, action:PayloadAction<string>) => {
        state.firstReferringCode = action.payload
        // console.log('\t ### The First Referring code has been set to ', state.firstReferringCode);
       },
       setReferralList: (state, action:PayloadAction<Array<Referral>>) => {
        state.referralList = action.payload
        // console.log('\t  ### Just registered the user referrals as ', state.referralList)
       },
       setProfileImageKey: (state, action:PayloadAction<string>) => {
        state.profileImageKey = action.payload
        // console.log('\t  ### This user profile image has the key ', state.profileImageKey)
       },
       provideCashback: (state, action:PayloadAction<number>) => {
        state.cashback = action.payload 
        // console.log('\t ### The user cashback is ', state.cashback);
       },
       provideReferralGain: (state, action:PayloadAction<number>) => {
        state.referralGain = action.payload
        // console.log('\t ### The user referral gain is ', state.referralGain);
       },
       provideFilleulsList: (state, action:PayloadAction<Array<Referral>>) => {
        state.referralList = action.payload
        // console.log('\t ### The user referral list is ', state.referralList);
       },
       setLanguage: (state, action: PayloadAction<string>) => {
        state.language = action.payload;
       },
       // Logout logic
       resetUser: (state) => {
        state.id = '';
        state.verified = false;
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
        state.isLoggedOut = true;
        console.log('USER DATA HAVE BEEN RESET');
       }
    }
});

export const { createUser, verifyUser, setWalletAdress, setReferralCode, setDefaultReferringCode, setProfileImageKey, setReferralList, setLanguage, provideCashback, provideId, provideFilleulsList, provideReferralGain, resetUser } = userSlice.actions;

export default userSlice.reducer;