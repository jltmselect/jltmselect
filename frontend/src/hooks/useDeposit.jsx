import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';

const useAuctionDeposit = () => {
    const [processingDeposit, setProcessingDeposit] = useState(false);

    const checkAndProcessDeposit = async (auctionId, amount, actionType = 'bid') => {
        try {
            setProcessingDeposit(true);

            // Check deposit status
            const { data: depositCheck } = await axiosInstance.get(`/api/v1/bid-deposit/check/${auctionId}`);

            const isDepositRequired = depositCheck.data.settings?.isActive === true;
            const hasExistingDeposit = depositCheck.data.hasDeposit;

            // Case 1: Deposit disabled - proceed immediately
            if (!isDepositRequired) {
                return {
                    success: true,
                    requiresDeposit: false,
                    message: 'Deposit not required'
                };
            }

            // Case 2: Deposit already paid - proceed
            if (hasExistingDeposit) {
                return {
                    success: true,
                    requiresDeposit: true,
                    hasDeposit: true,
                    message: 'Deposit already paid'
                };
            }

            // Case 3: Need to pay deposit
            toast.loading('Processing deposit payment...', { id: 'deposit' });

            // Pass the action type to the API
            const { data: depositData } = await axiosInstance.post('/api/v1/bid-deposit/create', {
                auctionId,
                bidAmount: parseFloat(amount),
                action: actionType // Pass the action type
            });

            if (!depositData.success) {
                throw new Error('Failed to process deposit');
            }

            toast.success(`Deposit of $${depositData.data.deposit.amount} successful!`, { id: 'deposit' });

            return {
                success: true,
                requiresDeposit: true,
                hasDeposit: true,
                depositAmount: depositData.data.deposit.amount,
                deposit: depositData.data.deposit
            };

        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to process deposit', { id: 'deposit' });
            return {
                success: false,
                error: error?.response?.data?.message || 'Deposit failed'
            };
        } finally {
            setProcessingDeposit(false);
        }
    };

    return {
        checkAndProcessDeposit,
        processingDeposit
    };
};

export default useAuctionDeposit;