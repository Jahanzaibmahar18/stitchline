const Settings = require("../models/Settings");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

async function getOrCreate() {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({
      storeName: "The StitchLane",
      email: process.env.STORE_EMAIL,
      phone: process.env.STORE_PHONE,
      location: process.env.STORE_LOCATION,
      deliveryCharge: Number(process.env.DELIVERY_CHARGE || 250),
    });
  }
  return settings;
}

exports.getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreate();
  sendResponse(res, 200, {
    storeName: settings.storeName,
    email: settings.email,
    phone: settings.phone,
    location: settings.location,
    currency: settings.currency,
    deliveryCharge: settings.deliveryCharge,
    codEnabled: settings.codEnabled,
  });
});

exports.adminGetSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreate();
  sendResponse(res, 200, settings);
});

exports.adminUpdateSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreate();
  Object.assign(settings, req.body);
  await settings.save();
  sendResponse(res, 200, settings, "Settings updated");
});
