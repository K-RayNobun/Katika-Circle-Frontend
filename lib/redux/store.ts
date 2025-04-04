import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { combineReducers } from 'redux';
import Storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

import metadataReducer from './features/metadata/metadataSlice'; 
import userReducer from './features/user/userSlice';
import tokenReducer from './features/token/tokenSlice';
import TransactionReducer from './features/transaction/transactionSlice'

const rootReducer = combineReducers({
    metadata: metadataReducer,
    user: userReducer,
    token: tokenReducer,
    transaction: TransactionReducer,
});

const persistConfig = {
    key: 'data',
    storage: Storage,
    whitelist: ['token', 'user', 'transaction', 'counter'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const makeStore = () => configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),

    devTools: process.env.NODE_ENV !== 'production',
});

export const store = makeStore();

// persistor
export const persistor = persistStore(store);

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const wrapper =  createWrapper<AppStore>(makeStore, {
    debug: process.env.NODE_ENV !== 'production',
});