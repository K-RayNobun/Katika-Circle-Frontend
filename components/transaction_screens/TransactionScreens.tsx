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
import { useApiGet } from '@/lib/hooks/useApiRequest';
import { setPassedTutorials } from '@/lib/redux/features/user/userSlice';



interface Transaction {
  creationDate: string;
  transactionStatus: string;
  amount: number;
  currency: string;
  cashBack: {
    amount: number;
  };
  recipient: {
    name: string;
  };
}

const TransactionScreens = ({screenIndex, closeScreen, moveToScreen}: { screenIndex: number, closeScreen: () => void, moveToScreen: (index: number) => void }) => {
    const dispatch = useAppDispatch();
    const { fetchData } = useApiGet();

    useEffect(() => {
        // This effect can be used to initialize or fetch data when the component mounts
        console.log(`Current screen index: ${screenIndex}`);
    }, [screenIndex]);

    useEffect(() => {
        const fecthTransactionList = async () => {            
            // console.log('We got this list of transactions: ', response.data.data);
          const {response: result} = await fetchData(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/transactions/user`);
            const fetchedList = result!.slice().reverse();
            // Check if fetchedList has any successful transactions;
            if (fetchedList.length === 0) {
                console.warn('No transactions found');
                return;
            } else if (fetchedList.length > 0) {
                console.log(`Fetched ${fetchedList.length} transactions`);
                // Count the transaction which transactionStatus is 'completed'
                const completedTransactions = fetchedList.filter((transaction: Transaction) => transaction.transactionStatus.toLowerCase() === 'success');
                console.log(`Number of completed transactions: ${completedTransactions.length}`);
                if(completedTransactions.length > 0) {
                    dispatch(setPassedTutorials(true));
                    console.log('User doesn\'t needs the tutorial');
                }
            }
            
            console.log(' The list of ransactions is: ', fetchedList);
        }
    
        fecthTransactionList();
      }, []);
    
    return (
        <div className={`fixed top-0 left-0 right-0 z-30 flex bottom-0 items-end lg:items-center justify-center w-screen h-full bg-black/40`}>
            <TutorialProvider steps={[]}>
                { screenIndex==0 && <FirstTutorialContainer 
                                            onClose={closeScreen} 
                                            onFinish={
                                                () => {
                                                    moveToScreen(1);
                                                    dispatch(setPassedTutorials(true));
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