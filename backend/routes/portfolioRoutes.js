const express = require("express");
const Portfolio = require("../models/Portfolio");
const { verifyToken } = require("../middleware/auth"); //  Ensure correct import

const router = express.Router();

// Create Portfolio (User must be logged in)
router.post("/", verifyToken, async (req, res) => {
  try {
    const newPortfolio = new Portfolio({ ...req.body, userId: req.user.id }); // ✅ Attach userId from token
    const savedPortfolio = await newPortfolio.save();
    res.status(201).json(savedPortfolio);
  } catch (err) {
    res.status(500).json({ message: "Error saving portfolio", error: err.message });
  }
});

// Get all portfolio templates for current user
router.get("/templates/user", verifyToken, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.user.id })
      .select('templateId name title thumbnail updatedAt');
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ message: "Error fetching templates", error: error.message });
  }
});

// GET portfolio by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    // Validate ID first
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ message: "Portfolio ID is required" });
    }

    // Check if valid MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid portfolio ID format" });
    }

    const portfolio = await Portfolio.findById(req.params.id);
    
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    // Verify ownership
    if (portfolio.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.json(portfolio);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//  Fetch all portfolios for a specific user (Requires Authentication)
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    if (req.params.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized Access" });
    }

    const portfolios = await Portfolio.find({ userId: req.user.id });
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ message: "Error fetching portfolios", error: error.message });
  }
});

// Update Portfolio (Only owner can update)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    if (portfolio.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this portfolio" });
    }

    const updatedPortfolio = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPortfolio);
  } catch (error) {
    res.status(500).json({ message: "Error updating portfolio", error: error.message });
  }
});

//  Delete Portfolio (Only owner can delete)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    if (portfolio.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this portfolio" });
    }

    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ message: "Portfolio deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting portfolio", error: error.message });
  }
});

module.exports = router;
