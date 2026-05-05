const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema(
  {
    roundType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const experienceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    college: {
      type: String,
      required: true,
    },
    outcome: {
      type: String,
      enum: ["offer", "reject", "pending"],
      default: "pending",
    },
    rounds: {
      type: [roundSchema],
      default: [],
    },
    topicsAsked: {
      type: [String],
      default: [],
    },
    tips: {
      type: String,
      default: "",
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

experienceSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

module.exports = mongoose.model("Experience", experienceSchema);
