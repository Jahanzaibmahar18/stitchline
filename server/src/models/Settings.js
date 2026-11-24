const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: "The StitchLane" },
    email: { type: String, default: "thestitchlane404@gmail.com" },
    phone: { type: String, default: "03121825417" },
    location: { type: String, default: "Bahawalpur, Pakistan" },
    currency: { type: String, default: "PKR" },
    deliveryCharge: { type: Number, default: 250 },
    codEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
