// backend/routes/accountRoutes.js
import express from "express";
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// Simple helper to generate account number like AC123456
const generateAccountNumber = () => {
  return "AC" + Math.floor(100000 + Math.random() * 900000);
};

// POST /api/accounts  -> create new account
router.post("/", async (req, res) => {
  try {
    const { holderName, initialDeposit } = req.body;

    if (!holderName) {
      return res.status(400).json({ message: "Holder name is required" });
    }

    const amount = Number(initialDeposit) || 0;
    if (amount < 0) {
      return res
        .status(400)
        .json({ message: "Initial deposit cannot be negative" });
    }

    const account = await Account.create({
      holderName,
      accountNumber: generateAccountNumber(),
      balance: amount,
    });

    // log initial deposit as a transaction
    if (amount > 0) {
      await Transaction.create({
        account: account._id,
        type: "deposit",
        amount,
        description: "Initial deposit",
      });
    }

    res.status(201).json(account);
  } catch (error) {
    console.error("Error creating account:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/accounts  -> all accounts
router.get("/", async (req, res) => {
  try {
    const accounts = await Account.find().sort({ createdAt: -1 });
    res.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/accounts/:id  -> one account + its transactions
router.get("/:id", async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const transactions = await Transaction.find({ account: account._id }).sort({
      createdAt: -1,
    });

    res.json({ account, transactions });
  } catch (error) {
    console.error("Error fetching account:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/accounts/:id/deposit  -> deposit money
router.post("/:id/deposit", async (req, res) => {
  try {
    const { amount, description } = req.body;
    const amt = Number(amount);

    if (!amt || amt <= 0) {
      return res.status(400).json({ message: "Amount must be > 0" });
    }

    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    account.balance += amt;
    await account.save();

    const tx = await Transaction.create({
      account: account._id,
      type: "deposit",
      amount: amt,
      description: description || "Deposit",
    });

    res.json({ account, transaction: tx });
  } catch (error) {
    console.error("Error depositing:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/accounts/:id/withdraw  -> withdraw money
router.post("/:id/withdraw", async (req, res) => {
  try {
    const { amount, description } = req.body;
    const amt = Number(amount);

    if (!amt || amt <= 0) {
      return res.status(400).json({ message: "Amount must be > 0" });
    }

    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.balance < amt) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    account.balance -= amt;
    await account.save();

    const tx = await Transaction.create({
      account: account._id,
      type: "withdrawal",
      amount: amt,
      description: description || "Withdrawal",
    });

    res.json({ account, transaction: tx });
  } catch (error) {
    console.error("Error withdrawing:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// 👇 THIS LINE IS IMPORTANT
export default router;
