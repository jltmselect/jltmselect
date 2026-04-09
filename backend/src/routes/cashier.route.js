import { Router } from "express";
import {
  getBiddersWithActiveSubscription,
  toggleDiscountAvailed,
} from "../controllers/cashier.controller.js";
import { authCashier } from "../middlewares/auth.middleware.js";

const cashierRouter = Router();

// All cashier routes require cashier authentication
cashierRouter.use(authCashier);

// Get all bidders with active subscription
cashierRouter.get("/bidders", getBiddersWithActiveSubscription);

// Toggle discount availed status
cashierRouter.patch("/bidders/:userId/discount", toggleDiscountAvailed);

export default cashierRouter;