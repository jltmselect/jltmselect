// routes/bidDeposit.routes.js
import express from 'express';
import { authBidder } from '../middlewares/auth.middleware.js';
import {
    createBidDeposit,
    checkBidDeposit,
    getUserDeposits
} from '../controllers/bidDeposit.controller.js';

const bidDepositRouter = express.Router();

// All routes require authentication
// bidDepositRouter.use(verifyJWT);

// Create deposit for first bid
bidDepositRouter.post('/create', authBidder, createBidDeposit);

// Check if user has deposit for specific auction
bidDepositRouter.get('/check/:auctionId', authBidder, checkBidDeposit);

// Get user's deposit history
bidDepositRouter.get('/my-deposits', authBidder, getUserDeposits);

export default bidDepositRouter;