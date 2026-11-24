const Review = require("../models/Review");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

exports.adminGetReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate("product", "name slug")
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  sendResponse(res, 200, reviews);
});

exports.adminUpdateReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!review) throw new ApiError(404, "Review not found");
  sendResponse(res, 200, review, "Review updated");
});
