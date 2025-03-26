import React, { useState } from 'react';
import { FaRegBell, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { resetUser, setProfileImageKey } from '@/lib/redux/features/user/userSlice';
import { resetToken } from '@/lib/redux/features/token/tokenSlice';
import { resetTransaction } from '@/lib/redux/features/transaction/transactionSlice';

interface userProfileProps {
    userName: string,
    userSurname: string,
}

const UserProfile = ({ userName, userSurname }: userProfileProps) => {
    const [isLogoutVisible, setIsLogoutVisible] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const profileImageKey = useAppSelector((state) => state.user.profileImageKey)
    const dispatch = useAppDispatch();
    const router = useRouter();
    const logoutUser = () => {
        dispatch(resetUser());
        dispatch(resetToken());
        dispatch(resetTransaction());
        router.push('/auth/signin');
    };
    // Sample images (replace with your own image URLs)
    const images = [
        { key: '1', url: 'https://img.freepik.com/premium-vector/profile-picture-african-american-person-flat-cartoon-style-minimalist-style_1099486-3.jpg?w=2000' },
        { key: '2', url: 'https://img.freepik.com/premium-photo/people-portrait-cartoon-flat-vector-profile-picture_606187-1136.jpg?w=2000' },
        { key: '3', url: 'https://th.bing.com/th/id/OIP.3xZ9SnrBxfW3u8E9jbZEaAAAAA?rs=1&pid=ImgDetMain' },
        { key: '4', url: 'https://img.freepik.com/premium-vector/profile-picture-african-american-person-flat-cartoon-style-minimalist-style_1099486-6.jpg?w=1380' },
        { key: '5', url: 'https://i.etsystatic.com/24010889/r/il/df7daf/2445258956/il_fullxfull.2445258956_35fl.jpg' },
        { key: '6', url: 'https://i.pinimg.com/736x/6d/1e/bf/6d1ebf50b4a2c395dabbd4f8c1670c4b.jpg' },
    ];

    const handleImageClick = (imageKey: string) => {
        setSelectedImage(imageKey);
        setIsModalVisible(false); // Close the modal after selection
        dispatch(setProfileImageKey(imageKey));
    };

    return (
        <div className={`absolute top-[12px] 
        right-[12px] lg:absolute flex w-[400px] justify-between px-[20px] lg:pr-[0px] h-[59px] transition-all duration-2000`}>
            <div className={`size-[59px] bg-white flex justify-center items-center`}>
                <FaRegBell size={24} className={`h-[64px] lg:h-[80px] text-gray_dark/60`} />
            </div>
            <div className={`relative h-full flex items-center rounded-[8px] gap-[16px] px-[24px] py-[9px] bg-white`}>
                <div onClick={() => setIsModalVisible(true)} className={`size-[41px] rounded-sm bg-gray`}>
                    {/* Profile Image here */}
                    {(selectedImage && (
                        <img
                            src={images.find((img) => img.key === selectedImage)?.url}
                            alt='Profile'
                            className='w-full h-full rounded-sm'
                        />
                    ))|| 
                    (profileImageKey && <img
                            src={images.find((img) => img.key === profileImageKey)?.url}
                            alt='Profile'
                            className='w-full h-full rounded-sm'
                    />)
                    }
                </div>
                <button onClick={() => setIsLogoutVisible((prev) => !prev)} className={`flex justify-between items-center text-gray_dark/60 hover:text-primary_dark w-[164px]`}>
                    <h5 className={`text-[16px] leading-[20px] font-semibold`}>{`${userName}  ${userSurname}`}</h5>
                    {
                    !isLogoutVisible ? 
                    <FaChevronDown className={`h-[16px] transition-all duration-400`} />
                        :
                    <FaChevronUp className={`h-[16px] transition-all duration-400`} />
                    }
                </button>
                { isLogoutVisible && <div className={`absolute top-[10%] transition-all duration-2000 translate-y-[60px] right-[0] bg-white rounded-[12px] w-[70%] px-[16px] py-[8px]`}>
                    <button onClick={logoutUser} className={`w-full py-[6px] text-primary_dark font-semibold active:scale-110`}>Logout</button>
                </div>}
            </div>

            {isModalVisible && (
                <div className='fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/50 z-50'>
                    <div className='bg-white rounded-[12px] p-[24px] w-[90%] lg:w-[50%] max-h-[80vh] overflow-auto'>
                        <h3 className='text-[24px] font-bold mb-[16px]'>Select a Profile Image</h3>
                        <div className='grid grid-cols-2 lg:grid-cols-3 gap-[16px]'>
                            {images.map((image) => (
                                <div
                                    key={image.key}
                                    className='cursor-pointer hover:scale-105 transition-transform duration-300'
                                    onClick={() => handleImageClick(image.key)}
                                >
                                    <img
                                        src={image.url}
                                        alt={`Profile ${image.key}`}
                                        className='w-full h-auto rounded-[8px]'
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setIsModalVisible(false)}
                            className='mt-[16px] bg-primary text-white px-[16px] py-[8px] rounded-[8px]'
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;