import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Transaction {
    code?: string,
    issuerId?: string,
    status?: string,
    statusCode?: number, // 1 for failed, 2 for cancelled, 3 for pending and 4 for completed
    date?: string,
    receiverPhoneNumber?: string,
    receiverName?: string,
    amountSent?: number,
    currencySent?: string,
    amountReceived?: number,
    currencyReceived?: string,
    receiverCountry?: string,
    cashback?: number,
    referralGain?: number,
    latestScreen?: number,
    transfertType?: string,
    bankAccountOwner?: string,
    iban?: string,
    bankCode?: string,
    bankName?: string,

    tranzaktoken?: string,
}

const initialState: Transaction = {
    code: 'EURXAF001',
    latestScreen: 1,
    tranzaktoken: '1KHK045K281DTCREHXMHRY0X1T0KK5WWWKHK5TXHYHPYMK5U'
};

const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        provideToken: (state, action: PayloadAction<string>)  => {
            state.tranzaktoken = action.payload
        },
        provideStatus: (state, action: PayloadAction<string>) => {
            state.status = action.payload;
        },
       provideStepOneData: (state, action: PayloadAction<Transaction>) => {
        state.code = action.payload.code;
        state.issuerId = action.payload.issuerId;
        state.amountSent = action.payload.amountSent;
        state.currencySent = action.payload.currencySent;
        state.amountReceived = action.payload.amountReceived;
        state.currencyReceived = action.payload.currencyReceived;
        state.receiverCountry = action.payload.receiverCountry;
        state.latestScreen = action.payload.latestScreen;
        state.referralGain = state.amountReceived! * 0.02;
        state.cashback = state.amountReceived! * 0.001;
        console.log('Transactiond Details:', '\nCode: ' + state.code + '\Issuer Id: ' + state.issuerId + '\n Amount Sent: ' + state.amountSent + '\n in ' + state.currencySent + '\n Receiver Country: ' + state.receiverCountry + '\n Amount Received: ' + state.amountReceived);
       },
       provideStepMobileData: (state, action: PayloadAction<Transaction>) => {
        state.transfertType = action.payload.transfertType;
        state.receiverPhoneNumber = action.payload.receiverPhoneNumber;
        state.receiverName = action.payload.receiverName;
        state.latestScreen = action.payload.latestScreen;
        console.log('Mobile Step details: \n Transfert type: ' + state.transfertType + '\n Receiver Phone Number: ' + state.receiverPhoneNumber + '\n Receiver Name: ' + state.receiverName);
       },
       provideStepBankData: (state, action: PayloadAction<Transaction>) => {
        state.bankAccountOwner = action.payload.bankAccountOwner;
        state.iban = action.payload.iban;
        state.bankCode = action.payload.bankCode;
        state.bankName = action.payload.bankName;
        state.latestScreen = action.payload.latestScreen;
        console.log('Bank Step details: \n Bank Account Owner: ' + state.bankAccountOwner + '\n IBAN: ' + state.iban + '\n Bank Code: ' + state.bankCode + '\n Bank Name: ' + state.bankName);
       }
    }
});

export const { provideStepOneData, provideStepMobileData, provideStepBankData, provideToken, provideStatus } = transactionSlice.actions;

export default transactionSlice.reducer;