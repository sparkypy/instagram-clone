export const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      errors: [],
    });
  }

  // mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((ele) => ele.message);

    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors,
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [];

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
