import { Router } from 'express';
import { 
    getAdminStats,
    getAllUsers,
    getUserDetails,
    updateUserStatus,
    deleteUser,
    updateUserType,
    getAllAuctions,
    getAuctionDetails,
    updateAuctionStatus,
    approveAuction,
    endAuction,
    deleteAuction,
    updateAuction,
    updatePaymentStatus,
    verifyUserIdentity,
    rejectUserIdentity,
    createCashier,
    getCashiers,
    getCashierById,
    updateCashier,
    updateCashierStatus,
    deleteCashier
} from '../controllers/admin.controller.js';
import { authAdmin } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
import { getAdminTransactions, getTransactionStats } from '../controllers/transaction.controller.js';

const AdminRouter = Router();

AdminRouter.get('/stats', authAdmin, getAdminStats);
AdminRouter.get('/users', authAdmin, getAllUsers);
AdminRouter.get('/users/:userId', authAdmin, getUserDetails);
AdminRouter.patch('/users/:userId/status', authAdmin, updateUserStatus);
AdminRouter.patch('/users/:userId/type', authAdmin, updateUserType);
AdminRouter.delete('/users/:userId', authAdmin, deleteUser);

AdminRouter.patch('/users/:userId/identificationDocument/verify', authAdmin, verifyUserIdentity);
AdminRouter.patch('/users/:userId/identificationDocument/reject', authAdmin, rejectUserIdentity);

// Auction management routes
AdminRouter.get('/auctions', authAdmin, getAllAuctions);
AdminRouter.get('/auctions/:auctionId', authAdmin, getAuctionDetails);
AdminRouter.patch('/auctions/:auctionId/status', authAdmin, updateAuctionStatus);
AdminRouter.patch('/auctions/:auctionId/approve', authAdmin, approveAuction);
AdminRouter.patch('/auctions/:auctionId/end', authAdmin, endAuction);
AdminRouter.delete('/auctions/:auctionId', authAdmin, deleteAuction);
AdminRouter.put('/auctions/:id', authAdmin, upload.fields([
    { name: 'photos' },
    { name: 'documents' },
    { name: 'serviceRecords' },
]), updateAuction);
AdminRouter.get('/transactions', authAdmin, getAdminTransactions);
AdminRouter.get('/transactions/stats', authAdmin, getTransactionStats);
AdminRouter.put('/:id/payment-status', 
    authAdmin, 
    upload.single('invoice'), 
    updatePaymentStatus
);

// Cashier Management Routes
AdminRouter.post('/cashiers/create', authAdmin, createCashier);
AdminRouter.get('/cashiers', authAdmin, getCashiers);
AdminRouter.get('/cashiers/:id', authAdmin, getCashierById);
AdminRouter.put('/cashiers/:id', authAdmin, updateCashier);
AdminRouter.patch('/cashiers/:id/status', authAdmin, updateCashierStatus);
AdminRouter.delete('/cashiers/:id', authAdmin, deleteCashier);
export default AdminRouter;