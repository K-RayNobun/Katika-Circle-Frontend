import React from 'react';
import ScreenOne from '@/components/transaction_screens/ScreenOne';
import ScreenTwo from '@/components/transaction_screens/ScreenTwo';
import ScreenThree from '@/components/transaction_screens/ScreenThree';
import ScreenFour from '@/components/transaction_screens/ScreenFour';
import TransakSDK from '@/components/transaction_screens/TransakSDK';

const TransactionScreens = ({screenIndex, closeScreen, moveToScreen}: { screenIndex: number, closeScreen: () => void, moveToScreen: (index: number) => void }) => {
    return (
        <div className={`fixed top-0 left-0 right-0 z-20 flex bottom-0 items-end lg:items-center justify-center w-screen h-full bg-black/40`}>
            { screenIndex==1 && <ScreenOne onClose={closeScreen} moveToScreen={moveToScreen}/>}
            { screenIndex==2 && <ScreenTwo onClose={closeScreen} moveToScreen={moveToScreen} />}
            { screenIndex==3 && <ScreenThree onClose={closeScreen} moveToScreen={moveToScreen} />}
            { screenIndex==4 && <TransakSDK onClose={closeScreen} moveToScreen={moveToScreen} />}
            { screenIndex==5 && <ScreenFour onClose={closeScreen} />}
        </div>
    );
};

export default TransactionScreens;