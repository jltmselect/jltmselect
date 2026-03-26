import axios from "axios";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const { register, handleSubmit } = useForm();
    const [isSending, setIsSending] = useState(false);
    const forgotPasswordHandler = async (formData) => {
        try {
            setIsSending(true);
            const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/users/forgot-password`, { email: formData.email });

            if (data && data.success) {
                toast.success(data.message);
                onClose();
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message);
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit(forgotPasswordHandler)} className="bg-bg-secondary dark:bg-bg-primary rounded-2xl p-6 w-full max-w-md border border-gray-200 dark:border-bg-primary-light">
                <h3 className="text-lg font-semibold mb-4 text-text-primary dark:text-text-primary-dark">Reset Password</h3>
                <p className="text-text-secondary dark:text-text-secondary-dark mb-4">Enter your email to receive a password reset link.</p>
                <input
                    type="email"
                    placeholder="Your email"
                    className="w-full p-3 border border-gray-300 dark:border-bg-primary-light bg-bg-secondary dark:bg-bg-primary text-text-primary dark:text-text-primary-dark rounded-lg mb-4 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent"
                    {...register('email', { required: true })}
                />
                <div className="flex gap-3 justify-end">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="border border-gray-200 dark:border-bg-primary-light rounded-lg px-4 py-2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="px-4 py-2 bg-bg-primary text-pure-white dark:bg-bg-secondary dark:text-pure-black rounded-lg text-center flex justify-center items-center min-w-[120px]"
                    >
                        {
                            isSending ? <Loader className="animate-spin-slow" /> : 'Send Reset Link'
                        }
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordModal;