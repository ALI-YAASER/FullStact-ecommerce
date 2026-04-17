import express from 'express';
import {
    placeOrder,
    placeOrderStripe,
    placeOrderPaymob,
    allOrders,
    userOrders,
    updateStatus,
    getUserOrders,
    deleteOrder,
    verifyStripe
} from '../controller/orderController.js';
import { updateShipping, getAllShipping , getShippingByGovernorate} from "../controller/shippingController.js";
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin Features
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);
orderRouter.post("/shipping/update", adminAuth, updateShipping);
orderRouter.get("/shipping", adminAuth, getAllShipping);
orderRouter.delete('/delete/:orderId',adminAuth, deleteOrder);

// Payment Features
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser , placeOrderStripe);
orderRouter.post('/paymob', authUser, placeOrderPaymob);

// User Feature
orderRouter.post('/userorders',authUser, userOrders);
orderRouter.get('/userorder', authUser, getUserOrders);
orderRouter.get('/:governorate', getShippingByGovernorate);

orderRouter.post('/verifyStripe', authUser, verifyStripe);

export default orderRouter;