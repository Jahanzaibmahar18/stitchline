function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
  res.status(status).json({
    success: false,
    message,
    errors: err.errors || undefined,
  });
}

module.exports = errorHandler;
