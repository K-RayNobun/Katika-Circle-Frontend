import React, { useEffect } from 'react';
import { TutorialProvider } from './hooks/TutorialContext';

import FirstTutorialContainer from '@/components/transaction_screens/components/FirstTutorialContainer';

import ScreenOne from '@/components/transaction_screens/screens/ScreenOne';
import ScreenTwo from '@/components/transaction_screens/screens/ScreenTwo';
import ScreenThree from '@/components/transaction_screens/screens/ScreenThree';
import ScreenFour from '@/components/transaction_screens/screens/ScreenFour';
// import TransakSDK from '@/components/transaction_screens/screens/TransakSDK';
import TransakRedirect from '@/components/transaction_screens/screens/TransakRedirect';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setPassedTutorials } from '@/lib/redux/features/user/userSlice';

const TransactionScreens = ({screenIndex, closeScreen, moveToScreen}: { screenIndex: number, closeScreen: () => void, moveToScreen: (index: number) => void }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // This effect can be used to initialize or fetch data when the component mounts
        console.log(`Current screen index: ${screenIndex}`);
    }, [screenIndex]);
    
    return (
        <div className={`fixed top-0 left-0 right-0 z-30 flex bottom-0 items-end lg:items-center justify-center w-screen h-full bg-black/40`}>
            <TutorialProvider steps={[]}>
                { screenIndex==0 && <FirstTutorialContainer 
                                            onClose={closeScreen} 
                                            onFinish={
                                                () => {
                                                    moveToScreen(1);
                                                    dispatch(setPassedTutorials(true));
                                                    console.log('Tutorial completed, moving to screen 1');
                                                }
                                            } />
                }
                { screenIndex==1 && <ScreenOne onClose={closeScreen} moveToScreen={moveToScreen}/>}
                { screenIndex==2 && <ScreenTwo onClose={closeScreen} moveToScreen={moveToScreen} />}
                { screenIndex==3 && <ScreenThree onClose={closeScreen} moveToScreen={moveToScreen} />}
                { screenIndex==4 && <TransakRedirect onClose={closeScreen} moveToScreen={moveToScreen} />}
                {/* { screenIndex==4 && <TransakSDK onClose={closeScreen} moveToScreen={moveToScreen} />} */}
                { screenIndex==5 && <ScreenFour onClose={closeScreen} />}
            </TutorialProvider>
        </div>
    );
};

export default TransactionScreens;