import express from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { getShippingRates, getTrackingInfo, purchaseLabel } from '../controllers/shipping.controller.js';

const shippingRouter = express.Router();

// Shipping routes
shippingRouter.post('/rates', auth, getShippingRates);

// Purchase shipping label after payment
shippingRouter.post('/purchase-label', auth, purchaseLabel);

// Get tracking information
shippingRouter.get('/tracking/:auctionId', auth, getTrackingInfo);

export default shippingRouter;