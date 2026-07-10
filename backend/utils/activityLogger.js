const Activity = require("../models/activityModel");

const logActivity = async ({ userId, action, entityType, entityId, description }) => {
  try {
    await Activity.create({ userId, action, entityType, entityId, description });
  } catch (error) {
    console.error("Activity log error:", error.message);
  }
};

module.exports = { logActivity };
