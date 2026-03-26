import { useState } from "react";
import { toast } from "react-hot-toast";

function OTP({ phone, onVerify, isLoading }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const handleChange = (index, value) => {
        if (value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input
            if (value && index < 5) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleVerify = () => {
        const otpString = otp.join('');
        if (otpString.length === 6) {
            onVerify(otpString);
        } else {
            toast.error('Please enter 6-digit OTP');
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <p className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">Verify OTP</p>
            <p className="mt-2 text-sm text-text-secondary dark:text-text-secondary-dark text-center">
                Enter the 6-digit code sent to {phone}
            </p>

            <div className="grid grid-cols-6 gap-2 sm:gap-3 w-11/12 mt-8">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-full h-12 bg-indigo-50 dark:bg-bg-primary-light text-text-primary dark:text-text-primary-dark text-xl rounded-md outline-none text-center focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark border border-gray-200 dark:border-bg-primary"
                        disabled={isLoading}
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={handleVerify}
                disabled={isLoading}
                className="mt-8 w-full max-w-80 h-11 rounded-full text-text-primary-dark dark:text-text-primary bg-bg-primary dark:bg-bg-secondary hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
            >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
        </div>
    );
}

export default OTP;