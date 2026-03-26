import { X } from "lucide-react";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

function EmailVerificationWarning({ user }) {
    const [visibility, setVisibility] = useState(true);

    if (!visibility) return null;

    const handleResendSubmit = async () => {
        if (!user?.email) {
            toast.error('Email address is required');
            return;
        }

        try {
            await toast.promise(
                axiosInstance.post('/api/v1/users/resend-verification', {
                    email: user?.email
                }),
                {
                    loading: 'Resending verification email...',
                    success: (response) => {
                        if (response.data.success) {
                            return 'Verification email resent! Please check your inbox.';
                        }
                        throw new Error('Failed to resend verification email');
                    },
                    error: (error) =>
                        error?.response?.data?.message || 'Failed to resend verification email'
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] max-w-2xl w-full px-6 py-4 bg-yellow-50 border-l-4 border-yellow-400 shadow-lg rounded">
            <h2 className="text-lg font-semibold text-yellow-800">
                Email Verification Required
            </h2>

            <p className="mt-2 text-sm text-yellow-700">
                Please verify your email address to access all features of your account.
                Check your inbox for a verification email and click the link provided or <span className="text-yellow-900 underline hover:cursor-pointer" onClick={handleResendSubmit}>resend link</span>.
            </p>

            <span
                onClick={() => setVisibility(false)}
                className="absolute right-3 top-3"
            >
                <X className="text-yellow-700 cursor-pointer hover:opacity-70" size={18} />
            </span>
        </div>
    );
}

export default EmailVerificationWarning;