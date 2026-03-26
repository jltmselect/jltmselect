import { useForm } from "react-hook-form";
import { Container } from "../components";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { EyeIcon, EyeOff, Loader, Lock } from "lucide-react";
import { useState, useEffect } from "react";

function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit } = useForm({
        defaultValues: {
            newPassword: ''
        }
    });

    useEffect(() => {
        // Better token extraction that handles URL parameters properly
        const urlParams = new URLSearchParams(location.search);
        const tokenFromUrl = urlParams.get('token');

        if (!tokenFromUrl) {
            toast.error('Invalid or missing reset token');
            navigate('/');
            return;
        }
        setToken(tokenFromUrl);
    }, [location.search, navigate]);

    const resetPasswordHandler = async (formData) => {
        if (!token) {
            toast.error('Invalid reset token');
            return;
        }

        try {
            setIsLoading(true);
            const { data } = await axios.post(
                `${import.meta.env.VITE_DOMAIN_URL}/api/v1/users/reset-password/${token}`,
                { newPassword: formData.newPassword }
            );

            if (data.success) {
                toast.success(data.message);
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    }

    if (!token) {
        return (
            <Container className="mt-20 min-h-[70vh] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-text-secondary dark:text-text-secondary-dark">Loading...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-0 min-h-[90vh] flex items-center justify-center bg-bg-secondary dark:bg-bg-primary">
            <section className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 bg-gradient-to-b from-bg-primary/[0.03] to-transparent dark:from-white/[0.03] dark:to-transparent px-6 sm:px-8 md:px-10 py-10 rounded-md drop-shadow-xl border-2 border-blue-100 dark:border-bg-primary-light relative flex overflow-hidden">
                <form onSubmit={handleSubmit(resetPasswordHandler)} className="w-full">
                    <h3 className="text-2xl text-center mb-3 text-text-primary dark:text-text-primary-dark">Reset Password</h3>

                    <div className="text-text-secondary dark:text-text-secondary-dark grid grid-cols-1 my-2">
                        <div className="relative">
                            <input
                                id="newPassword"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter new password"
                                className="text-text-primary dark:text-text-primary-dark border-2 border-blue-100 dark:border-bg-primary-light bg-bg-secondary dark:bg-bg-primary py-2.5 px-4 focus-within:outline-2 focus-within:outline-blue-200 dark:focus-within:outline-gray-500 rounded my-1 w-full placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark"
                                {...register('newPassword', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    }
                                })}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark"
                            >
                                {showPassword ? <EyeIcon size={18} /> : <EyeOff size={18} />}
                            </span>
                        </div>
                    </div>

                    <button
                        className="w-full bg-bg-primary dark:bg-bg-secondary text-text-primary-dark dark:text-text-primary hover:opacity-90 rounded cursor-pointer my-2 font-light disabled:cursor-not-allowed flex items-center justify-center py-2 transition-colors duration-300"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className="animate-spin-slow" /> : 'Reset Password'}
                    </button>
                </form>
            </section>
        </Container>
    );
}

export default ResetPassword;