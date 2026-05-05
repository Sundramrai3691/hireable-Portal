const mongoose = require("mongoose");

const trackerHistorySchema = new mongoose.Schema(
  {
    stage: {
      type: String,
      required: true,
    },
    movedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const trackerApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },
    companyName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    currentStage: {
      type: String,
      enum: [
        "Applied",
        "OA",
        "Tech Round 1",
        "Tech Round 2",
        "HR",
        "Offer",
        "Rejected",
      ],
      default: "Applied",
    },
    stageHistory: {
      type: [trackerHistorySchema],
      default: [],
    },
    nextAction: {
      type: String,
      default: "",
    },
    nextActionDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    offerCTC: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

trackerApplicationSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

module.exports = mongoose.model("TrackerApplication", trackerApplicationSchema);
