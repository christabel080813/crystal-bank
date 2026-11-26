import express from "express";
import { deposit, withdraw, transfer, getTransactions, getAllTransactions} from "../controllers/transactionController.js";
import { protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/deposit", protect, deposit);
router.post("/withdraw", protect, withdraw);
router.post("/transfer", protect, transfer);
router.get("/", protect, getTransactions);
router.get("/all", protect, getAllTransactions);

export default router;