import React, { useState } from "react";
import { useTranslation } from "@/lib/hooks/useTranslation";
import axios from "axios";
import { LuEyeClosed, LuEye } from "react-icons/lu";

// Redux related imports
import { useAppSelector } from "@/lib/redux/hooks";

type UserData = {
    id: string;
    email: string;
    // Add other user data fields as needed
};

// New component to add in SettingsProfile.tsx
const NewPasswordModal = ({ onClose, setShowNewPasswordModal }: { onClose: () => void, setShowNewPasswordModal: (arg: boolean) => void }) => {
    const { t } = useTranslation();
    const accessToken = useAppSelector((state) => state.token.token);
    const userData = useAppSelector((state) => state.user) as UserData;

    const [errorMessage, setErrorMessage] = useState<string>();
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);


    const handleNewPasswordSubmit = async () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{6,}$/;
        
        if (!passwordRegex.test(newPassword)) {
            setErrorMessage(t('settingsProfile.newPasswordModal.passwordRequirements'));
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            setErrorMessage(t('settingsProfile.newPasswordModal.passwordsMustMatch'));
            return;
        }

        try {
            setShowNewPasswordModal(false);
            console.log('Password Updated. Sending OTP next...')
            await updateUserData();
        } catch (error) {
            setErrorMessage(t('settingsProfile.newPasswordModal.updateFailed'));
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

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
                <h2 className="text-xl font-bold mb-4">{t('settingsProfile.newPasswordModal.newPassword')}</h2>
                <div className="space-y-4">
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder={t('settingsProfile.newPasswordModal.enterNewPassword')}
                            className="w-full p-2 border rounded"
                        />
                        {
                            showPassword ? (
                                <LuEye size={20} className="absolute right-2 top-[50%] -translate-y-1/2 cursor-pointer text-gray_dark/50" onClick={() => setShowPassword(!showPassword)} />
                            ) : (
                                <LuEyeClosed size={20} className="absolute right-2 top-[50%] -translate-y-1/2 cursor-pointer text-gray_dark/50" onClick={() => setShowPassword(!showPassword)} />
                            )
                        }
                    </div>
                    
                    <div className="relative w-full ">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder={t('settingsProfile.newPasswordModal.confirmNewPassword')}
                            className="w-full p-2 border rounded"
                        />
                        {
                            showConfirmPassword ? (
                                <LuEye size={20} className="absolute right-2 top-[50%] -translate-y-1/2 cursor-pointer text-gray_dark/60" onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                            ) : (
                                <LuEyeClosed size={20} className="absolute right-2 top-[50%] -translate-y-1/2 cursor-pointer text-gray_dark/60" onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                            )
                        }
                        
                    </div>
                    {errorMessage && <p className="text-red text-center font-semibold text-sm">{errorMessage}</p>}
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