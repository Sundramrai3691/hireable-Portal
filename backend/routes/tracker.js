const express = require("express");
const authMiddleware = require("../middleware/auth");
const TrackerApplication = require("../models/TrackerApplication");
const { buildDateCursorPageQuery, buildPage } = require("../utils/cursorPagination");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { limit, cursor, stage } = req.query;
    const filter = {
      userId: req.user.id,
      ...(stage ? { currentStage: stage } : {}),
    };

    const page = await buildDateCursorPageQuery(TrackerApplication, filter, {
      cursor,
      limit,
      dateField: "updatedAt",
    });
    const items = await TrackerApplication.find(page.filter)
      .sort(page.sort)
      .limit(page.limit + 1);

    res.json(buildPage(items, page.limit, (item) => item.toJSON()));
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message || "Failed to fetch tracker entries." });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      companyId = null,
      companyName,
      role,
      appliedDate,
      currentStage = "Applied",
      nextAction = "",
      nextActionDate = null,
      notes = "",
      offerCTC = null,
    } = req.body;

    if (!companyName || !role) {
      return res.status(400).json({ error: "companyName and role are required." });
    }

    const trackerItem = new TrackerApplication({
      userId: req.user.id,
      companyId,
      companyName,
      role,
      appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
      currentStage,
      stageHistory: [{ stage: currentStage, movedAt: new Date(), notes }],
      nextAction,
      nextActionDate: nextActionDate ? new Date(nextActionDate) : null,
      notes,
      offerCTC,
    });

    await trackerItem.save();
    res.status(201).json(trackerItem.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create tracker entry." });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const trackerItem = await TrackerApplication.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trackerItem) {
      return res.status(404).json({ error: "Tracker entry not found." });
    }

    const {
      currentStage,
      notes,
      nextAction,
      nextActionDate,
      offerCTC,
    } = req.body;

    if (currentStage && currentStage !== trackerItem.currentStage) {
      trackerItem.currentStage = currentStage;
      trackerItem.stageHistory.push({
        stage: currentStage,
        movedAt: new Date(),
        notes: notes || trackerItem.notes || "",
      });
    }

    if (typeof notes === "string") {
      trackerItem.notes = notes;
    }
    if (typeof nextAction === "string") {
      trackerItem.nextAction = nextAction;
    }
    if (nextActionDate !== undefined) {
      trackerItem.nextActionDate = nextActionDate ? new Date(nextActionDate) : null;
    }
    if (offerCTC !== undefined) {
      trackerItem.offerCTC = offerCTC ? Number(offerCTC) : null;
    }

    await trackerItem.save();
    res.json(trackerItem.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update tracker entry." });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await TrackerApplication.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Tracker entry not found." });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete tracker entry." });
  }
});

module.exports = router;
