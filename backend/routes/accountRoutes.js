import express from "express";

import {
    getMyAccount,
    getAllAccounts,
    freezeAccount,
    unfreezeAccount,
} from "../controllers/accountController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMyAccount);

router.get("/admin/accounts", protect, adminOnly, getAllAccounts);

router.patch(
    "/admin/accounts/:id/freeze",
    protect,
    adminOnly,
    freezeAccount
);

router.patch(
    "/admin/accounts/:id/unfreeze",
    protect,
    adminOnly,
    unfreezeAccount
);

export default router;