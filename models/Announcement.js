const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "Arena News",
    },

    createdBy: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Announcement", announcementSchema);
