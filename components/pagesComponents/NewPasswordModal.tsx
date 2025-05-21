import React, { useState } from "react";
import { useTranslation } from "@/lib/hooks/useTranslation";
import axios from "axios";

// Redux related imports
import { useAppSelector } from "@/lib/redux/hooks";

type UserData = {
    id: string;
    email: string;
    // Add other user data fields as needed
};

// New component to add in SettingsProfile.tsx
const NewPasswordModal = ({ onClose, setShowOTPModal, setShowNewPasswordModal }: { onClose: () => void, setShowOTPModal: (arg: boolean) => void, setShowNewPasswordModal: (arg: boolean) => void }) => {
    const { t } = useTranslation();
    const accessToken = useAppSelector((state) => state.token.token);
    const userData = useAppSelector((state) => state.user) as UserData;

    const [errorMessage, setErrorMessage] = useState<string>();
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');


    const handleNewPasswordSubmit = async () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{6,}$/;
        
        if (!passwordRegex.test(newPassword)) {
            setErrorMessage(t('settingsProfile.passwordRequirements'));
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            setErrorMessage(t('settingsProfile.passwordsMustMatch'));
            return;
        }

        try {
            await updateUserData();
            setShowNewPasswordModal(false);
            sendOTP();
            setShowOTPModal(true);
        } catch (error) {
            setErrorMessage(t('settingsProfile.updateFailed'));
            console.log(error);
        }
    };

    const updateUserData = async () => {
        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/user/${userData.id}`,
                { email: userData.email, pwd: newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            // console.log(t('settingsProfile.credentialsUpdated'), response.data);
        } catch {
            // console.error(t('settingsProfile.errorUpdating'), error);
        }
    };

    const sendOTP = async () => {
        // console.log('Sending OTP');
        // console.log('Access Token is: ', accessToken)
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/otp`,
            {},
        {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
        // console.log('Finished sending OTP with the token', accessToken);
        // console.log('Just sent the token successfully as ', response.data);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
                <h2 className="text-xl font-bold mb-4">{t('settingsProfile.newPassword')}</h2>
                <div className="space-y-4">
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t('settingsProfile.enterNewPassword')}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder={t('settingsProfile.confirmNewPassword')}
                        className="w-full p-2 border rounded"
                    />
                    {errorMessage && <p className="text-red text-sm">{errorMessage}</p>}
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                        >
                            {t('common.cancel')}
                        </button>
                        <button 
                            onClick={handleNewPasswordSubmit}
                            className="px-4 py-2 bg-primary text-white rounded"
                        >
                            {t('common.confirm')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewPasswordModal;